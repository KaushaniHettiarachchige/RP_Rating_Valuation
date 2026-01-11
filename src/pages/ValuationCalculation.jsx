import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./ValuationCalculation.css";

const ValuationCalculation = () => {
  const [area, setArea] = useState(450);
  const [predictedClass, setPredictedClass] = useState("Building");
  const [valuation, setValuation] = useState(null);
  const [rates, setRates] = useState(null);

  // Demo valuation factors (LKR per m²)
  const valuationFactors = {
    Building: 135,
    "Bare Land": 90,
    Vegetation: 60,
    "Boundary Wall/Gate": 80,
    "Building Front": 120,
  };

  const calculateValuation = () => {
    const factor = valuationFactors[predictedClass];
    const value = area * factor;
    const ratesPayable = value * 0.06; // demo 6%

    setValuation(value);
    setRates(ratesPayable);
  };

  return (
    <>
      <Header />

      {/* HERO SECTION */}
      <section className="valuation-hero">
        <h1>Valuation Calculation</h1>
        <p>Enter Details → Review Valuation → Final Calculation</p>
      </section>

      {/* MAIN CONTENT */}
      <div className="valuation-container">
        <div className="valuation-card">
          <h2>Enter Property Details</h2>
          <p className="valuation-subtext">
            Review the analysis details and calculate the valuation for the property.
          </p>

          <div className="valuation-grid">
            {/* LEFT SIDE */}
            <div className="valuation-left">
              <label>Building Area (m²)</label>
              <div className="input-row">
                <input
                  type="number"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                />
                <span>m²</span>
              </div>

              <div className="predicted-box">
                <p>
                  <strong>Predicted Class:</strong> {predictedClass}
                </p>

                <select
                  value={predictedClass}
                  onChange={(e) => setPredictedClass(e.target.value)}
                >
                  {Object.keys(valuationFactors).map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>

                <button onClick={calculateValuation}>
                  Calculate Valuation
                </button>
              </div>
            </div>

            {/* RIGHT SIDE */}
            {/* <div className="valuation-right">
              <h3>Valuation Factor</h3>
              <p className="factor-value">
                LKR {valuationFactors[predictedClass]} <span>per m²</span>
              </p>

              <button className="full-btn" onClick={calculateValuation}>
                Calculate Valuation
              </button>
            </div> */}
          </div>

          {/* RESULT SECTION */}
          <div className="valuation-result">
            <h3>Calculated Valuation</h3>

            <h2>
              {valuation ? `LKR ${valuation.toLocaleString()}` : "LKR —"}
            </h2>

            <p>
              <strong>Rates Payable:</strong>{" "}
              {rates ? `LKR ${rates.toLocaleString()}` : "LKR —"}
            </p>

            <small>
              Calculated based on property class, area, and valuation factor
              (Research Prototype – Not official CMC formula)
            </small>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ValuationCalculation;
