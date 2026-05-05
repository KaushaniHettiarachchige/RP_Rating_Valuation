import { useState } from "react";

export function PropertyCard({ property, onRequestValuation }) {
  
  const [showMapToast, setShowMapToast] = useState(false);

  function handleShowCoords() {
    setShowMapToast(true);
    setTimeout(() => setShowMapToast(false), 2500);
    window.open(
      `https://maps.google.com/?q=${property.lat},${property.lng}`,
      "_blank",
    );
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {property.address}
          </p>
        </div>

        <CoordBadge
          lat={property.lat}
          lng={property.lng}
          onShow={handleShowCoords}
        />

        <div className="border-t border-green-50" />

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
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-0.5">
                  Valuation
                </p>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 leading-none mb-0.5">
                  Valuation
                </p>
                <p className="text-xs text-gray-500">Not valuated</p>
              </div>
            </div>
          )}

         {!property.valuation && property.verification === "verified" && (
  <button
    onClick={() => onRequestValuation(property.id)}
    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 active:scale-95 text-white text-xs font-medium transition-all"
  >
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
    Request
  </button>
)}
        </div>
      </div>
    </div>
  );
}

function VerificationBadge({ status }) {
  const c = verificationConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function formatLKR(amount) {
  if (amount >= 1_000_000) return `LKR ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `LKR ${(amount / 1_000).toFixed(0)}K`;
  return `LKR ${amount}`;
}

function CoordBadge({ lat, lng, onShow }) {
  return (
    <button
      onClick={onShow}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 hover:bg-teal-100 transition-colors group text-xs font-mono text-teal-700"
    >
      <svg
        className="w-3.5 h-3.5 text-teal-500 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
      <span>
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </span>
      <svg
        className="w-3 h-3 text-teal-400 group-hover:text-teal-600 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </button>
  );
}

const verificationConfig = {
  verified: {
    label: "Verified",
    bg: "bg-emerald-100",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-100",
    text: "text-amber-800",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-700",
    dot: "bg-red-400",
    border: "border-red-200",
  },
};
