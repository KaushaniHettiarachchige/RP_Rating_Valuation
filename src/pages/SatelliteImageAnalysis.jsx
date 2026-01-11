import React, { useState } from "react";
import { Link } from "react-router-dom";

const SatelliteImageAnalysis = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [area, setArea] = useState({
    building: 0,
    bareLand: 0,
    vegetation: 0,
  });

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      performPrediction(file);
    }
  };

  // Placeholder prediction logic (replace with model API later)
  const performPrediction = (file) => {
    setPrediction("Building");

    // Example predicted areas (m²)
    setArea({
      building: 150,
      bareLand: 120,
      vegetation: 180,
    });
  };

  return (
    <div className="satellite-container">
      <h2 className="satellite-title">Satellite Image Analysis</h2>

      {/* Upload Image Section */}
      <div className="upload-section">
        <input
          type="file"
          onChange={handleImageUpload}
          className="file-input"
          accept="image/*"
        />

        {image && (
          <img
            src={image}
            alt="Uploaded Satellite"
            className="uploaded-image"
          />
        )}
      </div>

      {/* Prediction Result */}
      {prediction && (
        <div className="prediction-card">
          <h3 className="prediction-title">
            Predicted Class: {prediction}
          </h3>
        </div>
      )}

      {/* Calculate Valuation */}
      <div className="button-center">
        <Link to="/valuation-calculation" className="valuation-button">
          Go to Valuation Calculation
        </Link>
      </div>
    </div>
  );
};

export default SatelliteImageAnalysis;
