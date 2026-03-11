import { Box, Typography, Divider } from "@mui/material";
import Logo from "/Images/valuerBot-logo.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 16,
        background:
          "linear-gradient(135deg,#1F4D2D 0%, #2A9B3D 60%, #124627 100%)",
        color: "#fff",
        position: "relative",
      }}
    >
      <Box
        sx={{
          height: "5px",
          background:
            "linear-gradient(90deg,#2A9B3D 0%, #57C785 50%, #53ED72 100%)",
          width: "100%",
        }}
      />

      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 3, md: 6 },
          py: 8,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "center", md: "flex-start" },
          gap: 4,
        }}
      >
        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Box
            component="img"
            src={Logo}
            alt="ValuerBot Logo"
            width={180}
            mb={2}
          />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Final Year Research Project
          </Typography>

          <Typography variant="body2" sx={{ color: "#D3F0D8", mb: 1 }}>
            Contributed by: <strong>name, [Name2], [Name3], [Name4]</strong>
          </Typography>

          <Typography variant="caption" sx={{ color: "#BFE3C8" }}>
            &copy; {new Date().getFullYear()} ValuerBot Project. All rights
            reserved.
          </Typography>
        </Box>

        <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 2 }}>
            Technologies Used
          </Typography>
          <Typography variant="body2" sx={{ color: "#D3F0D8", mb: 0.5 }}>
            React, MUI, Tailwind CSS
          </Typography>
          <Typography variant="body2" sx={{ color: "#D3F0D8", mb: 0.5 }}>
            Leaflet, OSMNX
          </Typography>
          <Typography variant="body2" sx={{ color: "#D3F0D8", mb: 0.5 }}>
            Python (FastAPI), SQLite
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
