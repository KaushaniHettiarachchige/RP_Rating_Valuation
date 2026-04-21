import React from "react";
import { Box, Typography, Button, Grid, Paper, Divider } from "@mui/material";
import { Link } from "react-router-dom";
// Icons
import AssessmentIcon from "@mui/icons-material/Assessment";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import MapIcon from "@mui/icons-material/Map";
import RuleIcon from "@mui/icons-material/Rule";
import LayersIcon from "@mui/icons-material/Layers";
import StreetviewIcon from "@mui/icons-material/Streetview";

const Dashboard = () => {
  const analysisCards = [
    {
      title: "Acquire Images",
      desc: "Step 1 & 2: Receive parcel info & acquire satellite/street images.",
      link: "parcel-input",
      btn: "Start Acquisition",
      icon: <CameraAltIcon />,
    },
    {
      title: "Preprocess",
      desc: "Step 3: Resize and format images natively for deep learning models.",
      link: "preprocess-images",
      btn: "Start Preprocessing",
      icon: <AutoFixHighIcon />,
    },
    {
      title: "Detect Features",
      desc: "Step 4: AI models analyze images to detect land/building features.",
      link: "detect-features",
      btn: "Detect Features",
      icon: <LayersIcon />,
    },
    {
      title: "Measurements",
      desc: "Step 5: Estimate the Building Footprint Area (FAB) and sizes.",
      link: "estimate-measurements",
      btn: "Run Estimation",
      icon: <RuleIcon />,
    },
    {
      title: "Collect Variables",
      desc: "Step 6: Fill Equation variables combining AI and Manual GIS input.",
      link: "collect-variables",
      btn: "Collate Fields",
      icon: <AssessmentIcon />,
    },
    {
      title: "Satellite Analysis",
      desc: "Analyze satellite images for land classification and boundaries.",
      link: "satellite-image-analysis",
      btn: "Analyze Satellite",
      icon: <MapIcon />,
    },
    {
      title: "Street View",
      desc: "Analyze street view images for context and frontage quality.",
      link: "street-view-analysis",
      btn: "Analyze Street View",
      icon: <StreetviewIcon />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0fdf4", p: { xs: 3, md: 6 } }}>
      {/* Centered Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h3"
          sx={{ color: "#064e3b", fontWeight: 800, mb: 1, letterSpacing: -0.5 }}
        >
          Bulding Valuation
        </Typography>
      </Box>

      {/* Main Grid */}
      <Grid container spacing={4} justifyContent="center">
        {analysisCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: "100%",
                minHeight: "320px",
                borderRadius: 5,
                bgcolor: "#ffffff",
                border: "1px solid #d1fae5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center", // Horizontal centering
                textAlign: "center", // Text centering
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-12px)",
                  boxShadow: "0px 20px 40px rgba(5, 150, 105, 0.12)",
                  borderColor: "#10b981",
                },
              }}
            >
              {/* Centered Icon with Circle Background */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  bgcolor: "#ecfdf5",
                  color: "#059669",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  boxShadow: "inset 0px 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {React.cloneElement(card.icon, { sx: { fontSize: 32 } })}
              </Box>

              <Typography
                variant="h6"
                sx={{ color: "#064e3b", fontWeight: 700, mb: 1.5 }}
              >
                {card.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#6b7280", mb: 4, flexGrow: 1, lineHeight: 1.6 }}
              >
                {card.desc}
              </Typography>

              <Button
                component={Link}
                to={card.link}
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#10b981",
                  color: "white",
                  borderRadius: 3,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: "none",
                  boxShadow: "0px 4px 10px rgba(16, 185, 129, 0.2)",
                  "&:hover": {
                    bgcolor: "#059669",
                    boxShadow: "0px 6px 15px rgba(5, 150, 105, 0.3)",
                  },
                }}
              >
                {card.btn}
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
