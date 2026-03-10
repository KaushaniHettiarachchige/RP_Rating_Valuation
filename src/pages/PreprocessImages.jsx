import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PreprocessImages = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // If the user navigated from ParcelInput, they might have the image paths in state
    const state = location.state || {};

    const [satPath, setSatPath] = useState(state.satellite_image_path || "acquired_images/P-123_satellite.jpg");
    const [streetPath, setStreetPath] = useState(state.street_view_image_path || "acquired_images/P-123_street.jpg");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handlePreprocess = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:8001/preprocess-images", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    satellite_image_path: satPath,
                    street_view_image_path: streetPath,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || data.message || "Failed to preprocess images.");
            }

            setResult(data);
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <Header />
            <main className="main-content" style={{ padding: "2rem" }}>
                <section className="welcome-section" style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ color: "#2c3e50" }}>Preprocess Images</h1>
                    <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
                        Step 3: Resize and format the acquired property images natively to prepare for deep learning models.
                    </p>
                </section>

                <section className="form-section" style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: "650px", backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                        <form onSubmit={handlePreprocess} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <label htmlFor="satPath" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}>
                                    Satellite Image Path
                                </label>
                                <input
                                    type="text"
                                    id="satPath"
                                    value={satPath}
                                    onChange={(e) => setSatPath(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "6px", border: "1px solid #dcdde1", fontSize: "1rem" }}
                                />
                            </div>

                            <div>
                                <label htmlFor="streetPath" style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}>
                                    Street View Image Path
                                </label>
                                <input
                                    type="text"
                                    id="streetPath"
                                    value={streetPath}
                                    onChange={(e) => setStreetPath(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "6px", border: "1px solid #dcdde1", fontSize: "1rem" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="button"
                                style={{
                                    padding: "1rem",
                                    fontSize: "1.1rem",
                                    color: "#fff",
                                    backgroundColor: loading ? "#95a5a6" : "#3498db",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontWeight: "bold",
                                    transition: "background-color 0.3s"
                                }}
                            >
                                {loading ? "Normalizing & Resizing Images..." : "Preprocess Data Native Formatting"}
                            </button>
                        </form>

                        {error && (
                            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#ffeaa7", color: "#d35400", borderRadius: "6px", borderLeft: "4px solid #e17055" }}>
                                <strong>Attention:</strong> {error}
                            </div>
                        )}

                        {result && (
                            <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #bdc3c7", borderRadius: "8px", backgroundColor: "#f8f9fa", animation: "fadeIn 0.5s ease-in" }}>
                                <h3 style={{ color: "#27ae60", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span>✅</span> Preprocessing Complete
                                </h3>
                                <p style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>{result.message}</p>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <div style={{ backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "6px" }}>
                                        <h4 style={{ margin: "0 0 0.5rem 0", color: "#34495e", fontSize: "0.95rem" }}>🛰️ Satellite Vector Shape</h4>
                                        <code style={{ display: "block", fontSize: "0.8rem", color: "#8e44ad" }}>
                                            {JSON.stringify(result.satellite_shape)}
                                        </code>
                                    </div>
                                    <div style={{ backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "6px" }}>
                                        <h4 style={{ margin: "0 0 0.5rem 0", color: "#34495e", fontSize: "0.95rem" }}>🚗 Street View Vector Shape</h4>
                                        <code style={{ display: "block", fontSize: "0.8rem", color: "#8e44ad" }}>
                                            {JSON.stringify(result.street_view_shape)}
                                        </code>
                                    </div>
                                </div>

                                <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                                    <button
                                        onClick={() => navigate('/detect-features', {
                                            state: {
                                                satellitePath: satPath,
                                                streetViewPath: streetPath,
                                                gisData: state.gis_data // Preserve GIS context from previous step
                                            }
                                        })}
                                        style={{
                                            padding: "0.8rem 1.5rem",
                                            fontSize: "1rem",
                                            color: "#fff",
                                            backgroundColor: "#27ae60",
                                            border: "none",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Proceed to Step 4: Detect Features ➔
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default PreprocessImages;
