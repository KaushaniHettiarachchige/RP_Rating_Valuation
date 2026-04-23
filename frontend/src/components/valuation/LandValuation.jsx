import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
} from "@mui/material";

import { Grid } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ExploreIcon from "@mui/icons-material/Explore";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

import Map from "../common/Map";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setActiveStep } from "../../store/slices/appSlice";
import { setProperty } from "../../store/slices/propertySlice";

const LandValuation = () => {
  const [ownerName, setOwnerName] = useState("");

  const [propertyAddress, setPropertyAddress] = useState("");
  const [landSize, setLandSize] = useState("");
  const [coordinates, setCoordinates] = useState({
    lat: 6.795995,
    lon: 79.9002,
  });

  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [markerPos, setMarkerPos] = useState(null);
  const latitude = useSelector((state) => state.app.latitude);
  const longitude = useSelector((state) => state.app.longitude);

  useEffect(() => {
    if ((latitude, longitude)) {
      setCoordinates({ lat: latitude, lon: longitude });
      setPropertyAddress(
        `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`,
      );
    }
  }, [markerPos]);
  const perchToSqft = (perch) => perch * 272.25;

  const handleSetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lon: longitude });
          setPropertyAddress(
            `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`,
          );
        },
        (error) => {
          alert("Error getting location: " + error.message);
        },
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/public/estimate",
        {
          latitude: parseFloat(coordinates.lat),
          longitude: parseFloat(coordinates.lon),
          land_size: parseFloat(landSize),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      setData(res.data);

      dispatch(
        setProperty({
          latitude: parseFloat(coordinates.lat),
          longitude: parseFloat(coordinates.lon),
          estimatedLandValue: res.data.total_price,
          owner: ownerName,
          landSize: perchToSqft(landSize),
        }),
      );
      setLoading(false);
    } catch (err) {
      console.error(err.response ? err.response.data : err);
      alert("Backend rejected request");
    }
  };

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh", gap: 2, p: 2 }}>
      <Box
        sx={{
          width: "25%",
          bgcolor: "#f5f5f5",
          p: 3,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Land Valuation
        </Typography>

        <TextField
          label="Owner Name"
          variant="outlined"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
        />

        <TextField
          label="Property Address"
          variant="outlined"
          value={propertyAddress}
          onChange={(e) => setPropertyAddress(e.target.value)}
        />

        <Button variant="outlined" onClick={handleSetCurrentLocation}>
          Use Current Location
        </Button>

        <TextField
          label="Size of Land (perches)"
          variant="outlined"
          value={landSize}
          onChange={(e) => setLandSize(e.target.value)}
        />

        <Button
          variant="contained"
          sx={{ bgcolor: "#09b947", color: "#fff" }}
          onClick={handleCalculate}
        >
          Valuate
        </Button>
      </Box>

      {/* Center Map */}
      <Box
        sx={{
          flex: 1,
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          maxHeight: "450px",
        }}
      >
        <Map
          coordinates={coordinates}
          onMarkerChange={(newPos) => {
            console.log("Marker moved to:", newPos);
            setMarkerPos(newPos);
          }}
        />
        {markerPos && (
          <p>
            Selected Position: Lat {markerPos.lat}, Lng {markerPos.lng}
          </p>
        )}
      </Box>

      <Box
        sx={{
          width: "25%",
          bgcolor: "#ffffff",
          height: "fit-content",
          p: 3,
          borderRadius: 4,
          boxShadow: "0px 10px 30px rgba(0, 71, 18, 0.1)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          border: "1px solid #e0f2f1",
        }}
      >
        {loading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ py: 6, minHeight: "200px" }}
            spacing={2}
          >
            <CircularProgress
              sx={{ color: "#2e7d32" }}
              size={60}
              thickness={4}
            />
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                Valuating Data...
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Scanning pandg area in progress
              </Typography>
            </Box>
          </Stack>
        ) : data ? (
          <>
            <Box
              sx={{
                textAlign: "center",
                mb: 2,
                p: 2,
                borderRadius: 2,
                background: "linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%)",
              }}
            >
              <Typography
                variant="subtitle2"
                color="#558b2f"
                fontWeight={700}
                sx={{ textTransform: "uppercase", letterSpacing: 1 }}
              >
                Estimated Land Value
              </Typography>
              <Typography variant="h4" color="#2e7d32" fontWeight={800}>
                LKR {data.total_price.toLocaleString()}
              </Typography>
            </Box>

            {/* Zone Type - Pill Style */}
            <Box
              sx={{
                mb: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight={600} color="#33691e">
                Zone Type
              </Typography>
              <Typography
                sx={{
                  bgcolor: "#e8f5e9",
                  color: "#2e7d32",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  fontSize: "0.85rem",
                  fontWeight: 700,
                }}
              >
                {data.zone_type || "N/A"}
              </Typography>
            </Box>

            <Divider sx={{ my: 1, borderColor: "#f1f8e9" }} />

            {/* Accessibility & Distances */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="body2"
                fontWeight={700}
                color="#558b2f"
                mb={1.5}
              >
                ACCESSIBILITY & DISTANCES
              </Typography>
              <Grid container spacing={1.5}>
                {[
                  
                  {
                    icon: <LocationCityIcon />,
                    label: "Town Center",
                    val: Math.round(data.features.town_distance * 100) / 100,
                    color: "#388e3c",
                  },
                  {
                    icon: <AirportShuttleIcon />,
                    label: "Airport",
                    val: Math.round(data.features.airport_distance * 100) / 100,
                    color: "#66bb6a",
                  },
                  {
                    icon: <LocalShippingIcon />,
                    label: "Harbor",
                    val: Math.round(data.features.harbor_distance * 100) / 100,
                    color: "#2e7d32",
                  },
                  {
                    icon: <ExploreIcon />,
                    label: "Expressway",
                    val:
                      Math.round(data.features.expressway_distance * 100) / 100,
                    color: "#1b5e20",
                  },
                  {
                    icon: <LocalHospitalIcon />,
                    label: "Hospital",
                    val:
                      Math.round(data.features.hospital_distance * 100) / 100,
                    color: "#81c784",
                  },
                ].map((item, index) => (
                  <Grid
                    item
                    xs={12}
                    key={index}
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                  >
                    <Box sx={{ color: item.color, display: "flex" }}>
                      {item.icon}
                    </Box>
                    <Typography variant="body2" color="#444">
                      {item.label}: <strong>{item.val} km</strong>
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Nearby Facilities Section */}
            <Box
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "#f9fbf9",
                borderRadius: 2,
                border: "1px dashed #c8e6c9",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
                color="#558b2f"
                mb={1.5}
              >
                NEARBY FACILITIES
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} display="flex" alignItems="center" gap={1.5}>
                  <StorefrontIcon sx={{ color: "#43a047", fontSize: 20 }} />
                  <Typography variant="body2">
                    Supermarkets: <strong>{data.features.supermarkets}</strong>
                  </Typography>
                </Grid>
                <Grid item xs={12} display="flex" alignItems="center" gap={1.5}>
                  <SchoolIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                  <Typography variant="body2">
                    Schools: <strong>{data.features.schools}</strong>
                  </Typography>
                  <Grid
                    item
                    xs={12}
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                  >
                    <SchoolIcon sx={{ color: "#2e7d32", fontSize: 20 }} />
                    <Typography variant="body2">
                      Univercities:{" "}
                      <strong>{data.features.universities}</strong>
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                  sx={{ mt: 0.5 }}
                >
                  <AccessibilityNewIcon
                    sx={{ color: "#1b5e20", fontSize: 20 }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      display="block"
                      color="text.secondary"
                    >
                      Accessibility Score
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={data.features.accessibility_score * 100} // Assuming score is out of 10
                      sx={{
                        height: 6,
                        borderRadius: 5,
                        bgcolor: "#e8f5e9",
                        "& .MuiLinearProgress-bar": { bgcolor: "#4caf50" },
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>
            <Grid
              item
              xs={12}
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{ mt: 2 }}
            >
              <Button
                onClick={() => {
                  dispatch(setActiveStep(1));
                }}
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "#2e7d32",
                  color: "#ffffff",
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: "1rem",
                  boxShadow: "0px 4px 10px rgba(46, 125, 50, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#1b5e20",
                    boxShadow: "0px 6px 15px rgba(46, 125, 50, 0.3)",
                    transform: "translateY(-2px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                Next Step
              </Button>
            </Grid>
          </>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No data yet. Enter details and valuate.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default LandValuation;
