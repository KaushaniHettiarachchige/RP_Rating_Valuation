import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DetectFeatures = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationState = location.state || {};

  const [satPath, setSatPath] = useState(
    navigationState.satellite_image_path || "",
  );
  const [streetPath, setStreetPath] = useState(
    navigationState.street_view_image_path || "",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleDetection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8001/detect-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          satellite_image_path: satPath,
          street_view_image_path: streetPath,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to detect features.");
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Green Palette Definition
  const colors = {
    primary: "#1b4332", // Deep Forest
    accent: "#2d6a4f", // Dark Sea Green
    vibrant: "#52b788", // Mint
    lightBg: "#f7fcf9", // Very light green tint
    cardBg: "#ffffff",
    border: "#d8e2dc",
    success: "#40916c",
    warning: "#ffb703",
  };

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <main style={{ padding: "3rem 1rem" }}>
        {/* Header Section */}
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: colors.primary,
              fontWeight: "800",
              fontSize: "2.2rem",
            }}
          >
            Detect & Classify Land Features
          </h1>
          <p
            style={{
              color: colors.accent,
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "10px auto",
            }}
          >
            Step 4: Deep learning analysis to identify structures, vegetation,
            and bare land.
          </p>
        </header>

        <section style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "750px",
              backgroundColor: colors.cardBg,
              padding: "2.5rem",
              borderRadius: "20px",
              boxShadow: "0 15px 35px rgba(27, 67, 50, 0.08)",
              border: `1px solid ${colors.border}`,
            }}
          >
            <form
              onSubmit={handleDetection}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label style={styles.label}>Satellite Image Path</label>
                <input
                  type="text"
                  value={satPath}
                  onChange={(e) => setSatPath(e.target.value)}
                  placeholder="e.g., images/satellite_K.png"
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Street View Image Path</label>
                <input
                  type="text"
                  value={streetPath}
                  onChange={(e) => setStreetPath(e.target.value)}
                  placeholder="e.g., images/street_view_K.png"
                  required
                  style={styles.input}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.button,
                  backgroundColor: loading ? "#95a5a6" : colors.primary,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Analyzing Environment..." : "Start AI Recognition"}
              </button>
            </form>

            {error && (
              <div style={styles.errorBox}>
                <strong>Technical Issue:</strong> {error}
              </div>
            )}

            {result && (
              <div style={styles.resultContainer}>
                <h3
                  style={{
                    color: colors.success,
                    marginBottom: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>🌱</span> AI Analysis
                  Results
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  {/* Satellite Result */}
                  <div style={styles.resultCard}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: colors.accent,
                        textTransform: "uppercase",
                      }}
                    >
                      🛰️ Top-Down View
                    </span>
                    <h4 style={styles.predictionText}>
                      {result.satellite_analysis.predicted_class.replace(
                        /_/g,
                        " ",
                      )}
                    </h4>
                    <div style={styles.confidenceBarContainer}>
                      <div
                        style={{
                          ...styles.confidenceBar,
                          width: `${result.satellite_analysis.confidence * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span style={styles.confidenceLabel}>
                      {(result.satellite_analysis.confidence * 100).toFixed(1)}%
                      Match
                    </span>
                  </div>

                  {/* Street View Result */}
                  <div style={styles.resultCard}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        color: colors.accent,
                        textTransform: "uppercase",
                      }}
                    >
                      🚗 Street Level
                    </span>
                    <h4 style={styles.predictionText}>
                      {result.street_view_analysis.predicted_class.replace(
                        /_/g,
                        " ",
                      )}
                    </h4>
                    <div style={styles.confidenceBarContainer}>
                      <div
                        style={{
                          ...styles.confidenceBar,
                          width: `${result.street_view_analysis.confidence * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span style={styles.confidenceLabel}>
                      {(result.street_view_analysis.confidence * 100).toFixed(
                        1,
                      )}
                      % Match
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "2rem",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    onClick={() =>
                      navigate("/estimate-measurements", {
                        state: {
                          satellite_image_path: satPath,
                          predictedClass:
                            result.satellite_analysis.predicted_class,
                          confidence: result.satellite_analysis.confidence,
                          parcel_id: navigationState.parcel_id,
                        },
                      })
                    }
                    style={styles.nextButton}
                  >
                    Proceed to Measurements ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

// Reusable Styles
const styles = {
  label: {
    display: "block",
    marginBottom: "0.6rem",
    fontWeight: "700",
    color: "#2d6a4f",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "10px",
    border: "1.5px solid #d8e2dc",
    transition: "border 0.2s",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    padding: "1.2rem",
    fontSize: "1rem",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "all 0.3s",
  },
  errorBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fffbeb",
    color: "#92400e",
    borderRadius: "10px",
    borderLeft: "5px solid #f59e0b",
  },
  resultContainer: {
    marginTop: "2.5rem",
    padding: "1.5rem",
    border: "2px solid #e9f5ee",
    borderRadius: "15px",
    backgroundColor: "#f9fdfb",
  },
  resultCard: {
    backgroundColor: "#fff",
    padding: "1.2rem",
    borderRadius: "12px",
    border: "1px solid #dcfce7",
    boxShadow: "0 2px 5px rgba(0,0,0,0.02)",
  },
  predictionText: {
    margin: "8px 0",
    color: "#1b4332",
    textTransform: "capitalize",
    fontSize: "1.2rem",
    fontWeight: "800",
  },
  confidenceBarContainer: {
    height: "6px",
    width: "100%",
    backgroundColor: "#ecf3f0",
    borderRadius: "10px",
    margin: "10px 0",
  },
  confidenceBar: {
    height: "100%",
    backgroundColor: "#52b788",
    borderRadius: "10px",
  },
  confidenceLabel: { fontSize: "0.85rem", color: "#40916c", fontWeight: "600" },
  nextButton: {
    padding: "0.8rem 2rem",
    backgroundColor: "#1b4332",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "0.3s",
  },
};

export default DetectFeatures;
