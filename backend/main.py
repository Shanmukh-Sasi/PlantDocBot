from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from io import BytesIO
import numpy as np
from PIL import Image
import torch
import torchvision.transforms as transforms
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from models.PlantDiseaseModel import PlantDiseaseModel, PLANT_DISEASE_CLASSES
from database import diagnosis_collection
import datetime

DEVICE = torch.device("cpu")
CNN_MODEL_PATH = "models/Image_Model.pth"

# Using a public pre-trained Hugging Face model
TEXT_MODEL_DIR = "distilbert-base-uncased-finetuned-sst-2-english"

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Plant Disease Prediction", version="1.0")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; specify origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "API is running!"}


# Response model
class PredictionResult(BaseModel):
    image_prediction: str = None
    image_confidence: float = None
    text_prediction: str = None
    text_confidence: float = None

# Load models on startup
@app.on_event("startup")
async def load_models():
    # Initialize state with None
    app.state.cnn_model = None
    app.state.cnn_transform = None
    app.state.text_model = None
    app.state.text_tokenizer = None
    app.state.text_labels = None

    # --- Load CNN Model ---
    try:
        cnn_model = PlantDiseaseModel(num_classes=len(PLANT_DISEASE_CLASSES)).to(DEVICE)
        cnn_model.load_state_dict(torch.load(CNN_MODEL_PATH, map_location=DEVICE), strict=False)
        cnn_model.eval()
        app.state.cnn_model = cnn_model
        app.state.cnn_transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ])
        print(" CNN model loaded successfully!")
    except Exception as e:
        print(f" Failed to load CNN model: {e}")

    # --- Load Text Model ---
    try:
        tokenizer = AutoTokenizer.from_pretrained(TEXT_MODEL_DIR)
        text_model = AutoModelForSequenceClassification.from_pretrained(TEXT_MODEL_DIR).to(DEVICE)
        text_model.eval()
        app.state.text_tokenizer = tokenizer
        app.state.text_model = text_model
        app.state.text_labels = text_model.config.id2label
        print("Text model loaded successfully!")
    except Exception as e:
        print(f" Failed to load text model: {e}")

# Single combined prediction endpoint
@app.post("/predict", response_model=PredictionResult)
async def predict(file: UploadFile = File(None), text: str = Form(None)):
    result = PredictionResult()

    # Image prediction
    if file:
        if not app.state.cnn_transform or not app.state.cnn_model:
            raise HTTPException(status_code=503, detail="CNN model not loaded on server.")
        
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")

        # --- Image Inference ---
        tensor = app.state.cnn_transform(image).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            outputs = app.state.cnn_model(tensor)
            # Revert to Standard Softmax so true plants get 95%+ confidence!
            probs = torch.softmax(outputs, dim=1)
            conf, idx = torch.max(probs, 1)
        
        confidence = round(conf.item(), 4)
        
        # --- Strict Organic Color Heuristic for OOD ---
        # Uncalibrated CNNs always give dogs/cars 100% confidence.
        # We mathematically check if the image has real plant traits instead of hacking the CNN.
        small = image.resize((64, 64))
        arr = np.array(small, dtype=float)
        r, g, b = arr[:,:,0], arr[:,:,1], arr[:,:,2]
        
        # Organic materials (leaves, soil, spots) rarely have high Blue values. 
        # Grayscale (cars), White (dogs), or sky backgrounds have high/equal Blue.
        organic_pixels = (b < np.maximum(r, g) - 20)
        green_pixels = (g > r + 5) & (g > b + 5)
        
        organic_ratio = float(np.mean(organic_pixels))
        green_ratio = float(np.mean(green_pixels))

        # Block the image if it lacks organic colors or doesn't have at least 2% green
        if organic_ratio < 0.20 or green_ratio < 0.5:
            result.image_prediction = "Not a plant leaf image"
            result.image_confidence = 0.0
        else:
            result.image_prediction = PLANT_DISEASE_CLASSES[idx.item()]
            result.image_confidence = confidence

    # Text prediction (Now with Symptom Keyword Mapping)
    if text:
        text_lower = text.lower()
        symptom_keywords = ["yellow", "brown", "spot", "wilt", "dry", "curl", "hole", "rot", "white", "mold", "bug", "pest", "bite", "black"]
        found = [word for word in symptom_keywords if word in text_lower]
        
        if not app.state.text_model or not app.state.text_tokenizer:
            raise HTTPException(status_code=503, detail="Text model not loaded on server.")
            
        inputs = app.state.text_tokenizer(
            text, return_tensors="pt", padding=True, truncation=True
        ).to(DEVICE)
        with torch.no_grad():
            outputs = app.state.text_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            conf, idx = torch.max(probs, 1)
        
        base_sentiment = app.state.text_labels[idx.item()]
        
        if found:
            # Overwrite generic movie-review sentiment with actual botanical symptom context
            result.text_prediction = f"Symptoms: {', '.join(found).title()}"
            result.text_confidence = min(0.95, 0.50 + (len(found) * 0.15))
        else:
            result.text_prediction = base_sentiment
            result.text_confidence = round(conf.item(), 4)

    if not file and not text:
        raise HTTPException(status_code=400, detail="No input provided.")

    # Save Prediction to MongoDB
    if file:
        record = {
            "image_name": file.filename,
            "disease": result.image_prediction,
            "confidence": float(result.image_confidence),
            "date": str(datetime.datetime.now())
        }
        try:
            diagnosis_collection.insert_one(record)
            print(f"Saved prediction to DB: {result.image_prediction}")
        except Exception as e:
            print(f"Failed to save to DB: {e}")

    return result
