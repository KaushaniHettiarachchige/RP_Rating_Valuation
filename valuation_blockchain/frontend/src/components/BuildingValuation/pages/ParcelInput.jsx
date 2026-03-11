import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { receiveParcelData } from "../api";
import { useSelector } from "react-redux";

const ParcelInput = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const property = useSelector((state) => state.property.property);
  // Form States
  const [parcelId, setParcelId] = useState("");
  const [polygon, setPolygon] = useState(
    "[[6.9271, 79.9560], [6.9272, 79.9561]]",
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Green Palette
  const colors = {
    primary: "#1b4332", // Deep Forest
    accent: "#2d6a4f", // Dark Sea Green
    mint: "#52b788", // Vibrant Mint
    softGreen: "#d8e2dc", // Sage Border
    bg: "#f7fcf9", // Near-white Green
    white: "#ffffff",
    error: "#e76f51",
  };

  useEffect(() => {
    const idParam = property.propertyId;
    const polyParam = searchParams.get("polygon");
    if (idParam) setParcelId(idParam);
    if (polyParam) setPolygon(polyParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let parsedPolygon;
      try {
        parsedPolygon = JSON.parse(polygon);
      } catch (err) {
        throw new Error(
          "Invalid format for Boundary Polygon. Must be a valid JSON array.",
        );
      }

      const payload = {
        parcel_id: parcelId,
        boundary_polygon: parsedPolygon,
        extent_of_land: property.landSize,
        location_details: { city: "Malabe" },
        latitude: property.latitude,
        longitude: property.latitude,
      };

      const data = await receiveParcelData(payload);
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
        backgroundColor: colors.bg,
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <main style={{ padding: "3rem 1.5rem" }}>
        {/* Header Section */}
        <section style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              color: colors.primary,
              fontWeight: "800",
              fontSize: "2.4rem",
              marginBottom: "10px",
            }}
          >
            Acquire Property Images
          </h1>
          <p
            style={{
              color: colors.accent,
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Identify parcel boundaries to fetch high-resolution Satellite and
            Street View imagery.
          </p>
        </section>

        <section style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: "700px",
              backgroundColor: colors.white,
              padding: "2.5rem",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(27, 67, 50, 0.06)",
              border: `1px solid ${colors.softGreen}`,
            }}
          >
            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label style={styles.label}>Parcel ID</label>
                <input
                  type="text"
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  placeholder="Enter unique parcel identifier"
                  required
                  style={styles.input}
                />
              </div>

              <div>
                <label style={styles.label}>Boundary Polygon Coordinates</label>
                <textarea
                  value={polygon}
                  onChange={(e) => setPolygon(e.target.value)}
                  rows={4}
                  required
                  style={{
                    ...styles.input,
                    fontFamily: "'Fira Code', monospace",
                    fontSize: "0.9rem",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.submitBtn,
                  backgroundColor: loading ? "#95a5a6" : colors.primary,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading
                  ? "📡 Accessing Google Maps API..."
                  : "Acquire Property Images"}
              </button>
            </form>

            {error && (
              <div style={styles.errorBox}>
                <strong style={{ color: colors.error }}>Data Error:</strong>{" "}
                {error}
              </div>
            )}

            {result && (
              <div style={styles.resultContainer}>
                <h3
                  style={{
                    color: colors.accent,
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>✅</span> Visual Assets
                  Ready
                </h3>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "20px",
                  }}
                >
                  <div style={styles.imagePreview}>
                    <span style={styles.imageTag}>Satellite View</span>
                    <img
                      src={`http://localhost:8001/${result.satellite_image_path}`}
                      alt="Satellite"
                      style={styles.image}
                    />
                  </div>
                  <div style={styles.imagePreview}>
                    <span style={styles.imageTag}>Street View</span>
                    <img
                      src={`http://localhost:8001/${result.street_view_image_path}`}
                      alt="Street View"
                      style={styles.image}
                    />
                  </div>
                </div>

                <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
                  <button
                    onClick={() =>
                      navigate("/preprocess-images", { state: result })
                    }
                    style={styles.nextBtn}
                  >
                    Proceed to Preprocessing ➔
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

// CSS-in-JS Styles
const styles = {
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    color: "#2d6a4f",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "1.5px solid #d8e2dc",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
  },
  submitBtn: {
    padding: "1.2rem",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "1rem",
    boxShadow: "0 8px 15px rgba(27, 67, 50, 0.15)",
    transition: "0.3s",
  },
  errorBox: {
    marginTop: "1.5rem",
    padding: "1rem",
    background: "#fefae0",
    borderRadius: "12px",
    borderLeft: "5px solid #e76f51",
    fontSize: "0.95rem",
  },
  resultContainer: {
    marginTop: "2.5rem",
    borderTop: "2px dashed #d8e2dc",
    paddingTop: "2rem",
  },
  imagePreview: {
    textAlign: "center",
    backgroundColor: "#f9fdfb",
    padding: "10px",
    borderRadius: "16px",
    border: "1px solid #e9f5ee",
  },
  imageTag: {
    display: "block",
    fontSize: "0.7rem",
    fontWeight: "900",
    color: "#52b788",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
    objectFit: "cover",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },
  nextBtn: {
    padding: "1rem 2.5rem",
    backgroundColor: "#52b788",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 12px rgba(82, 183, 136, 0.3)",
  },
};

export default ParcelInput;
