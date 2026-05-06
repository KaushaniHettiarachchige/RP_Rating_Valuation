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
import PinDropIcon from "@mui/icons-material/PinDrop";

const PALETTE = {
  schools: { bg: "#EAF3DE", color: "#3B6D11" },
  banks: { bg: "#E6F1FB", color: "#185FA5" },
  fuel_stations: { bg: "#FAEEDA", color: "#854F0B" },
  hospitals: { bg: "#FCEBEB", color: "#A32D2D" },
  supermarkets: { bg: "#EEEDFE", color: "#534AB7" },
  universities: { bg: "#E1F5EE", color: "#0F6E56" },
  railway_stations: { bg: "#F1EFE8", color: "#5F5E5A" },
  features: { bg: "#E6F1FB", color: "#185FA5" },
};

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
    {
      key: "banks",
      label: "Banks",
      icon: <AccountBalanceIcon fontSize="small" />,
    },
    {
      key: "fuel_stations",
      label: "Fuel Stations",
      icon: <LocalGasStationIcon fontSize="small" />,
    },
    {
      key: "hospitals",
      label: "Hospitals",
      icon: <LocalHospitalIcon fontSize="small" />,
    },
    {
      key: "supermarkets",
      label: "Supermarkets",
      icon: <ShoppingCartIcon fontSize="small" />,
    },
    {
      key: "universities",
      label: "Universities",
      icon: <SchoolOutlinedIcon fontSize="small" />,
    },
    {
      key: "railway_stations",
      label: "Railway Stations",
      icon: <TrainIcon fontSize="small" />,
    },
  ];

  const cardStyle = {
    background: "#fff",
    border: "0.5px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
  };

  const btnStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 500,
    color: "#111",
    textAlign: "left",
  };

  const iconBadge = (category) => {
    const { bg, color } = PALETTE[category] ?? {
      bg: "#F1EFE8",
      color: "#5F5E5A",
    };
    return {
      width: 32,
      height: 32,
      borderRadius: 8,
      background: bg,
      color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    };
  };

  const statPill = {
    background: "#f9fafb",
    border: "0.5px solid #e5e7eb",
    borderRadius: 8,
    padding: "9px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
        fontFamily: "'Geist', 'Inter', sans-serif",
        padding: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 2px 8px",
        }}
      >
        <AnalyticsIcon style={{ fontSize: 20, color: "#374151" }} />
        <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
          Land Analysis
        </span>
      </div>

      <div style={cardStyle}>
        <button onClick={() => setShowFeatures(!showFeatures)} style={btnStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={iconBadge("features")}>
              <AnalyticsIcon fontSize="small" />
            </span>
            Features
          </div>
          {showFeatures ? (
            <ExpandLessIcon style={{ color: "#9ca3af" }} />
          ) : (
            <ExpandMoreIcon style={{ color: "#9ca3af" }} />
          )}
        </button>

        {showFeatures && (
          <div
            style={{ borderTop: "0.5px solid #f3f4f6", padding: "12px 14px" }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <SchoolIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Schools
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_schools ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_school != null
                    ? `${f.min_dist_school.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Universities */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <SchoolOutlinedIcon
                    style={{ fontSize: 14, color: "#9ca3af" }}
                  />{" "}
                  Universities
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_uni ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_uni != null
                    ? `${f.min_dist_uni.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Banks */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <AccountBalanceIcon
                    style={{ fontSize: 14, color: "#9ca3af" }}
                  />{" "}
                  Banks (2km)
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_banks_within_2km ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_nearest_bank != null
                    ? `${f.min_dist_nearest_bank.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Fuel */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <LocalGasStationIcon
                    style={{ fontSize: 14, color: "#9ca3af" }}
                  />{" "}
                  Fuel (2km)
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_Fuel_Stations_within2km ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_nearest_Fuel_station != null
                    ? `${f.min_dist_nearest_Fuel_station.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Supermarkets */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <ShoppingCartIcon
                    style={{ fontSize: 14, color: "#9ca3af" }}
                  />{" "}
                  Supermarkets (2km)
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_Supermarkets_within2km ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_nearest_Supermarket != null
                    ? `${f.min_dist_nearest_Supermarket.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Medical */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <LocalHospitalIcon
                    style={{ fontSize: 14, color: "#9ca3af" }}
                  />{" "}
                  Medical Centers
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.count_medical_centers ?? "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <StraightenIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Nearest
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_medical_center != null
                    ? `${f.min_dist_medical_center.toFixed(2)} km`
                    : "—"}
                </span>
              </div>

              {/* Railway */}
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrainIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Railway
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_nearest_railway != null
                    ? `${f.min_dist_nearest_railway.toFixed(2)} km`
                    : "—"}
                </span>
              </div>
              <div style={statPill}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <TrainIcon style={{ fontSize: 14, color: "#9ca3af" }} />{" "}
                  Express
                </span>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>
                  {f.min_dist_nearest_express != null
                    ? `${f.min_dist_nearest_express.toFixed(2)} km`
                    : "—"}
                </span>
              </div>
            </div>

            {/* Fort banner */}
            <div
              style={{
                background: "#E6F1FB",
                borderRadius: 8,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <LocationOnIcon style={{ color: "#185FA5", fontSize: 20 }} />
              <div>
                <div style={{ fontSize: 11, color: "#185FA5" }}>
                  Distance to Fort
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 600, color: "#185FA5" }}
                >
                  {f.distance_to_fort_km != null
                    ? `${f.distance_to_fort_km.toFixed(2)} km`
                    : "—"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── nearby places label ── */}
      <div
        style={{
          fontSize: 11,
          fontWeight: 500,
          color: "#9ca3af",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "4px 2px 0",
        }}
      >
        Nearby Places
      </div>

      {/* ================= PLACE SECTIONS ================= */}
      {sections.map((sec) => (
        <div key={sec.key} style={cardStyle}>
          <button onClick={() => toggle(sec.key)} style={btnStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={iconBadge(sec.key)}>{sec.icon}</span>
              {sec.label}
              <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>
                {(data[sec.key] || []).length}
              </span>
            </div>
            {open === sec.key ? (
              <ExpandLessIcon style={{ color: "#9ca3af" }} />
            ) : (
              <ExpandMoreIcon style={{ color: "#9ca3af" }} />
            )}
          </button>

          {open === sec.key && (
            <div
              style={{
                borderTop: "0.5px solid #f3f4f6",
                padding: "8px 14px",
                maxHeight: 180,
                overflowY: "auto",
              }}
            >
              {data[sec.key]?.length > 0 ? (
                data[sec.key].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "8px 0",
                      borderBottom:
                        i === data[sec.key].length - 1
                          ? "none"
                          : "0.5px solid #f3f4f6",
                    }}
                  >
                    <span
                      style={{
                        color: PALETTE[sec.key]?.color ?? "#6b7280",
                        display: "flex",
                        flexShrink: 0,
                      }}
                    >
                      {sec.icon}
                    </span>
                    <div>
                      <div
                        style={{ fontSize: 13, fontWeight: 500, color: "#111" }}
                      >
                        {item.name}
                      </div>
                      {item.distance_km && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "#9ca3af",
                            marginTop: 1,
                          }}
                        >
                          {item.distance_km} km away
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div
                  style={{ fontSize: 13, color: "#9ca3af", padding: "4px 0" }}
                >
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
