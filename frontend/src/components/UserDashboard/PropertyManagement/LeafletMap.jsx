import { useEffect, useRef, useState } from "react";

function LeafletMap({ lat, lng, onChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    const loadLeaflet = () => {
      if (window.L) {
        initMap();
        return;
      }
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const defaultLat = lat || 6.9271;
      const defaultLng = lng || 79.8612;

      const map = window.L.map(mapRef.current).setView(
        [defaultLat, defaultLng],
        13,
      );
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const icon = window.L.divIcon({
        className: "",
        html: `<div style="width:28px;height:28px;background:#16a34a;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        iconAnchor: [14, 28],
      });

      const marker = window.L.marker([defaultLat, defaultLng], {
        draggable: true,
        icon,
      }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;
      setLoaded(true);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(pos.lat.toFixed(6), pos.lng.toFixed(6));
      });

      map.on("click", (e) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6));
      });
    };

    loadLeaflet();
  }, []);

  useEffect(() => {
    if (markerRef.current && lat && lng) {
      markerRef.current.setLatLng([parseFloat(lat), parseFloat(lng)]);
      mapInstanceRef.current?.setView([parseFloat(lat), parseFloat(lng)], 13);
    }
  }, [lat, lng]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--color-border-tertiary)",
      }}
    >
      <div ref={mapRef} style={{ height: 280, width: "100%" }} />
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--color-background-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
            Loading map…
          </span>
        </div>
      )}
    </div>
  );
}

export default LeafletMap;
