import { useState } from "react";

/* ================= MUI ICONS ================= */
import SchoolIcon from "@mui/icons-material/School";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrainIcon from "@mui/icons-material/Train";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import StraightenIcon from "@mui/icons-material/Straighten";

const LandPlacesDropdown = ({ places, features }) => {
  const [open, setOpen] = useState(null);
  const [showFeatures, setShowFeatures] = useState(false);

  const toggle = (key) => {
    setOpen(open === key ? null : key);
  };

  const data = places || {};
  const f = features || {};

  const sections = [
    { key: "schools", label: "Schools", icon: <SchoolIcon fontSize="small" /> },
    { key: "banks", label: "Banks", icon: <AccountBalanceIcon fontSize="small" /> },
    { key: "fuel_stations", label: "Fuel Stations", icon: <LocalGasStationIcon fontSize="small" /> },
    { key: "hospitals", label: "Hospitals", icon: <LocalHospitalIcon fontSize="small" /> },
    { key: "supermarkets", label: "Supermarkets", icon: <ShoppingCartIcon fontSize="small" /> },
    { key: "universities", label: "Universities", icon: <SchoolOutlinedIcon fontSize="small" /> },
    { key: "railway_stations", label: "Railway Stations", icon: <TrainIcon fontSize="small" /> },
  ];

  return (
    <div className="grid grid-cols-1 rounded-[20px] bg-emerald-100 w-full self-stretch p-3 gap-2">

      <h2 className="font-bold text-sm mb-2 flex items-center gap-2">
        <AnalyticsIcon fontSize="small" />
        Land Analysis
      </h2>

      {/* ================= FEATURES ================= */}
      <div className="bg-white rounded-lg shadow-sm">

        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className="w-full flex justify-between items-center p-2 font-medium"
        >
          <div className="flex items-center gap-2">
            <AnalyticsIcon fontSize="small" />
            Features
          </div>

          {showFeatures ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </button>

      {showFeatures && (
  <div className="px-3 pb-3 text-xs space-y-2">

    <div className="grid grid-cols-2 gap-2">

      {/* Schools */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <SchoolIcon fontSize="small" />
        Schools: {f.count_schools}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min School: {f.min_dist_school?.toFixed(2)} km
      </div>

      {/* Universities */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <SchoolOutlinedIcon fontSize="small" />
        Universities: {f.count_uni}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min Uni: {f.min_dist_uni?.toFixed(2)} km
      </div>

      {/* Banks */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <AccountBalanceIcon fontSize="small" />
        Banks (2km): {f.count_banks_within_2km}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min Bank: {f.min_dist_nearest_bank?.toFixed(2)} km
      </div>

      {/* Fuel */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <LocalGasStationIcon fontSize="small" />
        Fuel (2km): {f.count_Fuel_Stations_within2km}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min Fuel: {f.min_dist_nearest_Fuel_station?.toFixed(2)} km
      </div>

      {/* Supermarkets */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <ShoppingCartIcon fontSize="small" />
        Supermarkets (2km): {f.count_Supermarkets_within2km}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min Market: {f.min_dist_nearest_Supermarket?.toFixed(2)} km
      </div>

      {/* Medical */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <LocalHospitalIcon fontSize="small" />
        Medical Centers: {f.count_medical_centers}
      </div>

      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <StraightenIcon fontSize="small" />
        Min Medical: {f.min_dist_medical_center?.toFixed(2)} km
      </div>

      {/* Railway */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <TrainIcon fontSize="small" />
        Railway: {f.min_dist_nearest_railway?.toFixed(2)} km
      </div>

      {/* Express */}
      <div className="p-2 bg-gray-50 rounded flex items-center gap-2">
        <TrainIcon fontSize="small" />
        Express: {f.min_dist_nearest_express?.toFixed(2)} km
      </div>

    </div>

    {/* EXTRA IMPORTANT METRIC */}
    <div className="p-2 bg-blue-50 rounded text-blue-700 flex items-center gap-2">
      <LocationOnIcon fontSize="small" />
      Distance to Fort: {f.distance_to_fort_km?.toFixed(2)} km
    </div>

  </div>
)}
      </div>

   
      {sections.map((sec) => (
        <div key={sec.key} className="bg-white rounded-lg shadow-sm">

          <button
            onClick={() => toggle(sec.key)}
            className="w-full flex justify-between items-center p-2 text-left font-medium"
          >
            <div className="flex items-center gap-2">
              {sec.icon}
              {sec.label}
            </div>

            {open === sec.key ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </button>

          {open === sec.key && (
            <div className="px-3 pb-2 max-h-40 overflow-y-auto text-sm">

              {data[sec.key]?.length > 0 ? (
                data[sec.key].map((item, i) => (
                  <div key={i} className="border-b py-1 last:border-none">
                    <div className="font-medium flex items-center gap-2">
                      {sec.icon}
                      {item.name}
                    </div>

                    {item.distance_km && (
                      <div className="text-xs text-gray-500 ml-6">
                        {item.distance_km} km away
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-400 py-1">
                  No data available
                </div>
              )}

            </div>
          )}

        </div>
      ))}
    </div>
  );
};

export default LandPlacesDropdown;