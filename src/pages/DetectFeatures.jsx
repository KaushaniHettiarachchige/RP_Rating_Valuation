import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DetectFeatures = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get navigation state from previous step
    const navigationState = location.state || {};

    // Form States - Fallback to paths from Step 3 if available
    const [satPath, setSatPath] = useState(navigationState.satellite_image_path || "");
    const [streetPath, setStreetPath] = useState(navigationState.street_view_image_path || "");

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // Fixed: changed from 'results' to 'result'
    const [error, setError] = useState(null);

    const handleDetection = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch("http://localhost:8001/detect-features", {
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
                throw new Error(data.detail || data.message || "Failed to detect features.");
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
                    <h1 style={{ color: "#2c3e50" }}>Detect and Classify Internal Land Features</h1>
                    <p style={{ color: "#7f8c8d", fontSize: "1.1rem" }}>
                        Step 4: Use trained deep learning models to identify structures, bare lands, and vegetation.
                    </p>
                </section>

                <section className="form-section" style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: "700px", backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                        <form onSubmit={handleDetection} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}>
                                    Preprocessed Satellite Image Path
                                </label>
                                <input
                                    type="text"
                                    value={satPath}
                                    onChange={(e) => setSatPath(e.target.value)}
                                    placeholder="images/satellite_K.png"
                                    required
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "6px", border: "1px solid #dcdde1" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600", color: "#34495e" }}>
                                    Preprocessed Street View Image Path
                                </label>
                                <input
                                    type="text"
                                    value={streetPath}
                                    onChange={(e) => setStreetPath(e.target.value)}
                                    placeholder="images/street_view_K.png"
                                    required
                                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "6px", border: "1px solid #dcdde1" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "1rem",
                                    fontSize: "1.1rem",
                                    color: "#fff",
                                    backgroundColor: loading ? "#95a5a6" : "#8e44ad",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: loading ? "not-allowed" : "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {loading ? "Analyzing Images with AI..." : "Run AI Feature Detection"}
                            </button>
                        </form>

                        {error && (
                            <div style={{ marginTop: "1.5rem", padding: "1rem", backgroundColor: "#ffeaa7", color: "#d35400", borderRadius: "6px", borderLeft: "4px solid #e17055" }}>
                                <strong>Attention:</strong> {error}
                            </div>
                        )}

                        {result && (
                            <div style={{ marginTop: "2rem", padding: "1.5rem", border: "1px solid #bdc3c7", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
                                <h3 style={{ color: "#27ae60", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <span>✅</span> AI Detection Complete
                                </h3>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                                    {/* Satellite Analysis */}
                                    <div style={{ backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "8px", borderTop: "4px solid #3498db" }}>
                                        <h4 style={{ margin: "0 0 0.5rem 0" }}>🛰️ Satellite</h4>
                                        <p style={{ margin: "0", fontWeight: "bold", color: "#2980b9", textTransform: "capitalize" }}>
                                            {result.satellite_analysis.predicted_class.replace(/_/g, " ")}
                                        </p>
                                        <p style={{ margin: "0", fontSize: "0.9rem", color: "#27ae60" }}>
                                            Confidence: {(result.satellite_analysis.confidence * 100).toFixed(2)}%
                                        </p>
                                    </div>

                                    {/* Street Analysis */}
                                    <div style={{ backgroundColor: "#ecf0f1", padding: "1rem", borderRadius: "8px", borderTop: "4px solid #e67e22" }}>
                                        <h4 style={{ margin: "0 0 0.5rem 0" }}>🚗 Street View</h4>
                                        <p style={{ margin: "0", fontWeight: "bold", color: "#d35400", textTransform: "capitalize" }}>
                                            {result.street_view_analysis.predicted_class.replace(/_/g, " ")}
                                        </p>
                                        <p style={{ margin: "0", fontSize: "0.9rem", color: "#27ae60" }}>
                                            Confidence: {(result.street_view_analysis.confidence * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                </div>

                                <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
                                    <button
                                        onClick={() => navigate('/estimate-measurements', {
                                            state: {
                                                satellite_image_path: satPath,
                                                predictedClass: result.satellite_analysis.predicted_class,
                                                confidence: result.satellite_analysis.confidence,
                                                parcel_id: navigationState.parcel_id // Keeping context
                                            }
                                        })}
                                        style={{ padding: "0.8rem 1.5rem", backgroundColor: "#2980b9", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                                    >
                                        Proceed to Step 5: Measurements ➔
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

export default DetectFeatures;