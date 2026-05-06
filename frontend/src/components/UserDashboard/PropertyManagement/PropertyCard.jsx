import { useState } from "react";

export function PropertyCard({ property, onRequestValuation }) {
  const [showMapToast, setShowMapToast] = useState(false);

  // 🔥 SUPPORT BOTH STRUCTURES
  const lat = property?.lat ?? property?.location?.lat ?? null;
  const lng = property?.lng ?? property?.location?.lng ?? null;

  function handleShowCoords() {
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return;

    setShowMapToast(true);
    setTimeout(() => setShowMapToast(false), 2500);

    window.open(`https://maps.google.com/?q=${lat},${lng}`, "_blank");
  }

  return (
    <div className="bg-white border border-green-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-200 flex flex-col">
      <div className="relative h-44 overflow-hidden">
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-3 right-3">
          <VerificationBadge status={property.verification} />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* ADDRESS */}
        <div className="flex items-start gap-2">
          <svg
            className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3"
            />
          </svg>
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {property.address}
          </p>
        </div>

        {/* COORDS */}
        <CoordBadge lat={lat} lng={lng} onShow={handleShowCoords} />

        <div className="border-t border-green-50" />

        {/* VALUATION */}
        <div className="flex items-center justify-between gap-2">
          {property.valuation ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeWidth={2}
                    d="M12 8c-1.6 0-3 .9-3 2s1.4 2 3 2 3 .9 3 2-1.4 2-3 2"
                  />
                </svg>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Valuation</p>
                <p className="text-sm font-semibold text-emerald-700">
                  {formatLKR(property.valuation)}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeWidth={2} d="M12 8v4m0 4h.01" />
                </svg>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">Valuation</p>
                <p className="text-xs text-gray-500">Not valuated</p>
              </div>
            </div>
          )}

          {/* REQUEST BUTTON */}
          {!property.valuation && property.verification === "verified" && (
            <button
              onClick={() => onRequestValuation(property.id)}
              className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs"
            >
              Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= BADGE =================
function VerificationBadge({ status }) {
  const c = verificationConfig[status] || verificationConfig.pending;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${c.bg} ${c.text} ${c.border}`}
    >
      {c.label}
    </span>
  );
}

// ================= FORMAT =================
function formatLKR(amount) {
  if (!amount) return "LKR 0";
  if (amount >= 1_000_000) return `LKR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `LKR ${(amount / 1_000).toFixed(0)}K`;
  return `LKR ${amount}`;
}

// ================= COORD BADGE =================
function CoordBadge({ lat, lng, onShow }) {
  // 🔥 SAFE CHECK
  if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) {
    return (
      <div className="text-xs text-gray-400 italic">Location not available</div>
    );
  }

  return (
    <button
      onClick={onShow}
      className="flex items-center gap-1 px-2 py-1 rounded bg-teal-50 border text-xs text-teal-700"
    >
      {lat.toFixed(4)}, {lng.toFixed(4)}
    </button>
  );
}

// ================= CONFIG =================
const verificationConfig = {
  verified: {
    label: "Verified",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    border: "border-emerald-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    border: "border-amber-200",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
};
