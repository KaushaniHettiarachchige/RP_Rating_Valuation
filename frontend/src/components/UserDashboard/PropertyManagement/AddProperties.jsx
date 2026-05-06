import { useState, useEffect, useRef } from "react";
import LeafletMap from "./LeafletMap";
import axios from "axios";

const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_CLOUD_NAME = "demo";

const STEPS = ["Owner & Property", "Location", "Details", "Documents"];

const EMPTY_FORM = {
  nic: "",
  address: "",
  type: "",
  landSize: "",
  landUnit: "perches",
  lat: "",
  lng: "",
  stories: "",
  rooms: "",
  propertyImage: null,
  propertyImageUrl: "",
  documents: [],
};

function StepIndicator({ current, steps }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: "2rem",
      }}
    >
      {steps.map((label, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            flex: i < steps.length - 1 ? 1 : "none",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background:
                  i < current
                    ? "#16a34a"
                    : i === current
                      ? "#15803d"
                      : "var(--color-background-secondary)",
                border: `2px solid ${i <= current ? "#16a34a" : "var(--color-border-tertiary)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s",
                flexShrink: 0,
              }}
            >
              {i < current ? (
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color:
                      i === current ? "white" : "var(--color-text-tertiary)",
                  }}
                >
                  {i + 1}
                </span>
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: i === current ? "#15803d" : "var(--color-text-tertiary)",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              style={{
                flex: 1,
                height: 2,
                background:
                  i < current ? "#16a34a" : "var(--color-border-tertiary)",
                margin: "0 4px",
                marginBottom: 22,
                transition: "all 0.3s",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, required, error, hint, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "var(--color-text-secondary)",
        }}
      >
        {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
        {hint && (
          <span
            style={{
              fontWeight: 400,
              color: "var(--color-text-tertiary)",
              marginLeft: 4,
            }}
          >
            ({hint})
          </span>
        )}
      </label>
      {children}
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>{error}</p>
      )}
    </div>
  );
}

const inputStyle = (error) => ({
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  fontSize: 14,
  border: `1px solid ${error ? "#fca5a5" : "var(--color-border-tertiary)"}`,
  background: error ? "#fff5f5" : "var(--color-background-primary)",
  color: "var(--color-text-primary)",
  outline: "none",
  boxSizing: "border-box",
  transition: "border 0.2s",
});

const selectStyle = (error) => ({
  ...inputStyle(error),
  cursor: "pointer",
  appearance: "none",
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 12px center",
  paddingRight: 36,
});

function ImageUploader({ value, preview, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    onChange(file, localUrl, false);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", "property-val");
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/dzbapn7y0/image/upload`,
        { method: "POST", body: fd },
      );
      const data = await res.json();

      onChange(file, data.secure_url || localUrl, true);
    } catch {
      onChange(file, localUrl, false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onClick={() => !uploading && inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files[0]);
      }}
      style={{
        border: `2px dashed ${preview ? "#16a34a" : "var(--color-border-tertiary)"}`,
        borderRadius: 12,
        padding: preview ? 0 : "2rem 1rem",
        cursor: uploading ? "wait" : "pointer",
        textAlign: "center",
        background: "var(--color-background-secondary)",
        overflow: "hidden",
        transition: "border 0.2s",
        position: "relative",
        minHeight: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFile(e.target.files[0])}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              display: "block",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 8,
              right: 8,
              background: uploading ? "#f59e0b" : "#16a34a",
              color: "white",
              fontSize: 11,
              padding: "4px 10px",
              borderRadius: 20,
            }}
          >
            {uploading ? "Uploading…" : "Saved"}
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              fill="none"
              stroke="#16a34a"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-text-primary)",
              }}
            >
              Click or drag to upload
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "var(--color-text-tertiary)",
              }}
            >
              JPG, PNG, WEBP — max 10MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Updated DocumentUploader with Cloudinary upload ───────────────────────
