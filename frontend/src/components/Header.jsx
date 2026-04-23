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
  Divider,
} from "@mui/material";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", icon: <DashboardIcon />, link: "/" },
    { name: "Properties", icon: <HomeWorkIcon />, link: "/properties" },
    { name: "Valuation", icon: <AssessmentIcon />, link: "/valuation" },
    { name: "Tax Store", icon: <DescriptionIcon />, link: "/val-store" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      {/* Top Header */}
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
        <div className="relative container"> <div
          className="flex flex-row w-full items-center justify-between"
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
        </div></div>
       
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

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 270,
            borderTopLeftRadius: 40,
            borderBottomLeftRadius: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        {/* User Info */}
        <Box
          sx={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            color: "#fff",
            background:
              "linear-gradient(135deg,#2A9B3D 0%, #57C785 60%, #53ED72 100%)",
            px: 2,
            textAlign: "center",
          }}
        >
          <Typography fontWeight="bold" fontSize={20}>
            ValuerBot
          </Typography>
          <Typography fontSize={13}>Property Valuation</Typography>

          {user && (
            <Box mt={1}>
              <Typography fontSize={14}>
                <strong>User:</strong> {user.username}
              </Typography>
              <Typography fontSize={12}>
                <strong>Role:</strong>{" "}
                {user.role === "public" ? "Public User" : "Valuer Official"}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Menu Items */}
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

        <Box>
          <Divider />
          <List>
            {/* Logout Button */}
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
                transition: "0.25s",
                "&:hover": {
                  background: "linear-gradient(90deg,#FF6B6B20,#FF3B3B20)",
                  transform: "translateX(5px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#FF3B3B",
                  minWidth: 40,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
