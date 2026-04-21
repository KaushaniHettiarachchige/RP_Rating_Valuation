import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AssessmentReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalData, auditTrail } = location.state || {};

  if (!finalData) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "5rem",
          backgroundColor: "#f0fdf4",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ color: "#065f46" }}>No Report Data Available</h2>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const colors = {
    primary: "#065f46", // Deep Green
    secondary: "#10b981", // Emerald
    accent: "#34d399", // Light Emerald
    bg: "#f0fdf4", // Mint White
    text: "#1e293b",
    border: "#d1fae5",
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        minHeight: "100vh",
        padding: "3rem 1rem",
      }}
    >
      <main style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="report-paper"
          style={{
            backgroundColor: "#fff",
            width: "100%",
            maxWidth: "850px",
            padding: "4rem",
            boxShadow: "0 10px 30px rgba(6, 95, 70, 0.08)",
            borderRadius: "12px",
            border: `1px solid ${colors.border}`,
            position: "relative",
          }}
        >
          {/* Certificate Header Decoration */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "8px",
              backgroundColor: colors.primary,
              borderRadius: "12px 12px 0 0",
            }}
          />

          {/* Header */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "3rem",
              borderBottom: `2px solid ${colors.primary}`,
              paddingBottom: "1.5rem",
            }}
          >
            <h1
              style={{
                margin: "0",
                color: colors.primary,
                textTransform: "uppercase",
                letterSpacing: "3px",
                fontSize: "1.8rem",
              }}
            >
              Property Valuation Output
            </h1>
            <p
              style={{ margin: "0.5rem 0", color: "#64748b", fontWeight: 500 }}
            >
              AI-ASSISTED FINAL ASSESSMENT REPORT
            </p>
            <div style={{ marginTop: "1rem" }}>
              <span
                style={{
                  backgroundColor: colors.secondary,
                  color: "#fff",
                  padding: "0.5rem 1.5rem",
                  borderRadius: "30px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(16, 185, 129, 0.2)",
                }}
              >
                {finalData.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Identification & Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              marginBottom: "3rem",
            }}
          >
            <div
              style={{
                borderLeft: `4px solid ${colors.accent}`,
                paddingLeft: "1rem",
              }}
            >
              <h4
                style={{
                  color: colors.primary,
                  marginBottom: "0.8rem",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Property Identification
              </h4>
              <p style={{ margin: "4px 0" }}>
                <strong>ID:</strong>{" "}
                <code style={{ color: colors.primary }}>
                  {finalData.assessment_id}
                </code>
              </p>
              <p style={{ margin: "4px 0" }}>
                <strong>Parcel:</strong> {finalData.parcel_id}
              </p>
              <p
                style={{
                  margin: "4px 0",
                  fontSize: "0.85rem",
                  color: "#64748b",
                }}
              >
                {new Date(finalData.summary.timestamp).toLocaleString()}
              </p>
            </div>
            <div
              style={{
                textAlign: "right",
                backgroundColor: "#f9fafb",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <h4
                style={{
                  color: colors.primary,
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                }}
              >
                Financial Contribution
              </h4>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: "800",
                  color: colors.primary,
                  margin: "0",
                }}
              >
                Rs. {finalData.summary.total_building_value.toLocaleString()}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#64748b",
                  marginTop: "5px",
                }}
              >
                Estimated Building Value (NOC Adjusted)
              </p>
            </div>
          </div>

          {/* Visual Evidence Section */}
          {auditTrail?.images && (
            <div
              style={{
                marginBottom: "3rem",
                backgroundColor: "#f8fafc",
                padding: "1.5rem",
                borderRadius: "12px",
                border: `1px solid ${colors.border}`,
              }}
            >
              <h4
                style={{
                  color: colors.primary,
                  marginTop: "0",
                  marginBottom: "1rem",
                  fontSize: "0.85rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Visual Evidence & AI Analysis
              </h4>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      borderRadius: "8px",
                      border: `2px solid ${colors.border}`,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <img
                      src={`http://localhost:8001/images/${auditTrail.images.satellite.split("\\").pop()}`}
                      alt="Satellite"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    SATELLITE VIEW
                  </span>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      height: "180px",
                      overflow: "hidden",
                      borderRadius: "8px",
                      border: `2px solid ${colors.border}`,
                      marginBottom: "0.5rem",
                    }}
                  >
                    <img
                      src={`http://localhost:8001/images/${auditTrail.images.street.split("\\").pop()}`}
                      alt="Street View"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      color: colors.primary,
                    }}
                  >
                    STREET PERSPECTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div style={{ marginBottom: "3rem" }}>
            <h4
              style={{
                color: colors.primary,
                borderBottom: `1px solid ${colors.border}`,
                paddingBottom: "0.5rem",
                textTransform: "uppercase",
                fontSize: "0.9rem",
              }}
            >
              Technical Breakdown
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: colors.bg }}>
                  <th
                    style={{
                      border: `1px solid ${colors.border}`,
                      padding: "12px",
                      textAlign: "left",
                      color: colors.primary,
                    }}
                  >
                    Source
                  </th>
                  <th
                    style={{
                      border: `1px solid ${colors.border}`,
                      padding: "12px",
                      textAlign: "left",
                      color: colors.primary,
                    }}
                  >
                    Metric
                  </th>
                  <th
                    style={{
                      border: `1px solid ${colors.border}`,
                      padding: "12px",
                      textAlign: "left",
                      color: colors.primary,
                    }}
                  >
                    Value
                  </th>
                  <th
                    style={{
                      border: `1px solid ${colors.border}`,
                      padding: "12px",
                      textAlign: "left",
                      color: colors.primary,
                    }}
                  >
                    Factor
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "AI Analysis",
                    "Floor Area (FAB)",
                    `${auditTrail.measurements.fab} sq.ft`,
                    "Base",
                  ],
                  [
                    "Classification",
                    "Nature (NOC)",
                    auditTrail.measurements.noc,
                    `x${auditTrail.valuation.factors_applied.NOC}`,
                  ],
                  [
                    "GIS Context",
                    "Accessibility",
                    "Standard",
                    `x${auditTrail.valuation.factors_applied.AOP}`,
                  ],
                  [
                    "Manual Review",
                    "Condition (COB)",
                    "Evaluated",
                    `x${auditTrail.valuation.factors_applied.COB}`,
                  ],
                ].map(([source, metric, val, factor], i) => (
                  <tr key={i}>
                    <td
                      style={{
                        border: `1px solid ${colors.border}`,
                        padding: "10px",
                      }}
                    >
                      {source}
                    </td>
                    <td
                      style={{
                        border: `1px solid ${colors.border}`,
                        padding: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {metric}
                    </td>
                    <td
                      style={{
                        border: `1px solid ${colors.border}`,
                        padding: "10px",
                      }}
                    >
                      {val}
                    </td>
                    <td
                      style={{
                        border: `1px solid ${colors.border}`,
                        padding: "10px",
                        color: colors.secondary,
                        fontWeight: "bold",
                      }}
                    >
                      {factor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Notes */}
          <div
            style={{
              backgroundColor: "#f0f9ff",
              padding: "1.2rem",
              borderRadius: "8px",
              borderLeft: `5px solid ${colors.secondary}`,
              marginBottom: "3rem",
            }}
          >
            <p style={{ margin: "0", fontSize: "0.85rem", color: "#334155" }}>
              <strong style={{ color: colors.primary }}>Auditor Note:</strong>{" "}
              {finalData.summary.auditor_note}
            </p>
          </div>

          {/* Signature & QR */}
          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderTop: `1px solid ${colors.border}`,
              paddingTop: "2rem",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  borderBottom: `1px solid ${colors.primary}`,
                  width: "220px",
                  marginBottom: "0.5rem",
                  height: "40px",
                }}
              ></div>
              <p
                style={{
                  margin: "0",
                  fontSize: "0.85rem",
                  fontWeight: "bold",
                  color: colors.primary,
                }}
              >
                Authorized Valuation Officer
              </p>
              <p style={{ margin: "0", fontSize: "0.7rem", color: "#94a3b8" }}>
                Generated on: {new Date().toLocaleDateString()}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${finalData.assessment_id}&color=065f46`}
                alt="Verification QR"
                style={{
                  marginBottom: "0.5rem",
                  border: `1px solid ${colors.border}`,
                  padding: "4px",
                }}
              />
              <p style={{ margin: "0", fontSize: "0.65rem", color: "#94a3b8" }}>
                VERIFY REPORT: {finalData.assessment_id}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div
            className="no-print"
            style={{
              marginTop: "4rem",
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => window.print()}
              style={{
                backgroundColor: colors.primary,
                color: "white",
                padding: "0.8rem 2rem",
                borderRadius: "30px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📥 Generate PDF
            </button>
            <button
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "white",
                color: colors.primary,
                padding: "0.8rem 2rem",
                borderRadius: "30px",
                border: `2px solid ${colors.primary}`,
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🏠 Home
            </button>
          </div>
        </div>
      </main>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; }
          .report-paper { box-shadow: none !important; border: 1px solid #eee !important; width: 100% !important; max-width: none !important; padding: 2rem !important; }
        }
      `}</style>
    </div>
  );
};

export default AssessmentReport;
