import { useState } from "react";
import {
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";

const Header = () => {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, link: "/" },
    { name: "Properties", icon: <HomeWorkIcon />, link: "/properties" },
    { name: "Valuation", icon: <AssessmentIcon />, link: "/valuation" },
    { name: "Reports", icon: <DescriptionIcon />, link: "/reports" },
  ];

  return (
    <>
      <Box
        sx={{
          width: "100vw",
          py: 1.5,
          background: "#fff",
          position: "sticky",
          boxShadow: "0px 2px 15px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          top: 0,
          zIndex: 200,
        }}
      >
        <Container
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box component="a" href="/">
            <Box component="img" src="/Images/valuerBot-logo.png" width={240} />
          </Box>
          <IconButton
            onClick={() => setOpen(true)}
            sx={{
              background: "transparent",
              color: "#034720",
              "&:hover": {
                background: "#9fff9f",
              },
            }}
          >
            <MenuIcon sx={{ fontSize: 30 }} />
          </IconButton>
        </Container>
        <Box
          sx={{
            width: "100%",
            height: "5px",
            background:
              "linear-gradient(90deg,#2A9B3D 0%, #57C785 50%, #53ED72 100%)",
            position: "absolute",
            bottom: 0,
          }}
        />
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 270,
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40,
          },
        }}
      >
        <Box
          sx={{
            height: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            background:
              "linear-gradient(135deg,#2A9B3D 0%, #57C785 60%, #53ED72 100%)",
          }}
        >
          <Typography fontWeight="bold" fontSize={20}>
            ValuerBot
          </Typography>
          <Typography fontSize={13}>Property Valuation</Typography>
        </Box>

        <List sx={{ mt: 2 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.name}
              component="a"
              href={item.link}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
                transition: "0.25s",
                "&:hover": {
                  background: "linear-gradient(90deg,#2A9B3D20,#53ED7220)",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#2A9B3D",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.name}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Header;
