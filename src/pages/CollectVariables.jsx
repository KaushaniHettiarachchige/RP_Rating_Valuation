import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CollectVariables = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Load context from Step 5 Estimate Measurements if routed via pipeline
    const state = location.state || {};

    // Variables from previous steps
    const [parcelId, setParcelId] = useState(state.parcel_id || "REF-001");
    const [fab, setFab] = useState(state.data?.estimated_feature_area_sqft || state.estimatedArea || 0); // Floor Area of Building (Image Analysis)
    const [noc, setNoc] = useState("Brick and Cement");

    // Variables from Component 1 (GIS Context Handover)
    const [aop, setAop] = useState(state.gisData?.accessibility || "Average");
    const [lop, setLop] = useState(state.gisData?.location_details?.cluster || "Urban Residential");

    // Variables for Manual Entry
    const [cob, setCob] = useState("Good"); // Condition of Building
    const [conb, setConb] = useState("Average"); // Convenience of Building
    const [aob, setAob] = useState(""); // Age of Building (Optional but mentioned by user: AOB)
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
        setResult(null);

        try {
            const response = await fetch("http://localhost:8001/collect-variables", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    parcel_id: parcelId,
                    fab: parseFloat(fab),
                    noc: noc,
                    aop: aop,
                    lop: lop,
                    cob: cob,
                    conb: conb,
                    aob: aob ? parseInt(aob) : 0,
                    tof: tof,
                    dob: dob,
                    tob: tob // Add this field
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Better error handling for object/array details
                const errorMessage = typeof data.detail === 'object'
                    ? JSON.stringify(data.detail)
                    : (data.detail || data.message || "Failed to collect variables.");
                throw new Error(errorMessage);
            }

            setResult(data.data);
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
                    <h1 style={{ color: "#2c3e50" }}>Step 6: Building Variables for Equation (2)</h1>
                    <p style={{ color: "#7f8c8d" }}>Aggregation of GIS, AI, and Structural attributes for $Y2$ calculation.</p>
                </section>

                <section style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "100%", maxWidth: "900px", backgroundColor: "#fff", padding: "2rem", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                        <form onSubmit={handleCollection} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                            {/* LEFT COLUMN: AUTO-FETCHED */}
                            <div style={{ backgroundColor: "#f0f7ff", padding: "1.5rem", borderRadius: "10px" }}>
                                <h4 style={{ color: "#0984e3", borderBottom: "1px solid #d1e9ff", marginBottom: "1rem" }}>🤖 System Derived</h4>

                                <label style={{ fontWeight: '600' }}>Floor Area (FAB)</label>
                                <input type="number" value={fab} readOnly style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", backgroundColor: "#e9ecef" }} />

                                <label style={{ fontWeight: '600' }}>Accessibility (AOP)</label>
                                <input type="text" value={aop} readOnly style={{ width: "100%", padding: "0.8rem", marginBottom: "1rem", backgroundColor: "#e9ecef" }} />

                                <label style={{ fontWeight: '600' }}>Location (LOP)</label>
                                <input type="text" value={lop} readOnly style={{ width: "100%", padding: "0.8rem", backgroundColor: "#e9ecef" }} />
                            </div>

                            {/* RIGHT COLUMN: MANUAL INPUTS */}
                            <div style={{ backgroundColor: "#f3fdf6", padding: "1.5rem", borderRadius: "10px" }}>
                                <h4 style={{ color: "#27ae60", borderBottom: "1px solid #dff9fb", marginBottom: "1rem" }}>✍️ Structural Details</h4>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label>Nature (NOC)</label>
                                        <select value={noc} onChange={(e) => setNoc(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                                            <option value="Brick & Cement">Brick & Cement</option>
                                            <option value="Timber">Timber</option>
                                            <option value="Metal">Metal Frame</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label>Floor Type (TOF)</label>
                                        <select value={tof} onChange={(e) => setTof(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                                            <option value="Tiled">Tiled</option>
                                            <option value="Cement">Cement</option>
                                            <option value="Marble">Marble</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label>Building Condition (COB)</label>
                                    <select value={cob} onChange={(e) => setCob(e.target.value)} style={{ width: '100%', padding: '0.8rem' }}>
                                        <option value="Excellent">Excellent</option>
                                        <option value="Good">Good</option>
                                        <option value="Fair">Fair</option>
                                        <option value="Dilapidated">Dilapidated</option>
                                    </select>
                                </div>

                                <div style={{ marginTop: '1rem' }}>
                                    <label>Age of Building (AOB) - Years</label>
                                    <input type="number" value={aob} onChange={(e) => setAob(e.target.value)} placeholder="e.g. 10" style={{ width: '100%', padding: '0.8rem' }} required />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} style={{ gridColumn: "span 2", padding: "1rem", backgroundColor: "#34495e", color: "#fff", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                                {loading ? "Compiling..." : "Compile Equation (2) Variables"}
                            </button>
                        </form>

                        {error && (
                            <div style={{ marginTop: "1rem", color: "#e74c3c", padding: "1rem", background: "#fdf2f2", borderRadius: "6px" }}>
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        {result && (
                            <div style={{ marginTop: "2rem", padding: "1.5rem", border: "2px solid #27ae60", borderRadius: "10px", backgroundColor: "#f8f9fa" }}>
                                <h3 style={{ color: "#27ae60" }}>✅ Dataset Ready for $Y2$</h3>
                                <p>All 10 variables for the building value regression model have been aggregated.</p>
                                <button
                                    onClick={() => navigate('/valuation-calculation', {
                                        state: {
                                            aggregatedVariables: result,
                                            satellite_image_path: state.satellite_image_path,
                                            street_view_image_path: state.street_view_image_path
                                        }
                                    })}
                                    style={{ marginTop: "1rem", padding: "0.8rem 2rem", backgroundColor: "#8e44ad", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
                                >
                                    Proceed to Calculate Building Value ($Y2$) ➔
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default CollectVariables;
