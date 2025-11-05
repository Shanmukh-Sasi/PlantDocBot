import { useState } from "react";
import "./App.css";
import { RECOMMENDATIONS } from "./recommendations";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!file && !text) {
      alert("Please upload an image or enter text.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    if (file) formData.append("file", file);
    if (text) formData.append("text", text);

    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Prediction failed.");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching prediction. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        background: "linear-gradient(to right, #b2f2bb, #96f2d7)",
        padding: "50px 20px",
      }}
    >
      {/* Title */}
      <h1 className="fw-bold mb-5 text-success d-flex align-items-center gap-2">
         Plant Docter
      </h1>
      <div className="curve"></div>

      {/* Card Section */}
      <div className="d-flex flex-column flex-md-row gap-5 justify-content-center mb-4">
        {/* Image Prediction Card */}
        <div
          className="card shadow-lg border-0 p-4"
          style={{
            width: "22rem",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h4 className="text-primary mb-4">🖼️ Image Prediction</h4>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-3"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <small className="text-muted">
            Upload an image of a plant leaf.
          </small>
        </div>

        {/* Text Classification Card */}
        <div
          className="card shadow-lg border-0 p-4"
          style={{
            width: "22rem",
            borderRadius: "20px",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h4 className="text-primary mb-4">💬 Text Classification</h4>
          <textarea
            rows="4"
            className="form-control mb-3"
            placeholder="Enter text to analyze sentiment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <small className="text-muted fst-italic">
            Example: “The plant looks very healthy!”
          </small>
        </div>
      </div>

      {/* Predict Button */}
      <button
        className="btn btn-success btn-lg px-5 py-2 shadow-sm"
        onClick={handlePredict}
        disabled={loading}
        style={{
          borderRadius: "50px",
          fontWeight: "500",
        }}
      >
        {loading ? "⏳ Predicting..." : "🔍 Predict"}
      </button>

      {/* Result Section */}
      {result && (
        <div
          className="card shadow-lg border-0 p-4 mt-5 text-start"
          style={{
            maxWidth: "700px",
            background: "rgba(255, 255, 255, 0.95)",
            borderRadius: "20px",
          }}
        >
          <h4 className="text-success mb-3">🧾 Diagnosis Feedback</h4>
          <hr />

          {/* Image Prediction */}
          {result.image_prediction && (
            <>
              <p>
                <strong> Detected Disease (via Image):</strong>{" "}
                {result.image_prediction}
              </p>
              <p>
                <strong> Confidence:</strong>{" "}
                {(result.image_confidence * 100).toFixed(2)}%
              </p>
               <p className="text-muted fst-italic">
      <strong>💡 Recommendation:</strong>{" "}
      {RECOMMENDATIONS[result.image_prediction] ||
        "No specific recommendation found for this condition."}
    </p>
    <hr />
            </>
          )}

          {/* Text Prediction */}
          {result.text_prediction && (
            <>
              <p>
                <strong> Text Sentiment:</strong> {result.text_prediction}
              </p>
              <p>
                <strong>Confidence:</strong>{" "}
                {(result.text_confidence * 100).toFixed(2)}%
              </p>
              {/* <p className="text-muted fst-italic">
                Interpretation: The provided text expresses this sentiment.
              </p> */}
            </>
          )}
        </div>
      )}
    </div>
  );
}
