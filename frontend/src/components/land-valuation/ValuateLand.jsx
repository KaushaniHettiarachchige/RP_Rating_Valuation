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

  const [loading, setLoading] = useState(false);
  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      setLoading(false);
      setAccessbilityDone(true);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Backend rejected request");
    }
  };

  const handleEstimate = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      setLoading(false);
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

const ValuateDetails = ({
  property,
  handleCalculate,
  accessbilityDone,
  handleEstimate,
  estimateApiData,
}) => {
  return (
    <div className="relative group overflow-hidden bg-white border-2 border-emerald-100 rounded-3xl shadow-md hover:shadow-xl hover:border-emerald-200 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between p-5 md:p-6 gap-8">
        <div className="flex items-center gap-5 border-r-2 border-emerald-50 pr-8">
          <div className="  p-3 bg-emerald-100/50 rounded-2xl gap-2 flex flex-row items-center  ">
            <span className="text-xs font-bold text-emerald-700/60 uppercase tracking-wider ">
              ID
            </span>
            <span className="text-base font-bold font-mono text-slate-600">
              #{property.property_id}
            </span>
          </div>
          <div>
            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-1">
              Property Location
            </p>
            <h2 className="text-xl font-bold text-slate-800 leading-tight">
              {property.address}
            </h2>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-around md:justify-start gap-10">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-700/60 uppercase tracking-wider">
              User ID
            </span>
            <span className="text-base font-bold font-mono text-slate-600">
              #{property.ownerId}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-700/60 uppercase tracking-wider">
              Land Area
            </span>
            <span className="text-lg font-extrabold text-slate-800">
              {property.landSize}{" "}
              <span className="text-sm font-medium text-slate-400">
                Perches
              </span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-2 px-5 py-2 rounded-2xl text-xs font-black tracking-widest border-2 transition-all ${
              property.verified
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-amber-50 text-amber-700 border-amber-100"
            }`}
          >
            {property.verified ? "VERIFIED" : "PENDING"}
          </div>

          {accessbilityDone && !estimateApiData ? (
            <button
              onClick={handleEstimate}
              className="flex gap-2 leading-none flex-row items-center justify-center bg-gradient-to-r from-blue-600 to-blue-400 font-bold  text-white rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-95 "
            >
              <span>Estimate Land Value </span>
              <Landscape />
            </button>
          ) : (


<div className="flex flex-col w-fit ">
              <span className="text-[16px] font-bold text-emerald-700/60 uppercase tracking-wider">
                Land Value
              </span>
              <div className="flex flex-row items-center justify-start gap-2">

<span className="text-lg font-extrabold text-slate-800">
                {estimateApiData?.total_price?.toLocaleString("en-US", {
  style: "currency",
  currency: "LKR",
})}
              
              </span>
                <span className="text-sm font-medium text-slate-400">
                  for Land
                </span>
              </div>
              
            </div>

           
          )}

          
            {!accessbilityDone &&  <button
              onClick={handleCalculate}
              className="flex gap-2 leading-none flex-row items-center justify-center bg-gradient-to-r from-yellow-600 to-yellow-400 font-bold  text-white rounded-2xl shadow-lg shadow-yellow-100 transition-all active:scale-95 "
            >
              <span>Find Accessbility </span>
              <BarChart />
            </button>}
         
        </div>
      </div>
    </div>
  );
};
