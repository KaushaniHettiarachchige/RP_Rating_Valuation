import { useParams } from "react-router-dom";
import data from "../../assets/properties.json";
import HomeTitles from "../HomeTItles";
import {
  ArrowRight,
  BarChart,
  Landscape,
  OtherHouses,
  Roofing,
} from "@mui/icons-material";
import { useState } from "react";
import LandAcsessbility from "./LandAccesbility";
import axios from "axios";

const ValuateLand = () => {
  const { id } = useParams();
  const propertyId = Number(id);
  const [valuateOn, setValuateOn] = useState(false);
  const [accessbilityDone, setAccessbilityDone] = useState(false);
  const [estimationDone, setEstimationDone] = useState(false);
  const property = data.properties.find(
    (item) => item.property_id === propertyId,
  );

  if (!property) {
    return (
      <div className="p-10 text-red-500 font-semibold">Property not found</div>
    );
  }

  const [accessApiData, setAccessApiData] = useState(null);
  const [estimateApiData, setEstimateApiData] = useState(null);

  const [estLoading, setEstLoading] = useState(false);
  const [accLoading, setAccLoading] = useState(false);
  const handleCalculate = async (e) => {
    e.preventDefault();
    setAccLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/public/find",
        {
          latitude: parseFloat(property.latitude),
          longitude: parseFloat(property.longitude),
          land_size: parseFloat(property.landSize),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
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
      const res = await axios.post(
        "http://127.0.0.1:8000/public/estimate",
        {
          latitude: parseFloat(property.latitude),
          longitude: parseFloat(property.longitude),
          land_size: parseFloat(property.landSize),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setEstimateApiData(res.data);

      setEstLoading(false);
      setEstimationDone(true);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Backend rejected request");
    }
  };

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
    <div className="relative group overflow-hidden bg-white border border-emerald-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex">
      {/* Property Image — full height left panel */}
      <div className="relative w-36 shrink-0 overflow-hidden rounded-l-2xl bg-emerald-50">
        {(property.images?.[0] ?? SAMPLE_IMAGE) ? (
          <img
            src={property.images?.[0] ?? SAMPLE_IMAGE}
            alt={property.address}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-emerald-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 21h19.5M3.75 21V8.25l8.25-6 8.25 6V21M9 21v-6h6v6"
              />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-300 tracking-wider uppercase">
              No Image
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Card Content */}
      <div className="flex flex-wrap items-center justify-between px-6 py-4 gap-6 flex-1">
        {/* Left — ID + Address */}
        <div className="flex items-center gap-4 border-r border-emerald-100 pr-6">
          <div className="px-3 py-1.5 bg-emerald-50 rounded-xl flex items-center gap-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              ID
            </span>
            <span className="text-sm font-bold font-mono text-slate-600">
              #{property.property_id}
            </span>
          </div>
          <div>
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-0.5">
              Property Location
            </p>
            <h2 className="text-lg font-semibold text-slate-800 leading-snug">
              {property.address}
            </h2>
          </div>
        </div>

        {/* Middle — User ID + Land Area */}
        <div className="flex flex-1 items-center gap-8">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              User ID
            </span>
            <span className="text-sm font-bold font-mono text-slate-600">
              #{property.ownerId}
            </span>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              Land Area
            </span>
            <span className="text-base font-bold text-slate-800">
              {property.landSize}{" "}
              <span className="text-xs font-medium text-slate-400">
                Perches
              </span>
            </span>
          </div>
        </div>

        {/* Right — Status + Actions */}
        <div className="flex items-center gap-4">
          {/* Verified badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-widest border transition-all ${
              property.verified
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${property.verified ? "bg-emerald-500" : "bg-amber-400"}`}
            />
            {property.verified ? "VERIFIED" : "PENDING"}
          </div>

          {/* Estimate button or Land Value display */}
          {accessbilityDone && !estimateApiData ? (
            <button
              onClick={handleEstimate}
              disabled={isEstimating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-blue-200 hover:brightness-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isEstimating ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Estimating…</span>
                </>
              ) : (
                <>
                  <Landscape className="w-4 h-4" />
                  <span>Estimate Land Value</span>
                </>
              )}
            </button>
          ) : estimateApiData ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                Land Value
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-800">
                  {estimateApiData?.total_price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "LKR",
                  })}
                </span>
                <span className="text-xs text-slate-400">for Land</span>
              </div>
            </div>
          ) : null}

          {/* Accessibility button */}
          {!accessbilityDone && (
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-200 hover:brightness-105 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isCalculating ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Calculating…</span>
                </>
              ) : (
                <>
                  <BarChart className="w-4 h-4" />
                  <span>Find Accessibility</span>
                </>
              )}
            </button>
          )}
        </div>
        {estimationDone && (
          <div>
            <a
              href="/valuate-building"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                backgroundColor: "#25ebe1",
                color: "#00001c",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "15px",
                transition: "background-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#1d4ed8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Valuate Building
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
