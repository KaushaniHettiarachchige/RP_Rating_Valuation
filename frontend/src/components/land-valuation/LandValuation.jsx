import data from "../../assets/properties.json";

const MyPropertiesSection = () => {
  const properties = data.properties;

  return (
    <div className="relative container py-12">
      <div className="py-6">
        <HomeTitles txt_1={"Property"} txt_2={"list"}></HomeTitles>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {properties.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </div>
  );
};

export default MyPropertiesSection;
import React from "react";
import {
  LocationOn,
  Straighten,
  Person,
  CheckCircle,
  HourglassEmpty,
  ArrowForwardIos,
} from "@mui/icons-material";
import HomeTitles from "../HomeTItles";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (property.verified) {
      navigate(`/valuate/${property.property_id}`);
    } else {
      alert("Property is still pending verification.");
    }
  };

  return (
    <div className=" bg-white rounded-[24px] border border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden max-h-100">
      <div className="flex justify-between p-4 pb-0 items-center">
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold ">
          Property ID: {property.property_id}
        </p>
        <span
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
            property.verified
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {property.verified ? (
            <CheckCircle sx={{ fontSize: 14 }} />
          ) : (
            <HourglassEmpty sx={{ fontSize: 14 }} />
          )}
          {property.verified ? "Verified" : "Pending"}
        </span>
      </div>

      <div className="p-4 ">
        <div className="flex items-start gap-2 mb-4">
          <LocationOn className="text-emerald-600 " />
          <h3 className="text-mb font-bold text-slate-800 leading-none">
            {property.address}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-slate-600">
            <Straighten fontSize="small" className="text-emerald-500" />
            <p className="text-sm">
              Land Size:{" "}
              <span className="font-medium">{property.landSize}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 text-slate-600">
            <Person fontSize="small" className="text-emerald-500" />
            <p className="text-sm">
              Owner ID: <span className="font-medium">{property.ownerId}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleClick}
          className={`w-full ${property.verified ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-400 hover:bg-gray-400"}   text-white font-bold py-3 px-6 rounded-xl flex items-center justify-between transition-colors group`}
        >
          <span>Proceed to Valuate</span>
          <ArrowForwardIos
            className="group-hover:translate-x-1 transition-transform"
            sx={{ fontSize: 16 }}
          />
        </button>
      </div>
    </div>
  );
};