function DocumentUploader({ docs, onChange }) {
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    // Add docs immediately with uploading:true so UI shows spinner
    const newDocs = Array.from(files).map((f) => ({
      name: f.name,
      originalName: f.name,
      size: f.size,
      file: f,
      mimeType: f.type,
      url: null,
      uploading: true,
    }));

    const startIndex = docs.length;

    // Merge into state right away (functional updater so we always get latest)
    onChange((prev) => [...prev, ...newDocs]);

    // Upload each file to Cloudinary in parallel
    const uploaded = await Promise.all(
      newDocs.map(async (doc) => {
        try {
          const fd = new FormData();
          fd.append("file", doc.file);
          fd.append("upload_preset", "property-val");

          // Use /raw/upload for non-image files; images also work via /raw/upload
          const res = await fetch(
            `https://api.cloudinary.com/v1_1/dzbapn7y0/raw/upload`,
            { method: "POST", body: fd },
          );
          const data = await res.json();
          return {
            ...doc,
            url: data.secure_url || null,
            uploading: false,
          };
        } catch {
          return { ...doc, url: null, uploading: false };
        }
      }),
    );

    // Patch the docs that just finished uploading
    onChange((prev) => {
      const updated = [...prev];
      uploaded.forEach((doc, i) => {
        updated[startIndex + i] = doc;
      });
      return updated;
    });
  };

  const remove = (i) => onChange((prev) => prev.filter((_, idx) => idx !== i));

  const fmt = (b) =>
    b > 1048576
      ? `${(b / 1048576).toFixed(1)} MB`
      : `${Math.round(b / 1024)} KB`;

  const getIcon = (type = "") => {
    if (type.includes("pdf"))
      return { bg: "#fee2e2", color: "#dc2626", label: "PDF" };
    if (type.includes("image"))
      return { bg: "#dcfce7", color: "#16a34a", label: "IMG" };
    return { bg: "#e0f2fe", color: "#0284c7", label: "DOC" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: "2px dashed var(--color-border-tertiary)",
          borderRadius: 12,
          padding: "1.5rem 1rem",
          cursor: "pointer",
          textAlign: "center",
          background: "var(--color-background-secondary)",
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg
            width="28"
            height="28"
            fill="none"
            stroke="#16a34a"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            Upload legal documents
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: "var(--color-text-tertiary)",
            }}
          >
            Deeds, title documents, survey plans — PDF, JPG, DOC
          </p>
        </div>
      </div>

      {docs.map((doc, i) => {
        const ic = getIcon(doc.mimeType || doc.type);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 10,
              background: "var(--color-background-secondary)",
              border: `1px solid ${doc.url ? "#bbf7d0" : "var(--color-border-tertiary)"}`,
              transition: "border 0.3s",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: ic.bg,
                color: ic.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {ic.label}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {doc.name}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "var(--color-text-tertiary)",
                }}
              >
                {fmt(doc.size)}
              </p>
            </div>
            {/* Upload status badge */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 500,
                padding: "3px 8px",
                borderRadius: 20,
                background: doc.uploading
                  ? "#fef3c7"
                  : doc.url
                    ? "#dcfce7"
                    : "#fee2e2",
                color: doc.uploading
                  ? "#92400e"
                  : doc.url
                    ? "#166534"
                    : "#991b1b",
                flexShrink: 0,
              }}
            >
              {doc.uploading ? "Uploading…" : doc.url ? "Saved" : "Failed"}
            </div>
            <button
              onClick={() => remove(i)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                color: "var(--color-text-tertiary)",
                lineHeight: 1,
              }}
            >
              <svg
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function AddPropertySection() {
  const [form, setForm] = useState(EMPTY_FORM);
  console.log("🚀 ~ AddPropertySection ~ form:", form);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.nic.trim()) e.nic = "NIC is required";
      else if (!/^(\d{9}[VXvx]|\d{12})$/.test(form.nic.trim()))
        e.nic = "Enter a valid NIC (9 digits + V/X or 12 digits)";
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.type) e.type = "Select property type";
    }
    if (s === 1) {
      if (!form.lat || isNaN(Number(form.lat)))
        e.lat = "Valid latitude required";
      if (!form.lng || isNaN(Number(form.lng)))
        e.lng = "Valid longitude required";
    }
    if (s === 2) {
      if (!form.landSize || isNaN(Number(form.landSize)))
        e.landSize = "Enter a valid land size";
      if (
        form.type === "full" &&
        (!form.stories || isNaN(Number(form.stories)))
      )
        e.stories = "Enter number of stories";
      if (form.type === "full" && (!form.rooms || isNaN(Number(form.rooms))))
        e.rooms = "Enter number of rooms";
    }
    return e;
  };

  const nextStep = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setStep((s) => s + 1);
    setErrors({});
  };

  const prevStep = () => {
    setStep((s) => s - 1);
    setErrors({});
  };

  const handleSubmit = async () => {
    const e = validateStep(step);
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    // Warn if any document is still uploading
    const stillUploading = form.documents.some((d) => d.uploading);
    if (stillUploading) {
      setErrors({ api: "Please wait — some documents are still uploading." });
      return;
    }

    const payload = {
      nic: form.nic,
      address: form.address,
      type: form.type,
      landSize: Number(form.landSize),

      location: {
        lat: parseFloat(form.lat),
        lng: parseFloat(form.lng),
      },

      ...(form.type === "full"
        ? {
            stories: parseInt(form.stories),
            rooms: parseInt(form.rooms),
          }
        : {}),

      image:
        form.propertyImageUrl ||
        "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80",

      documents: form.documents.map((d) => d.url).filter(Boolean),

      verification: "pending",
      valuation: null,
      currency: "LKR",
    };

    try {
      const res = await axios.post(
        "http://localhost:3001/property/create",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Saved successfully:", res.data);

      setStep(4);
    } catch (error) {
      console.error("Error saving property:", error);
      setErrors({ api: "Failed to save property. Please try again." });
    }
  };

  const labelMap = { land: "Land", full: "Full Property" };

  return (
    <div
      style={{
        fontFamily: "var(--font-sans)",
        maxWidth: 640,
        margin: "0 auto",
        padding: "1.5rem 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#15803d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
              <polyline
                strokeLinecap="round"
                strokeLinejoin="round"
                points="9 22 9 12 15 12 15 22"
              />
            </svg>
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Register New Property
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "var(--color-text-tertiary)",
              }}
            >
              All submissions are reviewed before verification
            </p>
          </div>
        </div>
      </div>

      {step < 4 && <StepIndicator current={step} steps={STEPS} />}

      {step === 4 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <svg
              width="30"
              height="30"
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Submitted for Verification
          </h3>
          <p
            style={{
              margin: "0 0 1.5rem",
              fontSize: 14,
              color: "var(--color-text-secondary)",
            }}
          >
            Your property has been registered and is pending review. You'll be
            notified once verified.
          </p>
          <button
            onClick={() => {
              setForm(EMPTY_FORM);
              setStep(0);
              setErrors({});
            }}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              background: "#15803d",
              color: "white",
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Register Another
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {step === 0 && (
            <>
              <Field
                label="National Identity Card (NIC)"
                required
                error={errors.nic}
              >
                <input
                  style={inputStyle(errors.nic)}
                  placeholder="e.g. 199012345678 or 901234567V"
                  value={form.nic}
                  onChange={(e) => set("nic", e.target.value)}
                />
              </Field>
              <Field label="Property Address" required error={errors.address}>
                <textarea
                  style={{
                    ...inputStyle(errors.address),
                    resize: "vertical",
                    minHeight: 80,
                  }}
                  placeholder="e.g. 15 Flower Road, Colombo 07"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </Field>
              <Field label="Property Type" required error={errors.type}>
                <select
                  style={selectStyle(errors.type)}
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  <option value="">Select type…</option>
                  <option value="land">Land only</option>
                  <option value="full">Full Property (with building)</option>
                </select>
              </Field>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    fontWeight: 500,
                  }}
                >
                  Click on the map or drag the pin to set coordinates
                </p>
                <LeafletMap
                  lat={form.lat}
                  lng={form.lng}
                  onChange={(lat, lng) => {
                    set("lat", lat);
                    set("lng", lng);
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <Field label="Latitude" required error={errors.lat}>
                  <input
                    style={inputStyle(errors.lat)}
                    type="number"
                    step="any"
                    placeholder="6.9271"
                    value={form.lat}
                    onChange={(e) => set("lat", e.target.value)}
                  />
                </Field>
                <Field label="Longitude" required error={errors.lng}>
                  <input
                    style={inputStyle(errors.lng)}
                    type="number"
                    step="any"
                    placeholder="79.8612"
                    value={form.lng}
                    onChange={(e) => set("lng", e.target.value)}
                  />
                </Field>
              </div>
              {(errors.lat || errors.lng) && (
                <p style={{ fontSize: 12, color: "#ef4444", margin: 0 }}>
                  Use the map or enter coordinates manually
                </p>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Field label="Land Size" required error={errors.landSize}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    style={{ ...inputStyle(errors.landSize), flex: 1 }}
                    type="number"
                    step="any"
                    placeholder="e.g. 20"
                    value={form.landSize}
                    onChange={(e) => set("landSize", e.target.value)}
                  />
                  <select
                    style={{ ...selectStyle(false), width: 130 }}
                    value={form.landUnit}
                    onChange={(e) => set("landUnit", e.target.value)}
                  >
                    <option value="perches">Perches</option>
                    <option value="acres">Acres</option>
                    <option value="sq_ft">Sq. Ft.</option>
                    <option value="sq_m">Sq. Meters</option>
                  </select>
                </div>
              </Field>

              {form.type === "full" && (
                <>
                  <div
                    style={{
                      height: 1,
                      background: "var(--color-border-tertiary)",
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Building Details
                  </p>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                    }}
                  >
                    <Field
                      label="Number of Stories"
                      required
                      error={errors.stories}
                    >
                      <input
                        style={inputStyle(errors.stories)}
                        type="number"
                        min="1"
                        placeholder="e.g. 2"
                        value={form.stories}
                        onChange={(e) => set("stories", e.target.value)}
                      />
                    </Field>
                    <Field
                      label="Number of Rooms"
                      required
                      error={errors.rooms}
                    >
                      <input
                        style={inputStyle(errors.rooms)}
                        type="number"
                        min="1"
                        placeholder="e.g. 4"
                        value={form.rooms}
                        onChange={(e) => set("rooms", e.target.value)}
                      />
                    </Field>
                  </div>
                </>
              )}

              <Field label="Property Photo" hint="optional">
                <ImageUploader
                  value={form.propertyImage}
                  preview={form.propertyImageUrl}
                  onChange={(file, url, uploaded) => {
                    setForm((f) => ({
                      ...f,
                      propertyImage: file,
                      propertyImageUrl: url,
                    }));
                  }}
                />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <div
                style={{
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  fontSize: 13,
                  color: "#166534",
                }}
              >
                Upload supporting documents for verification — title deed,
                survey plan, or government assessments.
              </div>
              <DocumentUploader
                docs={form.documents}
                onChange={(docsOrUpdater) =>
                  setForm((f) => ({
                    ...f,
                    documents:
                      typeof docsOrUpdater === "function"
                        ? docsOrUpdater(f.documents)
                        : docsOrUpdater,
                  }))
                }
              />

              <div
                style={{
                  marginTop: 8,
                  padding: "14px 16px",
                  borderRadius: 10,
                  background: "var(--color-background-secondary)",
                  border: "1px solid var(--color-border-tertiary)",
                }}
              >
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Summary
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto 1fr",
                    gap: "6px 12px",
                    fontSize: 13,
                  }}
                >
                  {[
                    ["NIC", form.nic],
                    ["Address", form.address],
                    ["Type", labelMap[form.type] || "—"],
                    [
                      "Land Size",
                      form.landSize ? `${form.landSize} ${form.landUnit}` : "—",
                    ],
                    [
                      "Coordinates",
                      form.lat && form.lng ? `${form.lat}, ${form.lng}` : "—",
                    ],
                    ...(form.type === "full"
                      ? [
                          ["Stories", form.stories || "—"],
                          ["Rooms", form.rooms || "—"],
                        ]
                      : []),
                    [
                      "Documents",
                      form.documents.length
                        ? `${form.documents.filter((d) => d.url).length}/${form.documents.length} uploaded`
                        : "None",
                    ],
                  ].map(([k, v]) => (
                    <>
                      <span
                        key={k + "k"}
                        style={{
                          color: "var(--color-text-tertiary)",
                          fontWeight: 500,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {k}
                      </span>
                      <span
                        key={k + "v"}
                        style={{
                          color: "var(--color-text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {v}
                      </span>
                    </>
                  ))}
                </div>
              </div>

              {errors.api && (
                <p style={{ fontSize: 13, color: "#ef4444", margin: 0 }}>
                  {errors.api}
                </p>
              )}
            </>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            {step > 0 && (
              <button
                onClick={prevStep}
                style={{
                  flex: "none",
                  padding: "11px 20px",
                  borderRadius: 10,
                  border: "1px solid var(--color-border-tertiary)",
                  background: "var(--color-background-primary)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  color: "var(--color-text-primary)",
                }}
              >
                ← Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < 3 ? (
              <button
                onClick={nextStep}
                style={{
                  padding: "11px 28px",
                  borderRadius: 10,
                  background: "#15803d",
                  color: "white",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "11px 28px",
                  borderRadius: 10,
                  background: "#15803d",
                  color: "white",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 2px 12px rgba(21,128,61,0.3)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Proceed to Verification
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddPropertySection;
