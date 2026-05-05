import { useState } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ForestOutlinedIcon from "@mui/icons-material/ForestOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
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
      dispatch(login(user));
      navigate("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-950 via-green-900 to-emerald-800 relative overflow-hidden">
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 rounded-full bg-green-500 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-emerald-400 opacity-10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-[-120px] w-64 h-64 rounded-full bg-lime-400 opacity-5 blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-sm mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-emerald-300 to-lime-400" />

        <div className="px-8 py-10">
          <div className="flex flex-col items-center mb-8">
            <div className=" rounded-2xl  bg-white flex items-center justify-center shadow-lg mb-4">
              <img
                src="/Images/valuerBot-logo.png"
                alt="ValuerBot Logo"
                className="w-60 object-contain  drop-shadow-lg"
              />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-green-300 text-sm mt-1">
              Sign in to your account
            </p>
          </div>

          {error && (
            <Alert
              severity="error"
              className="mb-5 rounded-xl text-sm"
              sx={{
                backgroundColor: "rgba(239,68,68,0.15)",
                color: "#fca5a5",
                border: "1px solid rgba(239,68,68,0.3)",
                "& .MuiAlert-icon": { color: "#f87171" },
              }}
            >
              {error}
            </Alert>
          )}

          <div className="flex flex-col gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none z-10">
                <PersonOutlineIcon style={{ fontSize: 20 }} />
              </div>
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "2.2rem",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(134,239,172,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4ade80",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(167,243,208,0.7)",
                    paddingLeft: "1.8rem",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4ade80",
                    paddingLeft: 0,
                  },
                  "& .MuiInputLabel-shrink": { paddingLeft: 0 },
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none z-10">
                <LockOutlinedIcon style={{ fontSize: 20 }} />
              </div>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "2.2rem",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(134,239,172,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4ade80",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(167,243,208,0.7)",
                    paddingLeft: "1.8rem",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4ade80",
                    paddingLeft: 0,
                  },
                  "& .MuiInputLabel-shrink": { paddingLeft: 0 },
                }}
              />
            </div>

            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none z-10">
                <BadgeOutlinedIcon style={{ fontSize: 20 }} />
              </div>
              <TextField
                select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    paddingLeft: "2.2rem",
                    borderRadius: "12px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "white",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                    "&:hover fieldset": {
                      borderColor: "rgba(134,239,172,0.5)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#4ade80",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(167,243,208,0.7)",
                    paddingLeft: "1.8rem",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4ade80",
                    paddingLeft: 0,
                  },
                  "& .MuiInputLabel-shrink": { paddingLeft: 0 },
                  "& .MuiSelect-icon": { color: "rgba(167,243,208,0.7)" },
                  "& .MuiMenu-paper": { backgroundColor: "#1a3a2a" },
                }}
              >
                <MenuItem value="public">Public User</MenuItem>
                <MenuItem value="valuer">Valuer Official</MenuItem>
              </TextField>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="mt-7 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide
              bg-gradient-to-r from-green-500 via-emerald-500 to-green-400
              hover:from-emerald-400 hover:via-green-400 hover:to-lime-400
              active:scale-[0.98] transition-all duration-200 shadow-lg shadow-green-900/50"
          >
            Log In
            <ArrowForwardIcon style={{ fontSize: 18 }} />
          </button>

          <p className="text-center text-green-400/50 text-xs mt-6 underline">
            Sign in
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
