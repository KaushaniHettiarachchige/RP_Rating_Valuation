import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const StreetViewAnalysis = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [area, setArea] = useState({ building: 0, gate: 0, vegetation: 0 });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      // Perform the prediction on the image
      performPrediction(file);
    }
  };

  const performPrediction = (file) => {
    // Here, you would make the prediction request to your model
    // For now, this is a placeholder example
    setPrediction('Boundary Wall/Gate');
    setArea({ building: 120, gate: 30, vegetation: 20 });
  };

  return (
    <div className="street-view-container">
      <h2 className="street-view-title">Street View Analysis</h2>

      {/* Upload Image Section */}
      <div className="upload-section">
        <input type="file" onChange={handleImageUpload} className="file-input" />
        {image && <img src={image} alt="Uploaded Street View" className="uploaded-image" />}
      </div>

      {/* Predicted Class and Area */}
      {prediction && (
        <div className="prediction-card">
          <h3 className="prediction-title">Predicted Class: {prediction}</h3>
        </div>
      )}

      {/* Calculate Valuation Button */}
      <div className="button-center">
        <Link to="/valuation-calculation" className="valuation-button">
          Go to Valuation Calculation
        </Link>
      </div>
    </div>
  );
};

export default StreetViewAnalysis;
