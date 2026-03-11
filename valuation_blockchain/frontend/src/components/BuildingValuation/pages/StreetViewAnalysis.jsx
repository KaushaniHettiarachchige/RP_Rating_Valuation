// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// const StreetViewAnalysis = () => {
//   const [image, setImage] = useState(null);
//   const [prediction, setPrediction] = useState('');
//   const [area, setArea] = useState({ building: 0, gate: 0, vegetation: 0 });

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       // Perform the prediction on the image
//       performPrediction(file);
//     }
//   };

//   const performPrediction = (file) => {
//     // Here, you would make the prediction request to your model
//     // For now, this is a placeholder example
//     setPrediction('Boundary Wall/Gate');
//     setArea({ building: 120, gate: 30, vegetation: 20 });
//   };

//   return (
//     <div className="street-view-container">
//       <h2 className="street-view-title">Street View Analysis</h2>

//       {/* Upload Image Section */}
//       <div className="upload-section">
//         <input type="file" onChange={handleImageUpload} className="file-input" />
//         {image && <img src={image} alt="Uploaded Street View" className="uploaded-image" />}
//       </div>

//       {/* Predicted Class and Area */}
//       {prediction && (
//         <div className="prediction-card">
//           <h3 className="prediction-title">Predicted Class: {prediction}</h3>
//         </div>
//       )}

//       {/* Calculate Valuation Button */}
//       <div className="button-center">
//         <Link to="/valuation-calculation" className="valuation-button">
//           Go to Valuation Calculation
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default StreetViewAnalysis;

import React, { useState } from "react";

import { predictStreet, calculateValuation } from "../api";

export default function StreetViewAnalysis() {
  const [imageUrl, setImageUrl] = useState(null);
  const [pred, setPred] = useState(null);

  // valuation inputs
  const [monthlyRent, setMonthlyRent] = useState("");
  const [useType, setUseType] = useState("residential");
  const [ratePct, setRatePct] = useState("");

  // valuation output
  const [result, setResult] = useState(null);

  // optional UI states
  const [loadingPred, setLoadingPred] = useState(false);
  const [loadingVal, setLoadingVal] = useState(false);
  const [error, setError] = useState("");

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // simple validation
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (jpg/png/webp).");
      return;
    }

    setError("");
    setPred(null);
    setResult(null);
    setImageUrl(URL.createObjectURL(file));

    try {
      setLoadingPred(true);
      const out = await predictStreet(file); // ✅ calls /predict/street
      setPred(out);
    } catch (err) {
      setError("Prediction failed. Make sure backend is running on port 8000.");
    } finally {
      setLoadingPred(false);
    }
  }

  async function onCalculate() {
    if (!pred) {
      alert("Upload an image first to get the prediction.");
      return;
    }

    // Must have at least monthly rent OR annual value; here we use monthly rent
    if (!monthlyRent || Number(monthlyRent) <= 0) {
      alert("Please enter a valid Monthly Rent (LKR).");
      return;
    }

    setError("");

    const payload = {
      monthly_rent: Number(monthlyRent),
      property_use: useType,
      council_rate_pct: ratePct ? Number(ratePct) : null,

      // ✅ important: pass street prediction as st_class
      st_class: pred.predicted_class,
      confidence: pred.confidence,
    };

    try {
      setLoadingVal(true);
      const val = await calculateValuation(payload); // ✅ calls /valuation/calculate
      setResult(val);
    } catch (err) {
      setError("Valuation failed. Check backend logs.");
    } finally {
      setLoadingVal(false);
    }
  }

  function downloadReport() {
    const report = {
      type: "street_view",
      prediction: pred,
      valuation: result,
      inputs: {
        monthlyRent,
        propertyUse: useType,
        councilRatePct: ratePct || "default",
      },
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "street_view_result.json";
    a.click();
  }

  return (
    <>
      <main className="page">
        <h2 className="pageTitle">Street View Analysis</h2>

        {error && (
          <div className="card" style={{ borderLeft: "6px solid #d9534f" }}>
            <p style={{ margin: 0, color: "#d9534f" }}>⚠️ {error}</p>
          </div>
        )}

        {/* 1) Upload */}
        <section className="card">
          <h3>1) Upload Street View Image</h3>
          <input type="file" accept="image/*" onChange={onUpload} />
          {imageUrl && <img className="preview" src={imageUrl} alt="street" />}

          {loadingPred && <p className="muted">Predicting... please wait</p>}
        </section>

        {/* 2) Prediction + valuation inputs */}
        {pred && (
          <section className="card">
            <h3>2) Prediction</h3>
            <p>
              <b>Class:</b> {pred.predicted_class}
            </p>
            <p>
              <b>Confidence:</b> {(pred.confidence * 100).toFixed(1)}%
            </p>

            <hr style={{ margin: "16px 0", opacity: 0.3 }} />

            <h3>3) Valuation Inputs</h3>

            <div className="formRow">
              <label>Monthly Rent (LKR)</label>
              <input
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g., 75000"
              />
            </div>

            <div className="formRow">
              <label>Property Use</label>
              <select
                value={useType}
                onChange={(e) => setUseType(e.target.value)}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div className="formRow">
              <label>Council Rate % (optional)</label>
              <input
                value={ratePct}
                onChange={(e) => setRatePct(e.target.value)}
                placeholder="leave blank to use default"
              />
              <small className="muted">
                Different councils may apply different percentages. Keep it
                configurable in your prototype.
              </small>
            </div>

            <button className="btn" onClick={onCalculate} disabled={loadingVal}>
              {loadingVal ? "Calculating..." : "Calculate Rates Payable"}
            </button>
          </section>
        )}

        {/* 4) Results */}
        {result && (
          <section className="card">
            <h3>4) Valuation Result</h3>

            <p>
              <b>Adjusted Annual Value:</b>{" "}
              {Number(result.annual_value).toFixed(2)} LKR
            </p>
            <p>
              <b>Annual Rates Payable:</b>{" "}
              {Number(result.annual_rates).toFixed(2)} LKR
            </p>
            <p>
              <b>Quarterly Rates:</b>{" "}
              {Number(result.quarterly_rates).toFixed(2)} LKR
            </p>

            <p className="muted" style={{ marginTop: 12 }}>
              {result.explanation}
            </p>

            <button className="btnSecondary" onClick={downloadReport}>
              Download JSON Report
            </button>
          </section>
        )}
      </main>
    </>
  );
}
