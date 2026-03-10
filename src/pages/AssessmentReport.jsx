import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AssessmentReport = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { finalData, auditTrail } = location.state || {};

    if (!finalData) {
        return (
            <div className="dashboard-container">
                <Header />
                <main className="main-content" style={{ textAlign: "center", padding: "5rem" }}>
                    <h2>No Report Data Available</h2>
                    <button onClick={() => navigate('/')} className="button">Back to Home</button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <Header />
            <main className="main-content" style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
                <div className="report-paper" style={{
                    backgroundColor: "#fff",
                    width: "100%",
                    maxWidth: "850px",
                    padding: "4rem",
                    boxShadow: "0 0 20px rgba(0,0,0,0.1)",
                    border: "1px solid #ddd",
                    position: "relative"
                }}>
                    {/* Header of Certificate */}
                    <div style={{ textAlign: "center", marginBottom: "3rem", borderBottom: "2px solid #2c3e50", paddingBottom: "1.5rem" }}>
                        <h1 style={{ margin: "0", color: "#2c3e50", textTransform: "uppercase", letterSpacing: "2px" }}>Property Valuation Output</h1>
                        <p style={{ margin: "0.5rem 0", color: "#7f8c8d" }}>Final Stage Assessment Report</p>
                        <div style={{ marginTop: "1rem" }}>
                            <span style={{ backgroundColor: "#27ae60", color: "#fff", padding: "0.4rem 1rem", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                {finalData.status}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
                        <div>
                            <h4 style={{ color: "#2980b9", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Property Identification</h4>
                            <p><strong>Assessment ID:</strong> {finalData.assessment_id}</p>
                            <p><strong>Parcel Reference:</strong> {finalData.parcel_id}</p>
                            <p><strong>Timestamp:</strong> {new Date(finalData.summary.timestamp).toLocaleString()}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <h4 style={{ color: "#2980b9", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Financial Summary</h4>
                            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2c3e50", margin: "1rem 0" }}>
                                Rs. {finalData.summary.total_building_value.toLocaleString()}
                            </p>
                            <p style={{ fontSize: "0.85rem", color: "#7f8c8d" }}>Total Estimated Building Value Contribution</p>
                        </div>
                    </div>

                    {/* Visual Evidence Segment */}
                    {auditTrail?.images && (
                        <div style={{ marginBottom: "3rem", backgroundColor: "#fcfcfc", padding: "1.5rem", borderRadius: "8px", border: "1px dashed #ced4da" }}>
                            <h4 style={{ color: "#2980b9", marginTop: "0", marginBottom: "1rem", fontSize: "0.9rem", textTransform: "uppercase" }}>Visual Evidence & AI Analysis</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ height: "150px", overflow: "hidden", borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid #eee" }}>
                                        <img src={`http://localhost:8001/images/${auditTrail.images.satellite.split('\\').pop()}`} alt="Satellite" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <span style={{ fontSize: "0.75rem", color: "#7f8c8d" }}>Satellite: {auditTrail.measurements.noc}</span>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <div style={{ height: "150px", overflow: "hidden", borderRadius: "6px", marginBottom: "0.5rem", border: "1px solid #eee" }}>
                                        <img src={`http://localhost:8001/images/${auditTrail.images.street.split('\\').pop()}`} alt="Street View" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                    <span style={{ fontSize: "0.75rem", color: "#7f8c8d" }}>Street: Perspective Check</span>
                                </div>
                            </div>
                            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                                <span><strong>Measured FAB:</strong> {auditTrail.measurements.fab} sq.ft</span>
                                <span><strong>Predicted Class:</strong> {auditTrail.measurements.noc}</span>
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: "3rem" }}>
                        <h4 style={{ color: "#2980b9", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Valuation Methodology</h4>
                        <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#34495e" }}>
                            The valuation was completed using <strong>Equation (2)</strong> for built structures.
                            The process integrated AI-derived classification (Nature of Construction),
                            automated measurement (FAB estimation from satellite imagery), and
                            GIS contextual factors.
                        </p>
                        <div style={{ backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", borderLeft: "4px solid #3498db", marginTop: "1rem" }}>
                            <p style={{ margin: "0", fontSize: "0.9rem", color: "#7f8c8d" }}>
                                <strong style={{ color: "#2c3e50" }}>Auditor Note:</strong> {finalData.summary.auditor_note}
                            </p>
                        </div>
                    </div>

                    {/* Technical Breakdown Table */}
                    <div style={{ marginBottom: "3rem" }}>
                        <h4 style={{ color: "#2980b9", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Technical Appendix (Equation 2 Details)</h4>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", marginTop: "1rem" }}>
                            <thead>
                                <tr style={{ backgroundColor: "#f8f9fa" }}>
                                    <th style={{ border: "1px solid #dee2e6", padding: "8px", textAlign: "left" }}>Variable Source</th>
                                    <th style={{ border: "1px solid #dee2e6", padding: "8px", textAlign: "left" }}>Metric Name</th>
                                    <th style={{ border: "1px solid #dee2e6", padding: "8px", textAlign: "left" }}>Applied Value</th>
                                    <th style={{ border: "1px solid #dee2e6", padding: "8px", textAlign: "left" }}>Factor Impact</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>AI & Image Analysis</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Floor Area (FAB)</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>{auditTrail.measurements.fab} sq.ft</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Primary Unit</td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>AI Classification</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Nature (NOC)</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>{auditTrail.measurements.noc}</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>x{auditTrail.valuation.factors_applied.NOC}</td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>GIS Context</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Accessibility (AOP)</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Standard</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>x{auditTrail.valuation.factors_applied.AOP}</td>
                                </tr>
                                <tr>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Manual Entry</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Building Condition (COB)</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>Evaluated</td>
                                    <td style={{ border: "1px solid #dee2e6", padding: "8px" }}>x{auditTrail.valuation.factors_applied.COB}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginBottom: "3rem" }}>
                        <h4 style={{ color: "#2980b9", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Official Disclaimer</h4>
                        <p style={{ fontSize: "0.75rem", color: "#95a5a6", lineHeight: "1.4" }}>
                            This report is generated by the AI-Assisted Valuation Research Component.
                            The values presented are estimates based on satellite imagery and neural network classification.
                            This document is for academic and prototype demonstration purposes and does not
                            constitute a legally binding assessment from a Municipal Council.
                        </p>
                    </div>

                    {/* Signature Section */}
                    <div style={{ marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ borderBottom: "1px solid #2c3e50", width: "200px", marginBottom: "0.5rem" }}></div>
                            <p style={{ margin: "0", fontSize: "0.85rem", fontWeight: "bold" }}>Authorized Valuation Officer</p>
                            <p style={{ margin: "0", fontSize: "0.7rem", color: "#95a5a6" }}>Date of Generation: {new Date().toLocaleDateString()}</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=VAL-VERIFIED" alt="Verification QR" style={{ marginBottom: "0.5rem" }} />
                            <p style={{ margin: "0", fontSize: "0.7rem", color: "#bdc3c7" }}>Verification ID: {finalData.assessment_id}</p>
                        </div>
                    </div>

                    {/* Action Buttons (Excluded from Print) */}
                    <div className="no-print" style={{ marginTop: "4rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}>
                        <button onClick={() => window.print()} className="button" style={{ backgroundColor: "#34495e", padding: "0.8rem 2rem", borderRadius: "30px", fontSize: "1rem", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                            📥 Generate Official PDF
                        </button>
                        <button onClick={() => navigate('/')} className="button" style={{ backgroundColor: "#27ae60", padding: "0.8rem 2rem", borderRadius: "30px", fontSize: "1rem" }}>
                            🏠 Return to Home
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .main-content { padding: 0 !important; }
                    .report-paper { box-shadow: none !important; border: none !important; width: 100% !important; max-width: none !important; }
                    Header, Footer { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default AssessmentReport;
