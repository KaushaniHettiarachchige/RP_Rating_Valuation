import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

// Helper component to update map center
function RecenterMap({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, map.getZoom(), { animate: true });
  }, [coords, map]);
  return null;
}

export default function Map({ address, coordinates, onMarkerChange }) {
  const [coords, setCoords] = useState(coordinates || null);
  const dispatch = useDispatch();
  const markerRef = useRef(null);

  // Update coords if prop changes
  useEffect(() => {
    if (coordinates) {
      setCoords(coordinates);
      dispatch(setCoordinates({ lat: coordinates.lat, lon: coordinates.lng }));
    }
  }, [coordinates, dispatch]);

  // Geocode address if coordinates not provided
  useEffect(() => {
    if (!coordinates && address) {
      let isMounted = true;

      const geocode = async () => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              address,
            )}`,
          );
          const data = await res.json();
          if (isMounted && data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            setCoords({ lat, lng: lon });
            dispatch(setCoordinates({ lat, lon }));
            if (onMarkerChange) onMarkerChange({ lat, lng: lon });
          }
        } catch (err) {
          console.error(err);
        }
      };

      geocode();

      return () => {
        isMounted = false;
      };
    }
  }, [address, coordinates, dispatch, onMarkerChange]);

  // Handle drag end of marker
  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const latLng = marker.getLatLng();
      setCoords({ lat: latLng.lat, lng: latLng.lng });
      dispatch(setCoordinates({ lat: latLng.lat, lon: latLng.lng }));
      if (onMarkerChange) onMarkerChange({ lat: latLng.lat, lng: latLng.lng });
    }
  };

  return coords ? (
    <MapContainer
      center={coords}
      zoom={16}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <RecenterMap coords={coords} />
      <Marker
        position={coords}
        draggable={true}
        eventHandlers={{ dragend: handleDragEnd }}
        ref={markerRef}
      >
        <Popup>{address || `Lat: ${coords.lat}, Lng: ${coords.lng}`}</Popup>
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
      Enter a valid address or coordinates to see the map.
    </div>
  );
}
