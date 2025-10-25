from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from pydantic import BaseModel
from io import BytesIO
from PIL import Image
import torch
import torchvision.transforms as transforms
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from models.PlantDiseaseModel import PlantDiseaseModel, PLANT_DISEASE_CLASSES

DEVICE = torch.device("cpu")
CNN_MODEL_PATH = "models/Image_Model.pth"

# Using a public pre-trained Hugging Face model
TEXT_MODEL_DIR = "distilbert-base-uncased-finetuned-sst-2-english"

app = FastAPI(title="Plant Disease Prediction", version="1.0")
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
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image.")
        image_bytes = await file.read()
        image = Image.open(BytesIO(image_bytes)).convert("RGB")
        tensor = app.state.cnn_transform(image).unsqueeze(0).to(DEVICE)
        with torch.no_grad():
            outputs = app.state.cnn_model(tensor)
            probs = torch.softmax(outputs, dim=1)
            conf, idx = torch.max(probs, 1)
        result.image_prediction = PLANT_DISEASE_CLASSES[idx.item()]
        result.image_confidence = round(conf.item(), 4)

    # Text prediction
    if text:
        inputs = app.state.text_tokenizer(
            text, return_tensors="pt", padding=True, truncation=True
        ).to(DEVICE)
        with torch.no_grad():
            outputs = app.state.text_model(**inputs)
            probs = torch.softmax(outputs.logits, dim=1)
            conf, idx = torch.max(probs, 1)
        result.text_prediction = app.state.text_labels[idx.item()]
        result.text_confidence = round(conf.item(), 4)

    if not file and not text:
        raise HTTPException(status_code=400, detail="No input provided.")

    return result
