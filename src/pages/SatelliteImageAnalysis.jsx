// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// const SatelliteImageAnalysis = () => {
//   const [image, setImage] = useState(null);
//   const [prediction, setPrediction] = useState("");
//   const [area, setArea] = useState({
//     building: 0,
//     bareLand: 0,
//     vegetation: 0,
//   });

//   // Handle image upload
//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setImage(URL.createObjectURL(file));
//       performPrediction(file);
//     }
//   };

//   // Placeholder prediction logic (replace with model API later)
//   const performPrediction = (file) => {
//     setPrediction("Building");

//     // Example predicted areas (m²)
//     setArea({
//       building: 150,
//       bareLand: 120,
//       vegetation: 180,
//     });
//   };

//   return (
//     <div className="satellite-container">
//       <h2 className="satellite-title">Satellite Image Analysis</h2>

//       {/* Upload Image Section */}
//       <div className="upload-section">
//         <input
//           type="file"
//           onChange={handleImageUpload}
//           className="file-input"
//           accept="image/*"
//         />

//         {image && (
//           <img
//             src={image}
//             alt="Uploaded Satellite"
//             className="uploaded-image"
//           />
//         )}
//       </div>

//       {/* Prediction Result */}
//       {prediction && (
//         <div className="prediction-card">
//           <h3 className="prediction-title">
//             Predicted Class: {prediction}
//           </h3>
//         </div>
//       )}

//       {/* Calculate Valuation */}
//       <div className="button-center">
//         <Link to="/valuation-calculation" className="valuation-button">
//           Go to Valuation Calculation
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SatelliteImageAnalysis;

import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { predictSatellite, calculateValuation } from "../api";

export default function SatelliteAnalysis() {
  const [imageUrl, setImageUrl] = useState(null);
  const [pred, setPred] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [useType, setUseType] = useState("residential");
  const [ratePct, setRatePct] = useState("");
  const [result, setResult] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [error, setError] = useState("");
  const [loadingVal, setLoadingVal] = useState(false);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPred(null);
    setResult(null);
    setImageUrl(URL.createObjectURL(file));

    try {
      setLoadingPred(true);
      const out = await predictSatellite(file);
      setPred(out);
    } catch (err) {
      setError(err.message || "Prediction failed. Make sure backend is running on port 8001.");
    } finally {
      setLoadingPred(false);
    }
  }

  async function onCalculate() {
    if (!pred) return alert("Upload an image first.");

    const payload = {
      monthly_rent: monthlyRent ? Number(monthlyRent) : null,
      property_use: useType,
      council_rate_pct: ratePct ? Number(ratePct) : null,
      sat_class: pred.predicted_class,
      confidence: pred.confidence,
    };

    try {
      setLoadingVal(true);
      const val = await calculateValuation(payload);
      setResult(val);
    } catch (err) {
      setError(err.message || "Valuation failed. Check backend logs.");
    } finally {
      setLoadingVal(false);
    }
  }

  return (
    <>
      <Header />
      <main className="page">
        <h2 className="pageTitle">Satellite Image Analysis</h2>

        {error && (
          <div className="card" style={{ borderLeft: "6px solid #d9534f" }}>
            <p style={{ margin: 0, color: "#d9534f" }}>⚠️ {error}</p>
          </div>
        )}

        <section className="card">
          <h3>1) Upload Satellite Image</h3>
          <input type="file" accept="image/*" onChange={onUpload} />
          {imageUrl && <img className="preview" src={imageUrl} alt="sat" />}
          {loadingPred && <p className="muted">⏳ Predicting... please wait</p>}
        </section>

        {pred && (
          <section className="card">
            <h3>2) Prediction</h3>
            <p><b>Class:</b> {pred.predicted_class}</p>
            <p><b>Confidence:</b> {(pred.confidence * 100).toFixed(1)}%</p>

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
              <select value={useType} onChange={(e) => setUseType(e.target.value)}>
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
                Different councils may apply different percentages. Keep it configurable in your prototype.
              </small>
            </div>

            <button className="btn" onClick={onCalculate} disabled={loadingVal}>
              {loadingVal ? "Calculating..." : "Calculate Rates Payable"}
            </button>
          </section>
        )}

        {result && (
          <section className="card">
            <h3>4) Valuation Result</h3>
            <p><b>Adjusted Annual Value:</b> {Number(result.annual_value).toFixed(2)} LKR</p>
            <p><b>Annual Rates Payable:</b> {Number(result.annual_rates).toFixed(2)} LKR</p>
            <p><b>Quarterly Rates:</b> {Number(result.quarterly_rates).toFixed(2)} LKR</p>
            <p className="muted" style={{ marginTop: 12 }}>
              {result.explanation}
            </p>

            <button
              className="btnSecondary"
              onClick={() => {
                const blob = new Blob([JSON.stringify({ pred, result }, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = "satellite_result.json";
                a.click();
              }}
            >
              Download JSON Report
            </button>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}