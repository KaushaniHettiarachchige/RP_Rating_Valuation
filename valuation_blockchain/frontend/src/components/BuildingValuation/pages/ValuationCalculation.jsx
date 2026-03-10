import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ValuationCalculation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { aggregatedVariables, satellite_image_path, street_view_image_path } =
    location.state || {};

  const [loading, setLoading] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState(null);

  // Green Palette
  const colors = {
    primary: "#1b4332", // Deep Forest
    accent: "#2d6a4f", // Dark Sea Green
    vibrant: "#52b788", // Mint
    lightBg: "#f7fcf9", // Pale Green
    cardBg: "#ffffff",
    border: "#d8e2dc",
    gold: "#ffca3a", // Accent for currency
  };

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
      const response = await fetch(
        "http://localhost:8001/finalize-assessment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            building_value: calculationResult.building_value,
            parcel_id: aggregatedVariables.parcel_id || "REF-AUTO",
            y2_rate: calculationResult.y2_value,
            fab: aggregatedVariables.fab,
          }),
        },
      );

      const finalAssessmentData = await response.json();

      navigate("/assessment-report", {
        state: {
          assessment: finalAssessmentData,
          auditTrail: {
            images: {
              satellite: satellite_image_path,
              street: street_view_image_path,
            },
            variables: aggregatedVariables,
            breakdown: calculationResult,
          },
        },
      });
    } catch (err) {
      console.error("Finalization failed:", err);
    }
  };

  if (!aggregatedVariables) {
    return (
      <div
        style={{
          backgroundColor: colors.lightBg,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={styles.card}>
          <h2 style={{ color: colors.primary }}>Missing Data Context</h2>
          <button
            onClick={() => navigate("/collect-variables")}
            style={styles.primaryBtn}
          >
            Return to Step 6
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <main style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: colors.primary,
              fontWeight: "800",
              fontSize: "2.2rem",
            }}
          >
            Step 7: Final Valuation Engine
          </h1>
          <p style={{ color: colors.accent, fontSize: "1.1rem" }}>
            Executing DRC Regression (Equation 2) on building attributes.
          </p>
        </header>

        <div style={styles.gridContainer}>
          {/* LEFT: INPUT SUMMARY */}
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Aggregated Variables</h3>
            <div style={styles.listContainer}>
              <div style={styles.listItem}>
                <span>Floor Area (FAB)</span>{" "}
                <strong>{aggregatedVariables.fab} sq.ft</strong>
              </div>
              <div style={styles.listItem}>
                <span>Access (AOP)</span>{" "}
                <strong>{aggregatedVariables.aop}</strong>
              </div>
              <div style={styles.listItem}>
                <span>Level (LOP)</span>{" "}
                <strong>{aggregatedVariables.lop}</strong>
              </div>
              <div style={styles.listItem}>
                <span>Condition (COB)</span>{" "}
                <strong>{aggregatedVariables.cob}</strong>
              </div>
              <div style={styles.listItem}>
                <span>Age (AOB)</span>{" "}
                <strong>{aggregatedVariables.aob} Years</strong>
              </div>
            </div>

            <div style={styles.formulaBox}>
              <small style={{ color: colors.muted, fontStyle: "italic" }}>
                Regression Logic: $Y2 = \beta_0 + \beta_1(FAB) + \dots +
                \epsilon$
              </small>
            </div>
          </section>

          {/* RIGHT: CALCULATION RESULT */}
          <section style={styles.resultTerminal}>
            {loading ? (
              <div style={styles.loader}>🔄 Running Regression Models...</div>
            ) : error ? (
              <div style={{ color: "#ff7675" }}>⚠️ {error}</div>
            ) : (
              calculationResult && (
                <>
                  <div style={{ marginBottom: "2.5rem" }}>
                    <span style={styles.label}>UNIT RATE (Y2)</span>
                    <div style={styles.y2Value}>
                      Rs. {calculationResult.y2_value?.toLocaleString()}
                      <span style={styles.unit}> /sq.ft</span>
                    </div>
                  </div>

                  <div style={styles.buildingValueContainer}>
                    <span
                      style={{
                        color: colors.vibrant,
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                    >
                      Total Building Value
                    </span>
                    <div style={styles.totalValue}>
                      Rs. {calculationResult.building_value?.toLocaleString()}
                    </div>
                  </div>

                  <button onClick={handleFinalize} style={styles.finalizeBtn}>
                    Finalize & Generate Full Audit ➔
                  </button>
                </>
              )
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

const styles = {
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "2.5rem",
    alignItems: "start",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "20px",
    border: "1px solid #d8e2dc",
    boxShadow: "0 10px 25px rgba(27, 67, 50, 0.05)",
  },
  cardTitle: {
    color: "#1b4332",
    fontSize: "1.1rem",
    fontWeight: "800",
    textTransform: "uppercase",
    borderBottom: "2px solid #52b788",
    paddingBottom: "0.8rem",
    marginBottom: "1.5rem",
  },
  listContainer: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 0",
    borderBottom: "1px solid #f0f0f0",
    color: "#2d6a4f",
  },
  formulaBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f8fdfb",
    borderRadius: "10px",
    textAlign: "center",
  },

  resultTerminal: {
    backgroundColor: "#1b4332",
    padding: "3rem",
    borderRadius: "24px",
    color: "#fff",
    boxShadow: "0 20px 40px rgba(27, 67, 50, 0.2)",
    position: "relative",
    overflow: "hidden",
  },
  loader: {
    textAlign: "center",
    padding: "2rem",
    fontSize: "1.2rem",
    color: "#52b788",
  },
  label: {
    color: "#52b788",
    fontSize: "0.85rem",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  y2Value: {
    fontSize: "2.8rem",
    fontWeight: "900",
    color: "#ffca3a",
    margin: "0.5rem 0",
  },
  unit: { fontSize: "1.2rem", color: "#fff", fontWeight: "400" },
  buildingValueContainer: {
    padding: "1.5rem 0",
    borderTop: "1px solid rgba(255,255,255,0.1)",
  },
  totalValue: {
    fontSize: "3.2rem",
    fontWeight: "900",
    color: "#52b788",
    marginTop: "0.5rem",
  },

  finalizeBtn: {
    width: "100%",
    padding: "1.2rem",
    marginTop: "2rem",
    backgroundColor: "#52b788",
    color: "#1b4332",
    border: "none",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
    fontSize: "1.1rem",
    transition: "transform 0.2s",
  },
  primaryBtn: {
    padding: "1rem 2rem",
    backgroundColor: "#1b4332",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default ValuationCalculation;
