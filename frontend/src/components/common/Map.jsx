import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { setCoordinates } from "../../store/slices/appSlice";
import {
  Public,
  School,
  AccountBalance,
  LocalGasStation,
  LocalHospital,
  LocalGroceryStore,
  SchoolOutlined,
  Train,
} from "@mui/icons-material";
/* ================= FIX DEFAULT ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= ICONS ================= */
const icons = {
  schools: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
    iconSize: [30, 30],
  }),
  banks: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2830/2830284.png",
    iconSize: [30, 30],
  }),
  fuel_stations: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/481/481857.png",
    iconSize: [30, 30],
  }),
  hospitals: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png",
    iconSize: [30, 30],
  }),
  supermarkets: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3082/3082011.png",
    iconSize: [30, 30],
  }),
  universities: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/3135/3135755.png",
    iconSize: [30, 30],
  }),
  railway_stations: new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/1042/1042339.png",
    iconSize: [30, 30],
  }),
};

/* ================= RECENTER MAP ================= */
function RecenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom(), { animate: true });
    }
  }, [coords, map]);

  return null;
}


export default function Map({ coordinates, onMarkerChange, places }) {
  const dispatch = useDispatch();
  const markerRef = useRef(null);

  const [coords, setCoords] = useState(
    coordinates || { lat: 6.795995, lng: 79.9002 },
  );

  const [activeTab, setActiveTab] = useState("all");

  
  useEffect(() => {
    if (coordinates) {
      setCoords(coordinates);

      dispatch(
        setCoordinates({
          lat: coordinates.lat,
          lon: coordinates.lng,
        }),
      );
    }
  }, [coordinates, dispatch]);

  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (!marker) return;

    const pos = marker.getLatLng();

    const newCoords = {
      lat: pos.lat,
      lng: pos.lng,
    };

    setCoords(newCoords);

    dispatch(setCoordinates({ lat: pos.lat, lon: pos.lng }));

    onMarkerChange?.(newCoords);
  };

  const isVisible = (type) => activeTab === "all" || activeTab === type;

  const groupedPlaces = places || {};

  return (
    <div className="relative w-full h-full grid-cols-1 overflow-visible">
      <div className="absolute top-2 right-2 bg-white p-2 rounded shadow z-[999] text-xs">
        <div className="font-bold mb-1">Legend</div>
        <div>🏫 Schools</div>
        <div>🏦 Banks</div>
        <div>⛽ Fuel</div>
        <div>🏥 Hospitals</div>
        <div>🛒 Supermarkets</div>
        <div>🎓 Universities</div>
        <div>🚆 Railway</div>
      </div>

      <MapContainer
        center={coords}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <RecenterMap coords={coords} />

        <Marker
          position={coords}
          draggable={true}
          eventHandlers={{ dragend: handleDragEnd }}
          ref={markerRef}
        >
          <Popup>Main Location</Popup>
        </Marker>

        {isVisible("schools") &&
          groupedPlaces.schools?.map((p, i) => (
            <Marker
              key={`school-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.schools}
            >
              <Popup>🏫 {p.name}</Popup>
            </Marker>
          ))}

        {isVisible("banks") &&
          groupedPlaces.banks?.map((p, i) => (
            <Marker
              key={`bank-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.banks}
            >
              <Popup>🏦 {p.name}</Popup>
            </Marker>
          ))}

        {isVisible("fuel_stations") &&
          groupedPlaces.fuel_stations?.map((p, i) => (
            <Marker
              key={`fuel-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.fuel_stations}
            >
              <Popup>⛽ {p.name}</Popup>
            </Marker>
          ))}

        {isVisible("hospitals") &&
          groupedPlaces.hospitals?.map((p, i) => (
            <Marker
              key={`hospital-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.hospitals}
            >
              <Popup>
                🏥 {p.name} <br />
                {p.distance_km} km
              </Popup>
            </Marker>
          ))}

        {isVisible("supermarkets") &&
          groupedPlaces.supermarkets?.map((p, i) => (
            <Marker
              key={`market-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.supermarkets}
            >
              <Popup>🛒 {p.name}</Popup>
            </Marker>
          ))}

        {isVisible("universities") &&
          groupedPlaces.universities?.map((p, i) => (
            <Marker
              key={`uni-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.universities}
            >
              <Popup>🎓 {p.name}</Popup>
            </Marker>
          ))}

        {isVisible("railway_stations") &&
          groupedPlaces.railway_stations?.map((p, i) => (
            <Marker
              key={`rail-${i}`}
              position={[p.lat, p.lon]}
              icon={icons.railway_stations}
            >
              <Popup>🚆 {p.name}</Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2  w-full bg-green-500/20 backdrop-blur-sm shadow-2xl border border-green-100 flex-row  flex justify-start gap-4 items-center p-2 z-[999]">
        {[
          { id: "all", label: "All", icon: <Public fontSize="small" /> },
          {
            id: "schools",
            label: "Schools",
            icon: <School fontSize="small" />,
          },
          {
            id: "banks",
            label: "Banks",
            icon: <AccountBalance fontSize="small" />,
          },
          {
            id: "fuel_stations",
            label: "Fuel",
            icon: <LocalGasStation fontSize="small" />,
          },
          {
            id: "hospitals",
            label: "Hospitals",
            icon: <LocalHospital fontSize="small" />,
          },
          {
            id: "supermarkets",
            label: "Market",
            icon: <LocalGroceryStore fontSize="small" />,
          },
          {
            id: "universities",
            label: "Uni",
            icon: <SchoolOutlined fontSize="small" />,
          },
          {
            id: "railway_stations",
            label: "Rail",
            icon: <Train fontSize="small" />,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center w-fit py-2 px-4 transition-all duration-300 rounded-2xl ${
              activeTab === tab.id
                ? "text-white scale-110"
                : "text-green-800 hover:text-green-600 hover:bg-green-50 bg-emerald-100 "
            }`}
          >
            {activeTab === tab.id && (
              <span className="absolute inset-0 bg-green-800 rounded-2xl -z-10 animate-in fade-in zoom-in duration-200" />
            )}

            <div
              className={activeTab === tab.id ? "text-white" : "inherit"}
            >
              {tab.icon}
            </div>

            <span className="text-[10px] mt-1 font-semibold tracking-tight">
              {tab.label}
            </span>

          
            {activeTab === tab.id && (
              <span className="w-1 h-1 bg-white rounded-full mt-0.5" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
