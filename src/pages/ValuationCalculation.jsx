import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ValuationCalculation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Destructure state to ensure we keep track of image paths from Step 2 & 4
  const {
    aggregatedVariables,
    satellite_image_path,
    street_view_image_path
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!aggregatedVariables) {
      setError("No variables found. Please complete Step 6 first.");
      return;
    }
    performCalculation();
  }, [aggregatedVariables]);

  const performCalculation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/calculate-y2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(aggregatedVariables),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Calculation failed");

      setCalculationResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalize = async () => {
    try {
      // Step 8 logic: Finalize the entire assessment
      const response = await fetch("http://localhost:8001/finalize-assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          building_value: calculationResult.building_value,
          parcel_id: aggregatedVariables.parcel_id || "REF-AUTO",
          y2_rate: calculationResult.y2_value,
          fab: aggregatedVariables.fab
        }),
      });

      const finalAssessmentData = await response.json();

      // Navigate to the final Report with the Full Audit Trail
      navigate('/assessment-report', {
        state: {
          assessment: finalAssessmentData,
          auditTrail: {
            images: {
              satellite: satellite_image_path,
              street: street_view_image_path
            },
            variables: aggregatedVariables,
            breakdown: calculationResult
          }
        }
      });
    } catch (err) {
      console.error("Finalization failed:", err);
    }
  };

  if (!aggregatedVariables) {
    return (
      <div className="dashboard-container">
        <Header />
        <main className="main-content" style={{ textAlign: "center", padding: "5rem" }}>
          <h2>Missing Data Context</h2>
          <button onClick={() => navigate('/collect-variables')} className="btn-primary">Return to Step 6</button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Header />
      <main className="main-content" style={{ padding: "2rem" }}>
        <section style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "#2c3e50" }}>Step 7: Equation (2) Calculation</h1>
          <p style={{ color: "#7f8c8d" }}>Applying DRC regression coefficients to derived building attributes.</p>
        </section>

        <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

          {/* LEFT: INPUT SUMMARY */}
          <div style={{ padding: "1.5rem", borderRadius: "12px", background: "#f8f9fa", border: "1px solid #e1e8ed" }}>
            <h3 style={{ borderBottom: "2px solid #3498db", paddingBottom: "0.5rem" }}>Input Summary</h3>
            <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
              <li style={listStyle}><strong>FAB:</strong> {aggregatedVariables.fab} sq.ft</li>
              <li style={listStyle}><strong>AOP:</strong> {aggregatedVariables.aop}</li>
              <li style={listStyle}><strong>LOP:</strong> {aggregatedVariables.lop}</li>
              <li style={listStyle}><strong>COB:</strong> {aggregatedVariables.cob}</li>
              <li style={listStyle}><strong>AOB:</strong> {aggregatedVariables.aob} Years</li>
            </ul>
          </div>

          {/* RIGHT: CALCULATION RESULT */}
          <div style={{ padding: "2rem", borderRadius: "12px", backgroundColor: "#2c3e50", color: "#fff" }}>
            {loading ? (
              <div style={{ textAlign: 'center' }}>Calculating...</div>
            ) : error ? (
              <div style={{ color: '#ff7675' }}>{error}</div>
            ) : calculationResult && (
              <>
                <div>
                  <span style={{ color: "#3498db", fontSize: "0.9rem" }}>UNIT RATE (Y2)</span>
                  <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#f1c40f" }}>
                    Rs. {calculationResult.y2_value?.toLocaleString()}
                    <small style={{ fontSize: '1rem', color: '#fff' }}> /sq.ft</small>
                  </div>

                  <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #3e4f5f" }}>
                    <span style={{ color: "#2ecc71", fontSize: "0.9rem" }}>TOTAL BUILDING VALUE (Y2 × FAB)</span>
                    <div style={{ fontSize: "2.8rem", fontWeight: "bold", color: "#00d2d3" }}>
                      Rs. {calculationResult.building_value?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalize}
                  style={{ width: "100%", padding: "1rem", marginTop: "2rem", backgroundColor: "#27ae60", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Finalize & Generate Report ➔
                </button>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0.8rem 0",
  borderBottom: "1px solid #eee"
};

export default ValuationCalculation;