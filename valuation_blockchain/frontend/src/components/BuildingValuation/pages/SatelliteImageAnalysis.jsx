import React, { useState } from "react";
import { predictSatellite, calculateValuation } from "../api";

export default function SatelliteAnalysis() {
  const [imageUrl, setImageUrl] = useState(null);
  const [pred, setPred] = useState(null);
  const [monthlyRent, setMonthlyRent] = useState("");
  const [useType, setUseType] = useState("residential");
  const [ratePct, setRatePct] = useState("");
  const [result, setResult] = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [error, setError] = useState("");
  const [loadingVal, setLoadingVal] = useState(false);

  // Green Palette
  const colors = {
    primary: "#1b4332", // Deep Forest
    accent: "#2d6a4f", // Dark Sea Green
    vibrant: "#52b788", // Mint
    lightBg: "#f7fcf9", // Pale Green
    cardBg: "#ffffff",
    border: "#d8e2dc",
    error: "#e76f51",
    muted: "#6b705c",
  };

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setPred(null);
    setResult(null);
    setImageUrl(URL.createObjectURL(file));

    try {
      setLoadingPred(true);
      const out = await predictSatellite(file);
      setPred(out);
    } catch (err) {
      setError(
        err.message || "Prediction failed. Ensure backend is on port 8001.",
      );
    } finally {
      setLoadingPred(false);
    }
  }

  async function onCalculate() {
    if (!pred) return alert("Upload an image first.");

    const payload = {
      monthly_rent: monthlyRent ? Number(monthlyRent) : null,
      property_use: useType,
      council_rate_pct: ratePct ? Number(ratePct) : null,
      sat_class: pred.predicted_class,
      confidence: pred.confidence,
    };

    try {
      setLoadingVal(true);
      const val = await calculateValuation(payload);
      setResult(val);
    } catch (err) {
      setError(err.message || "Valuation failed. Check backend logs.");
    } finally {
      setLoadingVal(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: colors.lightBg,
        minHeight: "100vh",
        padding: "3rem 1rem",
      }}
    >
      <main style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2
          style={{
            color: colors.primary,
            textAlign: "center",
            fontSize: "2.2rem",
            fontWeight: "800",
            marginBottom: "2.5rem",
          }}
        >
          Satellite Image Analysis
        </h2>

        {error && (
          <div
            style={{
              ...styles.card,
              borderLeft: `6px solid ${colors.error}`,
              backgroundColor: "#fff5f2",
            }}
          >
            <p style={{ margin: 0, color: colors.error, fontWeight: "600" }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {/* Step 1: Upload */}
        <section style={styles.card}>
          <h3 style={styles.cardTitle}>1) Upload Satellite Image</h3>
          <div style={styles.uploadBox}>
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              style={{ marginBottom: "1rem" }}
            />
            {imageUrl && (
              <div style={styles.imageWrapper}>
                <img style={styles.preview} src={imageUrl} alt="sat" />
              </div>
            )}
            {loadingPred && (
              <p
                style={{
                  color: colors.vibrant,
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                📡 Analyzing terrain patterns...
              </p>
            )}
          </div>
        </section>

        {/* Step 2 & 3: Prediction & Inputs */}
        {pred && (
          <section style={styles.card}>
            <div style={styles.predictionBadge}>
              <h3
                style={{
                  ...styles.cardTitle,
                  color: colors.white,
                  marginBottom: 0,
                }}
              >
                Analysis Result
              </h3>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>CLASS</div>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {pred.predicted_class}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>
                  CONFIDENCE
                </div>
                <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {(pred.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <h3 style={{ ...styles.cardTitle, marginTop: "2rem" }}>
              2) Valuation Parameters
            </h3>
            <div style={styles.formGrid}>
              <div style={styles.formRow}>
                <label style={styles.label}>Monthly Rent (LKR)</label>
                <input
                  style={styles.input}
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="e.g., 75000"
                />
              </div>

              <div style={styles.formRow}>
                <label style={styles.label}>Property Use</label>
                <select
                  style={styles.input}
                  value={useType}
                  onChange={(e) => setUseType(e.target.value)}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
            </div>

            <div style={{ ...styles.formRow, marginTop: "1rem" }}>
              <label style={styles.label}>Council Rate % (Optional)</label>
              <input
                style={styles.input}
                value={ratePct}
                onChange={(e) => setRatePct(e.target.value)}
                placeholder="Leave blank for default"
              />
              <small
                style={{
                  color: colors.muted,
                  display: "block",
                  marginTop: "5px",
                }}
              >
                Adjust according to local Municipal Council regulations.
              </small>
            </div>

            <button
              style={styles.primaryBtn}
              onClick={onCalculate}
              disabled={loadingVal}
            >
              {loadingVal
                ? "🔄 Computing Valuation..."
                : "Calculate Rates Payable"}
            </button>
          </section>
        )}

        {/* Step 4: Final Result */}
        {result && (
          <section
            style={{
              ...styles.card,
              border: `2px solid ${colors.vibrant}`,
              backgroundColor: "#f0fff4",
            }}
          >
            <h3 style={{ ...styles.cardTitle, color: colors.accent }}>
              3) Valuation Summary
            </h3>

            <div style={styles.resultGrid}>
              <div style={styles.resultItem}>
                <span>Annual Value</span>
                <strong style={{ color: colors.primary }}>
                  {Number(result.annual_value).toLocaleString()} LKR
                </strong>
              </div>
              <div style={styles.resultItem}>
                <span>Annual Rates</span>
                <strong style={{ color: colors.primary }}>
                  {Number(result.annual_rates).toLocaleString()} LKR
                </strong>
              </div>
              <div
                style={{
                  ...styles.resultItem,
                  border: "none",
                  backgroundColor: colors.primary,
                  borderRadius: "8px",
                  padding: "10px",
                }}
              >
                <span style={{ color: "#fff" }}>Quarterly Rates</span>
                <strong style={{ color: colors.vibrant, fontSize: "1.2rem" }}>
                  {Number(result.quarterly_rates).toLocaleString()} LKR
                </strong>
              </div>
            </div>

            <p style={{ ...styles.explanation, color: colors.accent }}>
              💡 {result.explanation}
            </p>

            <button
              style={styles.secondaryBtn}
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ pred, result }, null, 2)],
                  { type: "application/json" },
                );
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `valuation_${pred.predicted_class}.json`;
                a.click();
              }}
            >
              📥 Download Audit Report (JSON)
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(27, 67, 50, 0.05)",
    border: "1px solid #d8e2dc",
    marginBottom: "2rem",
  },
  cardTitle: {
    color: "#1b4332",
    fontSize: "1.1rem",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "1.2rem",
  },
  uploadBox: {
    border: "2px dashed #d8e2dc",
    padding: "1.5rem",
    borderRadius: "12px",
    textAlign: "center",
  },
  imageWrapper: {
    marginTop: "1rem",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #d8e2dc",
  },
  preview: { width: "100%", maxHeight: "300px", objectFit: "cover" },
  predictionBadge: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1b4332",
    padding: "1.2rem",
    borderRadius: "12px",
    color: "#fff",
  },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" },
  label: {
    display: "block",
    fontWeight: "700",
    color: "#2d6a4f",
    fontSize: "0.85rem",
    marginBottom: "6px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1.5px solid #d8e2dc",
    outline: "none",
  },
  primaryBtn: {
    width: "100%",
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#1b4332",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
  },
  resultGrid: { display: "grid", gap: "10px", margin: "1.5rem 0" },
  resultItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #d8e2dc",
  },
  explanation: {
    fontStyle: "italic",
    fontSize: "0.9rem",
    padding: "1rem",
    backgroundColor: "rgba(82, 183, 136, 0.1)",
    borderRadius: "8px",
    marginTop: "1rem",
  },
  secondaryBtn: {
    width: "100%",
    marginTop: "1.5rem",
    padding: "0.8rem",
    backgroundColor: "transparent",
    color: "#2d6a4f",
    border: "2px solid #2d6a4f",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
