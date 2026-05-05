import { useState } from "react";

export function AddPropertySection({ onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.lat || isNaN(Number(form.lat))) e.lat = "Valid latitude required";
    if (!form.lng || isNaN(Number(form.lng))) e.lng = "Valid longitude required";
    return e;
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    onAdd({
      address: form.address,
      lat: parseFloat(form.lat),
      lng: parseFloat(form.lng),
      image: form.image || "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80",
      verification: "pending",
      valuation: null,
      currency: "LKR",
    });
    setForm(EMPTY_FORM);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }


  return (
    <div className="bg-white border border-green-100 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-base font-semibold text-gray-900">Add New Property</h2>
          <p className="text-xs text-gray-400">Submitted properties start as pending review</p>
        </div>
      </div>

      {submitted && (
        <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Property added successfully and is pending verification.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Property Address <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. 15 Flower Road, Colombo 07"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-300 outline-none transition-all
              ${errors.address ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-green-200 bg-green-50/40 focus:border-green-400 focus:ring-2 focus:ring-green-100"}`}
          />
          {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Latitude <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 6.9271"
            value={form.lat}
            onChange={(e) => handleChange("lat", e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-300 outline-none transition-all
              ${errors.lat ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-green-200 bg-green-50/40 focus:border-green-400 focus:ring-2 focus:ring-green-100"}`}
          />
          {errors.lat && <p className="mt-1 text-xs text-red-500">{errors.lat}</p>}
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Longitude <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 79.8612"
            value={form.lng}
            onChange={(e) => handleChange("lng", e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder-gray-300 outline-none transition-all
              ${errors.lng ? "border-red-300 bg-red-50 focus:ring-2 focus:ring-red-100" : "border-green-200 bg-green-50/40 focus:border-green-400 focus:ring-2 focus:ring-green-100"}`}
          />
          {errors.lng && <p className="mt-1 text-xs text-red-500">{errors.lng}</p>}
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1.5">
            Image URL <span className="text-gray-300">(optional)</span>
          </label>
          <input
            type="url"
            placeholder="https://..."
            value={form.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-green-200 bg-green-50/40 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all"
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          <span className="text-red-400">*</span> Required fields
        </p>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 active:scale-95 text-white text-sm font-medium shadow-sm shadow-green-200 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Property
        </button>
      </div>
    </div>
  );
}


  const EMPTY_FORM = {
    address: "",
    lat: "",
    lng: "",
    image: "",
  };
  