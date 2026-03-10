import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { receiveParcelData } from "../api"; // Import our central API logic
import Header from "../components/Header";
import Footer from "../components/Footer";

const ParcelInput = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Form States
    const [parcelId, setParcelId] = useState("");
    const [polygon, setPolygon] = useState("[[6.9271, 79.9560], [6.9272, 79.9561]]");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Auto-fill from URL parameters
    useEffect(() => {
        const idParam = searchParams.get("parcel_id");
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
                throw new Error("Invalid format for Boundary Polygon. Must be a valid JSON array.");
            }

            // Step 1 & 2: Send to Backend (which triggers Google API acquisition)
            const payload = {
                parcel_id: parcelId,
                boundary_polygon: parsedPolygon,
                extent_of_land: 15.5,
                location_details: { city: "Malabe" },
                latitude: parsedPolygon[0][0],
                longitude: parsedPolygon[0][1],
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
        <div className="dashboard-container">
            <Header />
            <main className="main-content" style={{ padding: "2rem" }}>
                <section style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <h1 style={{ color: "#2c3e50" }}>Acquire Property Images</h1>
                    <p style={{ color: "#7f8c8d" }}>
                        Step 1 & 2: Receive parcel info and fetch Satellite/Street View imagery.
                    </p>
                </section>

                <section style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: "700px", backgroundColor: "#fff", padding: "2rem", borderRadius: "10px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            <div>
                                <label style={{ fontWeight: "600" }}>Parcel ID</label>
                                <input
                                    type="text"
                                    value={parcelId}
                                    onChange={(e) => setParcelId(e.target.value)}
                                    required
                                    style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", borderRadius: "6px", border: "1px solid #ddd" }}
                                />
                            </div>

                            <div>
                                <label style={{ fontWeight: "600" }}>Boundary Polygon Coordinates</label>
                                <textarea
                                    value={polygon}
                                    onChange={(e) => setPolygon(e.target.value)}
                                    rows={4}
                                    required
                                    style={{ width: "100%", padding: "0.8rem", marginTop: "0.5rem", borderRadius: "6px", border: "1px solid #ddd", fontFamily: "monospace" }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "1rem",
                                    color: "#fff",
                                    backgroundColor: loading ? "#95a5a6" : "#3498db",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                {loading ? "Downloading Images from Google..." : "Acquire Property Images"}
                            </button>
                        </form>

                        {error && (
                            <div style={{ marginTop: "1rem", color: "#e74c3c", padding: "1rem", background: "#fdf2f2", borderRadius: "6px" }}>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {result && (
                            <div style={{ marginTop: "2rem", borderTop: "2px solid #eee", paddingTop: "1.5rem" }}>
                                <h3 style={{ color: "#27ae60" }}>✅ Images Successfully Acquired</h3>

                                {/* Image Preview Grid */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "1rem" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>SATELLITE VIEW</p>
                                        <img
                                            src={`http://localhost:8001/${result.satellite_image_path}`}
                                            alt="Satellite"
                                            style={{ width: "100%", borderRadius: "8px", border: "1px solid #ddd" }}
                                        />
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <p style={{ fontSize: "0.8rem", fontWeight: "bold" }}>STREET VIEW</p>
                                        <img
                                            src={`http://localhost:8001/${result.street_view_image_path}`}
                                            alt="Street View"
                                            style={{ width: "100%", borderRadius: "8px", border: "1px solid #ddd" }}
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                                    <button
                                        onClick={() => navigate('/preprocess-images', { state: result })}
                                        style={{ padding: "0.8rem 2rem", backgroundColor: "#27ae60", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                                    >
                                        Proceed to Step 3: Preprocessing ➔
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

export default ParcelInput;