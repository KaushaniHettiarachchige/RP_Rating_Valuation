import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { AddPropertySection } from "./AddProperties";

const SAMPLE_PROPERTIES = [
  {
    id: 1,
    address: "12 Galle Road, Colombo 03",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80",
    lat: 6.8959,
    lng: 79.8536,
    verification: "verified",
    valuation: null,
    currency: "LKR",
  },
  {
    id: 2,
    address: "47 Duplication Road, Bambalapitiya",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80",
    lat: 6.8812,
    lng: 79.8579,
    verification: "pending",
    valuation: null,
    currency: "LKR",
  },
  {
    id: 3,
    address: "8 Independence Ave, Borella",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80",
    lat: 6.9105,
    lng: 79.8691,
    verification: "rejected",
    valuation: null,
    currency: "LKR",
  },
  {
    id: 4,
    address: "22 Park Street, Colombo 02",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80",
    lat: 6.9195,
    lng: 79.8464,
    verification: "verified",
    valuation: 87000000,
    currency: "LKR",
  },
];

export default function PropertyManagement() {
  const [properties, setProperties] = useState(SAMPLE_PROPERTIES);
  const [valuationRequested, setValuationRequested] = useState([]);
  const [filter, setFilter] = useState("all");

  function handleAdd(data) {
    setProperties((prev) => [...prev, { ...data, id: Date.now() }]);
  }

  function handleRequestValuation(id) {
    setValuationRequested((prev) => [...prev, id]);
  }

  const filtered =
    filter === "all"
      ? properties
      : properties.filter((p) => p.verification === filter);

  const counts = {
    all: properties.length,
    verified: properties.filter((p) => p.verification === "verified").length,
    pending: properties.filter((p) => p.verification === "pending").length,
    rejected: properties.filter((p) => p.verification === "rejected").length,
  };

  return (
    <div className=" bg-gradient-to-br from-green-50 via-white to-teal-50 p-4 md:p-8 font-sans container">
      <div className=" mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Property Management
              </h1>
            </div>
            <p className="text-sm text-gray-400 ml-10">
              Manage, verify and valuate your properties
            </p>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-green-100 rounded-xl shadow-sm">
            <span className="text-2xl font-bold text-green-700">
              {properties.length}
            </span>
            <span className="text-xs text-gray-400 leading-tight">
              Total
              <br />
              Properties
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              key: "verified",
              label: "Verified",
              color: "text-emerald-700",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              key: "pending",
              label: "Pending",
              color: "text-amber-700",
              bg: "bg-amber-50",
              border: "border-amber-100",
            },
            {
              key: "rejected",
              label: "Rejected",
              color: "text-red-600",
              bg: "bg-red-50",
              border: "border-red-100",
            },
          ].map((s) => (
            <div
              key={s.key}
              className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}
            >
              <p className={`text-2xl font-bold ${s.color}`}>{counts[s.key]}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "verified", label: "Verified" },
            { key: "pending", label: "Pending" },
            { key: "rejected", label: "Rejected" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all
                ${
                  filter === f.key
                    ? "bg-green-600 text-white border-green-600 shadow-sm shadow-green-200"
                    : "bg-white text-gray-500 border-green-100 hover:border-green-300 hover:text-green-700"
                }`}
            >
              {f.label}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${filter === f.key ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
              >
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-green-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5"
              />
            </svg>
            <p className="text-sm">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <PropertyCard
                key={p.id}
                property={
                  valuationRequested.includes(p.id)
                    ? { ...p, _valuationRequested: true }
                    : p
                }
                onRequestValuation={handleRequestValuation}
              />
            ))}
          </div>
        )}


        <AddPropertySection onAdd={handleAdd} />
      </div>
    </div>
  );
}
