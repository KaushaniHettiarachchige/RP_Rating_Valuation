import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EstimateMeasurements = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load context from Step 4 (Detect Features)
  const navState = location.state || {};

  // Internal states synced with previous components
  const [satPath, setSatPath] = useState(navState.satellite_image_path || "");
  const [predictedClass, setPredictedClass] = useState(
    navState.predictedClass || "buildings",
  );
  const [confidence, setConfidence] = useState(navState.confidence || 0.0);

  // Total Land Area (Extent) inherited from GIS component or default
  const [totalLandArea, setTotalLandArea] = useState(
    navState.total_land_area_sqft || 4000.0,
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleEstimation = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:8001/estimate-measurements",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            satellite_image_path: satPath,
            predicted_class: predictedClass,
            confidence: parseFloat(confidence),
            total_land_area_sqft: parseFloat(totalLandArea),
            // Adding boundary_polygon if available for backend shapely logic
            boundary_polygon: navState.boundary_polygon || [],
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to estimate measurements.");
      }

      // In your backend response, we expect 'total_land_area_sqft' and 'estimated_feature_area_sqft'
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <main className="main-content" style={{ padding: "2rem" }}>
        <section
          className="welcome-section"
          style={{ textAlign: "center", marginBottom: "2rem" }}
        >
          <h1 style={{ color: "#2c3e50" }}>
            Step 5: Physical Feature Measurement
          </h1>
          <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
            Estimate the Building Footprint Area (FAB) based on AI
            classification and land boundary data.
          </p>
        </section>

        <section
          className="form-section"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
            }}
          >
            <form
              onSubmit={handleEstimation}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#34495e",
                    }}
                  >
                    Satellite Image Path
                  </label>
                  <input
                    type="text"
                    value={satPath}
                    onChange={(e) => setSatPath(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "6px",
                      border: "1px solid #dcdde1",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#34495e",
                    }}
                  >
                    AI Detected Feature
                  </label>
                  <input
                    type="text"
                    value={predictedClass}
                    readOnly
                    style={{
                      width: "100%",
                      padding: "0.8rem 1rem",
                      borderRadius: "6px",
                      border: "1px solid #dcdde1",
                      backgroundColor: "#f1f2f6",
                      textTransform: "capitalize",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#34495e",
                  }}
                >
                  Total Land Area (Sq.Ft)
                </label>
                <input
                  type="number"
                  value={totalLandArea}
                  onChange={(e) => setTotalLandArea(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #dcdde1",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "1rem",
                  fontSize: "1.1rem",
                  color: "#fff",
                  backgroundColor: loading ? "#95a5a6" : "#e67e22",
                  border: "none",
                  borderRadius: "6px",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "Calculating Dimensions..."
                  : "Calculate Physical Measurements"}
              </button>
            </form>

            {error && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  backgroundColor: "#ffeaa7",
                  color: "#d35400",
                  borderRadius: "6px",
                  borderLeft: "4px solid #e17055",
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {result && (
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  border: "1px solid #bdc3c7",
                  borderRadius: "8px",
                  backgroundColor: "#f8f9fa",
                }}
              >
                <h3 style={{ color: "#27ae60", marginBottom: "1rem" }}>
                  📏 Results
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#ecf0f1",
                      padding: "1.5rem",
                      borderRadius: "8px",
                      borderLeft: "4px solid #2980b9",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0",
                        color: "#2c3e50",
                        fontSize: "0.9rem",
                      }}
                    >
                      Total Land Area
                    </h4>
                    <div
                      style={{
                        fontSize: "1.8rem",
                        color: "#2980b9",
                        fontWeight: "bold",
                      }}
                    >
                      {result.total_land_area_sqft}{" "}
                      <small style={{ fontSize: "0.8rem" }}>sq/ft</small>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: "1.5rem",
                      borderRadius: "8px",
                      border: "2px solid #27ae60",
                    }}
                  >
                    <h4
                      style={{
                        margin: "0",
                        color: "#2c3e50",
                        fontSize: "0.9rem",
                      }}
                    >
                      Building Footprint (FAB)
                    </h4>
                    <div
                      style={{
                        fontSize: "1.8rem",
                        color: "#27ae60",
                        fontWeight: "bold",
                      }}
                    >
                      {result.estimated_feature_area_sqft}{" "}
                      <small style={{ fontSize: "0.8rem" }}>sq/ft</small>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", textAlign: "right" }}>
                  <button
                    onClick={() =>
                      navigate("/collect-variables", {
                        state: {
                          ...navState,
                          estimatedArea: result.estimated_feature_area_sqft,
                          totalArea: result.total_land_area_sqft,
                        },
                      })
                    }
                    style={{
                      padding: "0.8rem 1.5rem",
                      backgroundColor: "#34495e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Proceed to Step 6: Collect Variables ➔
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

export default EstimateMeasurements;
