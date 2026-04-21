import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Alert,
  MenuItem,
} from "@mui/material";
import usersData from "../assets/users.json";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("public");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const user = usersData.find(
      (u) =>
        u.username === username && u.password === password && u.role === role,
    );

    if (user) {
      setError("");
      dispatch(login(user)); // save in Redux
      navigate("/"); // redirect to Home
    } else {
      setError("Invalid credentials or role!");
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        mt: 10,
        p: 4,
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        background: "linear-gradient(135deg,#2A9B3D20,#53ED7220)",
      }}
    >
      <Box textAlign="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="#2A9B3D">
          Login
        </Typography>
        <Typography variant="body2" color="#034720">
          Enter your credentials
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Username"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <TextField
        select
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="public">Public User</MenuItem>
        <MenuItem value="valuer">Valuer Official</MenuItem>
      </TextField>

      <Button
        variant="contained"
        fullWidth
        sx={{
          mt: 3,
          py: 1.5,
          background:
            "linear-gradient(90deg,#2A9B3D 0%, #57C785 50%, #53ED72 100%)",
          "&:hover": {
            background:
              "linear-gradient(90deg,#57C785 0%, #2A9B3D 50%, #53ED72 100%)",
          },
        }}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Container>
  );
};

export default Login;
