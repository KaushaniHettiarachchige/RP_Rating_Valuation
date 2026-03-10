import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useDispatch } from "react-redux";
import { setCoordinates } from "../../store/slices/appSlice";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({ address }) {
  const [coords, setCoords] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!address) {
      // Delay clearing the map state to avoid sync setState in effect
      const timeout = setTimeout(() => setCoords(null), 0);
      return () => clearTimeout(timeout);
    }

    let isMounted = true;

    const geocode = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            address
          )}`
        );
        const data = await res.json();
        if (isMounted && data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          // Async setState after fetch completes
          setCoords({
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          });
          dispatch(setCoordinates({ lat, lon }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    // Call async function with small delay to prevent sync setState
    const timeout = setTimeout(() => geocode(), 0);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [address]);

  return coords ? (
    <MapContainer
      center={coords}
      zoom={16}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={coords}>
        <Popup>{address}</Popup>
      </Marker>
    </MapContainer>
  ) : (
    <div
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#666",
      }}
    >
      Enter a valid address to see the map.
    </div>
  );
}
