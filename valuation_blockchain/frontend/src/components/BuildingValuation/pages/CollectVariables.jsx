import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CollectVariables = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};

  const [parcelId, setParcelId] = useState(state.parcel_id || "REF-001");
  const [fab, setFab] = useState(
    state.data?.estimated_feature_area_sqft || state.estimatedArea || 0,
  );
  const [noc, setNoc] = useState("Brick and Cement");
  const [aop, setAop] = useState(state.gisData?.accessibility || "Average");
  const [lop, setLop] = useState(
    state.gisData?.location_details?.cluster || "Urban Residential",
  );
  const [cob, setCob] = useState("Good");
  const [conb, setConb] = useState("Average");
  const [aob, setAob] = useState("");
  const [tof, setTof] = useState("Tiled");
  const [dob, setDob] = useState("Modern");
  const [tob, setTob] = useState("Residential");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCollection = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8001/collect-variables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parcel_id: parcelId,
          fab: parseFloat(fab),
          noc,
          aop,
          lop,
          cob,
          conb,
          aob: aob ? parseInt(aob) : 0,
          tof,
          dob,
          tob,
        }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to collect variables.");
      setResult(data.data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Modern Green Palette
  const colors = {
    primary: "#1b4332", // Deep Forest
    secondary: "#2d6a4f", // Dark Sea
    accent: "#52b788", // Fresh Mint
    lightBg: "#f7fcf9", // Soft Green tint
    cardBg: "#ffffff",
    border: "#d8e2dc",
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
        <header style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: colors.primary,
              fontWeight: "800",
              fontSize: "2.2rem",
            }}
          >
            Step 6: Building Variables
          </h1>
          <p style={{ color: colors.secondary, fontSize: "1.1rem" }}>
            Aggregation of GIS, AI, and Structural attributes for{" "}
            <span style={{ fontFamily: "serif" }}>$Y_2$</span>
          </p>
        </header>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "950px",
              backgroundColor: colors.cardBg,
              padding: "2.5rem",
              borderRadius: "20px",
              boxShadow: "0 20px 40px rgba(27, 67, 50, 0.08)",
              border: `1px solid ${colors.border}`,
            }}
          >
            <form
              onSubmit={handleCollection}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              {/* LEFT COLUMN: SYSTEM DATA */}
              <div
                style={{
                  backgroundColor: "#f0fdf4",
                  padding: "1.5rem",
                  borderRadius: "15px",
                  border: "1px solid #dcfce7",
                }}
              >
                <h4
                  style={{
                    color: colors.secondary,
                    marginBottom: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>🌿</span> Automated Insights
                </h4>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: colors.secondary,
                      marginBottom: "5px",
                    }}
                  >
                    Floor Area (FAB)
                  </label>
                  <input
                    type="number"
                    value={fab}
                    readOnly
                    style={styles.readOnlyInput}
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: colors.secondary,
                      marginBottom: "5px",
                    }}
                  >
                    Accessibility (AOP)
                  </label>
                  <input
                    type="text"
                    value={aop}
                    readOnly
                    style={styles.readOnlyInput}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: colors.secondary,
                      marginBottom: "5px",
                    }}
                  >
                    Location (LOP)
                  </label>
                  <input
                    type="text"
                    value={lop}
                    readOnly
                    style={styles.readOnlyInput}
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: MANUAL ENTRY */}
              <div style={{ padding: "0.5rem" }}>
                <h4
                  style={{
                    color: colors.primary,
                    marginBottom: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>📝</span> Structural Parameters
                </h4>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <label style={styles.label}>Nature (NOC)</label>
                    <select
                      value={noc}
                      onChange={(e) => setNoc(e.target.value)}
                      style={styles.select}
                    >
                      <option value="Brick & Cement">Brick & Cement</option>
                      <option value="Timber">Timber</option>
                      <option value="Metal">Metal Frame</option>
                    </select>
                  </div>
                  <div>
                    <label style={styles.label}>Floor Type (TOF)</label>
                    <select
                      value={tof}
                      onChange={(e) => setTof(e.target.value)}
                      style={styles.select}
                    >
                      <option value="Tiled">Tiled</option>
                      <option value="Cement">Cement</option>
                      <option value="Marble">Marble</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={styles.label}>Building Condition (COB)</label>
                  <select
                    value={cob}
                    onChange={(e) => setCob(e.target.value)}
                    style={styles.select}
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Dilapidated">Dilapidated</option>
                  </select>
                </div>

                <div>
                  <label style={styles.label}>Age of Building (AOB)</label>
                  <input
                    type="number"
                    value={aob}
                    onChange={(e) => setAob(e.target.value)}
                    placeholder="Years (e.g. 12)"
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  gridColumn: "span 2",
                  padding: "1.2rem",
                  backgroundColor: colors.secondary,
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "1rem",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(45, 106, 79, 0.2)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.primary)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = colors.secondary)
                }
              >
                {loading ? "Processing Data..." : "Compile Building Dataset"}
              </button>
            </form>

            {error && (
              <div style={styles.errorBox}>
                <strong>Error:</strong> {error}
              </div>
            )}

            {result && (
              <div style={styles.successBox}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3 style={{ color: "#1b4332", margin: 0 }}>
                      ✨ Dataset Verified
                    </h3>
                    <p style={{ margin: "5px 0 0 0", color: "#2d6a4f" }}>
                      Ready for Building Value Regression ($Y_2$).
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate("/valuation-calculation", {
                        state: { aggregatedVariables: result, ...state },
                      })
                    }
                    style={styles.finalBtn}
                  >
                    Calculate $Y_2$ ➔
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#495057",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1.5px solid #d8e2dc",
    outline: "none",
  },
  select: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1.5px solid #d8e2dc",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  readOnlyInput: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #d1fae5",
    backgroundColor: "#f0fdf4",
    color: "#065f46",
    fontWeight: "600",
  },
  errorBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#fff5f5",
    color: "#c53030",
    borderRadius: "8px",
    borderLeft: "4px solid #c53030",
  },
  successBox: {
    marginTop: "2rem",
    padding: "1.5rem",
    backgroundColor: "#ebfbee",
    borderRadius: "15px",
    border: "1px solid #b7ebc1",
  },
  finalBtn: {
    padding: "0.8rem 1.5rem",
    backgroundColor: "#1b4332",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default CollectVariables;
