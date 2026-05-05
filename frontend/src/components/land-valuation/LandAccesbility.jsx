import { useState } from "react";
import Map from "../common/Map";
import LandPlacesDropdown from "./LandPlaces";

const LandAcsessbility = ({ property, places,features }) => {
  const [coordinates] = useState({
    lat: property.latitude,
    lng: property.longitude,
  });

  const [markerPos, setMarkerPos] = useState(null);

  return (
    <div className="grid grid-cols-[3fr_2fr] items-center justify-center gap-4 relative">
      <div className="w-full h-[450px] overflow-hidden shadow-md/15 rounded-[20px]">
        <Map
          coordinates={coordinates}
          places={places || {}}
          onMarkerChange={(newPos) => {
            console.log("Marker moved to:", newPos);
            setMarkerPos(newPos);
          }}
        />
      </div>

      {markerPos && (
        <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-sm">
          Selected Position: Lat {markerPos.lat}, Lng {markerPos.lng}
        </div>
      )}

      <div className="grid grid-cols-1 rounded-[20px] bg-emerald-100 w-full max-h-[450px] overflow-auto">
        <LandPlacesDropdown places={places} features={features}/>
      </div>
    </div>
  );
};

export default LandAcsessbility;
