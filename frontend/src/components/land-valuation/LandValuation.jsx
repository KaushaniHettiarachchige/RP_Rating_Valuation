import { useState, useEffect } from "react";
import axios from "axios";
import {
  LocationOn,
  Straighten,
  Person,
  CheckCircle,
  HourglassEmpty,
  ArrowForwardIos,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function MyPropertiesSection() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH ALL =================
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:3001/property");

        setProperties(res.data.data || []);
      } catch (err) {
        console.error("Fetch error:", err.message);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ================= UPDATE VERIFICATION =================
  const updateVerification = async (id, status) => {
    try {
      const res = await axios.patch(
        `http://localhost:3001/property/verification/${id}`,
        { verification: status },
      );

      // update UI instantly
      setProperties((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verification: status } : p)),
      );
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading properties...
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h2 className="text-2xl font-bold mb-6">Property List</h2>

      {properties.length === 0 ? (
        <p className="text-gray-400 text-center">No properties found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard
              key={p._id}
              property={p}
              onVerify={updateVerification}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ================= CARD =================
function PropertyCard({ property, onVerify }) {
  const navigate = useNavigate();

  const image =
    property.image ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600";

  const lat = property?.location?.lat;
  const lng = property?.location?.lng;

  const handleProceed = () => {
    navigate(`/valuate/${property._id}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition overflow-hidden">
      {/* IMAGE */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={image}
          alt="property"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 space-y-3">
        {/* TOP */}
        <div className="flex justify-between items-center">
          <p className="text-[10px] uppercase text-gray-400 font-bold">
            ID: {property._id}
          </p>

          <span
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
              property.verification === "verified"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {property.verification === "verified" ? (
              <CheckCircle sx={{ fontSize: 14 }} />
            ) : (
              <HourglassEmpty sx={{ fontSize: 14 }} />
            )}
            {property.verification}
          </span>
        </div>

        {/* ADDRESS */}
        <div className="flex items-start gap-2">
          <LocationOn className="text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            {property.address}
          </h3>
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Straighten className="text-emerald-500" fontSize="small" />
            <span>
              Land Size: <b>{property.landSize || "N/A"}</b>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Person className="text-emerald-500" fontSize="small" />
            <span>
              Owner: <b>{property.nic || property.ownerId}</b>
            </span>
          </div>
        </div>

        {lat && lng && (
          <p className="text-xs text-gray-400">
            {lat.toFixed(4)}, {lng.toFixed(4)}
          </p>
        )}

        {property.verification === "pending" && (
          <button
            onClick={() => onVerify(property._id, "verified")}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-xl font-semibold"
          >
            Verify Property
          </button>
        )}

        {property.verification === "verified" && (
          <button
            onClick={handleProceed}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl font-semibold flex justify-between items-center"
          >
            <span>Proceed to Valuate</span>
            <ArrowForwardIos sx={{ fontSize: 16 }} />
          </button>
        )}
      </div>
    </div>
  );
}
