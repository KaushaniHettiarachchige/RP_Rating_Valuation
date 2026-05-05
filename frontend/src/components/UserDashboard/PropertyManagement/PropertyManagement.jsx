import { useState } from "react";
import { PropertyCard } from "./PropertyCard";
import { AddPropertySection } from "./AddProperties";

import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  const [openModal, setOpenModal] = useState(false);

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
    <div className="bg-gradient-to-br from-green-50 via-white to-teal-50 p-4 md:p-8 font-sans container">
      <div className="mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
              Property Management
            </h1>
            <p className="text-sm text-gray-400">
              Manage, verify and valuate your properties
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow-sm"
          >
            + Add Property
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            {
              key: "verified",
              label: "Verified",
              color: "text-emerald-600",
              gradient: "from-emerald-500/10 to-emerald-100",
              ring: "ring-emerald-200",
            },
            {
              key: "pending",
              label: "Pending",
              color: "text-amber-600",
              gradient: "from-amber-500/10 to-amber-100",
              ring: "ring-amber-200",
            },
            {
              key: "rejected",
              label: "Rejected",
              color: "text-red-500",
              gradient: "from-red-500/10 to-red-100",
              ring: "ring-red-200",
            },
          ].map((s) => (
            <div
              key={s.key}
              className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${s.gradient} 
                backdrop-blur-md border border-white/40 ring-1 ${s.ring}
                shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <p className={`text-3xl font-semibold ${s.color}`}>
                {counts[s.key]}
              </p>
              <p className="text-xs text-gray-500 mt-1 uppercase">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {["all", "verified", "pending", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium border
                ${
                  filter === f
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-500 border-green-100 hover:border-green-300"
                }`}
            >
              {f}
              <span className="ml-1 text-[10px]">{counts[f]}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            No properties found
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

        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "16px",
              padding: "8px",
            },
          }}
        >
          <DialogTitle className="flex justify-between items-center">
            Add Property
            <IconButton onClick={() => setOpenModal(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <AddPropertySection />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
