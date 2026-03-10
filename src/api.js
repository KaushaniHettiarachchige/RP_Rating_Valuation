const API = "http://localhost:8001";

export async function receiveParcelData(parcelData) {
  const res = await fetch(`${API}/api/parcel/receive`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parcelData),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to receive parcel data");
  }
  return res.json();
}
export async function predictSatellite(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/predict/satellite`, {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to predict satellite");
  }
  return res.json();
}

export async function predictStreet(file) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API}/predict/street`, {
    method: "POST",
    body: form
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Failed to predict street");
  }
  return res.json();
}

export async function calculateValuation(payload) {
  const res = await fetch(`${API}/valuation/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("predictStreet failed");
  return res.json();
}

export async function preprocessPropertyImages(satPath, stPath) {
  const res = await fetch(`${API}/preprocess-images`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      satellite_image_path: satPath,
      street_view_image_path: stPath
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Preprocessing failed");
  }
  return res.json();
}

export async function detectPropertyFeatures(satPath, stPath) {
  const res = await fetch(`${API}/detect-features`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      satellite_image_path: satPath,
      street_view_image_path: stPath
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "AI Detection failed.");
  }
  return res.json();
}

export async function calculateMeasurements(polygon, predictedClass) {
  const res = await fetch(`${API}/estimate-measurements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      boundary_polygon: polygon,
      predicted_class: predictedClass
    }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Measurement calculation failed.");
  }
  return res.json();
}