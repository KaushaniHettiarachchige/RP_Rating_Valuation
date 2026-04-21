import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PreprocessImages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [satPath, setSatPath] = useState(state.satellite_image_path || "");
  const [streetPath, setStreetPath] = useState(
    state.street_view_image_path || "",
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Green Palette
  const colors = {
    primary: "#1b4332", // Deep Forest
    accent: "#2d6a4f", // Dark Sea Green
    vibrant: "#52b788", // Mint
    lightBg: "#f7fcf9", // Pale Green
    cardBg: "#ffffff",
    border: "#d8e2dc",
    dataBox: "#f0f4f2", // Soft Gray-Green
    codeText: "#1b4332",
  };

  const handlePreprocess = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:8001/preprocess-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          satellite_image_path: satPath,
          street_view_image_path: streetPath,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.detail || "Failed to preprocess images.");
      setResult(data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        padding: "2rem 1rem",
      }}
    >
      <main style={{ maxWidth: "750px", margin: "0 auto" }}>
        {/* Header Section */}
        <section style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: colors.primary,
              fontWeight: "800",
              fontSize: "2.2rem",
            }}
          >
            Image Preprocessing
          </h1>
          <p style={{ color: colors.accent, fontSize: "1.1rem" }}>
            Step 3: Normalizing image dimensions and formatting vectors for Deep
            Learning.
          </p>
        </section>

        <section
          style={{
            backgroundColor: colors.cardBg,
            padding: "2.5rem",
            borderRadius: "20px",
            boxShadow: "0 15px 35px rgba(27, 67, 50, 0.08)",
            border: `1px solid ${colors.border}`,
          }}
        >
          <form
            onSubmit={handlePreprocess}
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div style={{ display: "grid", gap: "1.2rem" }}>
              <div>
                <label style={styles.label}>Satellite Image Path</label>
                <input
                  type="text"
                  value={satPath}
                  onChange={(e) => setSatPath(e.target.value)}
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
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.mainButton,
                backgroundColor: loading ? "#95a5a6" : colors.primary,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading
                ? "🔄 Processing Tensors..."
                : "Initialize Native Formatting"}
            </button>
          </form>

          {error && (
            <div style={styles.errorBox}>
              <strong>Attention:</strong> {error}
            </div>
          )}

          {result && (
            <div style={styles.resultContainer}>
              <h3
                style={{
                  color: colors.vibrant,
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>⚡</span> Preprocessing Successful
              </h3>
              <p
                style={{
                  marginBottom: "1.5rem",
                  color: colors.accent,
                  fontSize: "0.95rem",
                }}
              >
                {result.message}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {/* Satellite Shape Info */}
                <div style={styles.vectorCard}>
                  <h4 style={styles.vectorTitle}>🛰️ Satellite Vector</h4>
                  <code style={{ color: colors.codeText, fontWeight: "bold" }}>
                    {JSON.stringify(result.satellite_shape)}
                  </code>
                </div>

                {/* Street View Shape Info */}
                <div style={styles.vectorCard}>
                  <h4 style={styles.vectorTitle}>🚗 Street View Vector</h4>
                  <code style={{ color: colors.codeText, fontWeight: "bold" }}>
                    {JSON.stringify(result.street_view_shape)}
                  </code>
                </div>
              </div>

              <div style={{ marginTop: "2.5rem", textAlign: "right" }}>
                <button
                  onClick={() =>
                    navigate("/detect-features", {
                      state: {
                        satellitePath: satPath,
                        streetViewPath: streetPath,
                        gisData: state.gis_data,
                      },
                    })
                  }
                  style={styles.nextButton}
                >
                  Proceed to Feature Detection ➔
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  label: {
    display: "block",
    marginBottom: "0.6rem",
    fontWeight: "700",
    color: "#2d6a4f",
    fontSize: "0.85rem",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "0.9rem",
    borderRadius: "10px",
    border: "1.5px solid #d8e2dc",
    boxSizing: "border-box",
    fontSize: "0.95rem",
  },
  mainButton: {
    padding: "1.1rem",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    transition: "0.3s",
    fontSize: "1rem",
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
    marginTop: "2rem",
    padding: "1.5rem",
    border: "1px solid #e9f5ee",
    borderRadius: "15px",
    backgroundColor: "#f9fdfb",
  },
  vectorCard: {
    backgroundColor: "#f0f4f2",
    padding: "1.2rem",
    borderRadius: "10px",
    border: "1px solid #d8e2dc",
  },
  vectorTitle: {
    margin: "0 0 8px 0",
    color: "#2d6a4f",
    fontSize: "0.8rem",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  nextButton: {
    padding: "0.9rem 1.8rem",
    backgroundColor: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default PreprocessImages;
