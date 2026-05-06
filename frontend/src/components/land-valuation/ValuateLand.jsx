import { useParams } from "react-router-dom";
import HomeTitles from "../HomeTItles";
import { BarChart, Landscape } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LandAcsessbility from "./LandAccesbility";
import axios from "axios";

// ================= MAIN COMPONENT =================
const ValuateLand = () => {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  console.log("🚀 ~ ValuateLand ~ property:", property);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [accessbilityDone, setAccessbilityDone] = useState(false);
  const [estimationDone, setEstimationDone] = useState(false);

  const [accessApiData, setAccessApiData] = useState(null);
  const [estimateApiData, setEstimateApiData] = useState(null);

  const [estLoading, setEstLoading] = useState(false);
  const [accLoading, setAccLoading] = useState(false);

  // ================= FETCH PROPERTY =================
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`http://localhost:3001/property/${id}`);

        setProperty(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProperty();
  }, [id]);

  // ================= ACCESSIBILITY =================
  const handleCalculate = async (e) => {
    e.preventDefault();
    setAccLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/public/find",
        {
          latitude: parseFloat(property.location.lat),
          longitude: parseFloat(property.location.lng),
          land_size: parseFloat(property.landSize),
        },
        { headers: { "Content-Type": "application/json" } },
      );
      setAccessApiData(res.data);
      setAccLoading(false);
      setAccessbilityDone(true);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Backend rejected request");
    }
  };
  const handleEstimate = async (e) => {
    e.preventDefault();
    setEstLoading(true);

    try {
      // ================= 1. ESTIMATE REQUEST =================
      const res = await axios.post(
        "http://127.0.0.1:8000/public/estimate",
        {
          latitude: parseFloat(property.location.lat),
          longitude: parseFloat(property.location.lng),
          land_size: parseFloat(property.landSize),
        },
        { headers: { "Content-Type": "application/json" } },
      );

      setEstimateApiData(res.data);

      const estimatedValue = res.data?.total_price;

      // ================= 2. UPDATE VALUATION (PATCH) =================
      if (estimatedValue) {
        await axios.patch(
          `http://localhost:3001/property/valuation/${property._id}`,
          {
            valuation: estimatedValue,
          },
          { headers: { "Content-Type": "application/json" } },
        );
      }

      setEstimationDone(true);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Backend rejected request");
    } finally {
      setEstLoading(false);
    }
  };
  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-gray-500 font-semibold">
        Loading property...
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return <div className="p-10 text-red-500 font-semibold">{error}</div>;
  }

  // ================= NOT FOUND =================
  if (!property) {
    return (
      <div className="p-10 text-red-500 font-semibold">Property not found</div>
    );
  }

  return (
    <div className="w-full container mx-auto px-4 py-6 grid grid-cols-1 gap-4">
      <HomeTitles txt_1="Valuate" txt_2="Property" txt_3="" />

      <ValuateDetails
        property={property}
        handleCalculate={handleCalculate}
        accessbilityDone={accessbilityDone}
        handleEstimate={handleEstimate}
        estimateApiData={estimateApiData}
        isCalculating={accLoading}
        isEstimating={estLoading}
        estimationDone={estimationDone}
      />

      {accessApiData && (
        <LandAcsessbility
          property={property}
          places={accessApiData.places}
          features={accessApiData.features}
        />
      )}
    </div>
  );
};

export default ValuateLand;

const SAMPLE_IMAGE =
  "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80";

// ================= DETAILS COMPONENT =================
const ValuateDetails = ({
  property,
  handleCalculate,
  accessbilityDone,
  handleEstimate,
  estimateApiData,
  isCalculating,
  isEstimating,
  estimationDone,
}) => {
  return (
    <div className="relative group overflow-hidden bg-white border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md transition-all flex">
      {/* ================= IMAGE ================= */}
      <div className="relative w-36 shrink-0 bg-emerald-50">
        <img
          src={property.images?.[0] || SAMPLE_IMAGE}
          alt={property.address}
          className="w-full h-full object-cover"
        />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-6 flex-1">
        {/* LEFT */}
        <div className="flex items-center gap-4 border-r border-emerald-100 pr-6">
          <div className="px-3 py-1.5 bg-emerald-50 rounded-xl">
            <span className="text-[10px] font-bold text-emerald-500">ID</span>
            <p className="text-sm font-mono">#{property.property_id}</p>
          </div>

          <div>
            <p className="text-[10px] text-emerald-500 font-bold">Location</p>
            <h2 className="text-lg font-semibold">{property.address}</h2>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="flex flex-1 items-center gap-8">
          <div>
            <p className="text-[10px] text-emerald-500 font-bold">User ID</p>
            <span className="font-mono">#{property.ownerId}</span>
          </div>

          <div>
            <p className="text-[10px] text-emerald-500 font-bold">Land Size</p>
            <span className="font-semibold">{property.landSize} Perches</span>
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">
          {/* STATUS */}
          <div
            className={`px-3 py-1 text-[10px] font-bold rounded-xl border ${
              property.verified
                ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                : "bg-amber-50 text-amber-600 border-amber-200"
            }`}
          >
            {property.verified ? "VERIFIED" : "PENDING"}
          </div>

          {/* ESTIMATE */}
          {accessbilityDone && !estimateApiData && (
            <button
              onClick={handleEstimate}
              disabled={isEstimating}
              className="px-4 py-2 bg-blue-500 text-white rounded-xl"
            >
              {isEstimating ? "Estimating..." : "Estimate Value"}
            </button>
          )}

          {/* RESULT */}
          {estimateApiData && (
            <div>
              <p className="text-[10px] text-emerald-500 font-bold">
                Land Value
              </p>
              <p className="font-bold">
                {estimateApiData.total_price?.toLocaleString("en-LK", {
                  style: "currency",
                  currency: "LKR",
                })}
              </p>
            </div>
          )}

          {/* ACCESSIBILITY */}
          {!accessbilityDone && (
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="px-4 py-2 bg-amber-500 text-white rounded-xl"
            >
              {isCalculating ? "Calculating..." : "Check Access"}
            </button>
          )}
        </div>
      </div>

      {/* ================= NEXT STEP ================= */}
      {estimationDone && (
        <div className="p-4">
          <a
            href="/valuate-building"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg"
          >
            Valuate Building
          </a>
        </div>
      )}
    </div>
  );
};
