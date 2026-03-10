import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Map from "../common/Map";
import { useSelector } from "react-redux";
import axios from "axios";

const LandValuation = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [landSize, setLandSize] = useState(0);
  const { latitude, longitude } = useSelector((state) => state.app);
  const [data, setdata] = useState(null);
  console.log("🚀 ~ LandValuation ~ data:", data);

  const handleCalculate = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude || !landSize) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/estimate", null, {
        params: {
          lon: parseFloat(longitude),
          lat: parseFloat(latitude),
          eol: parseFloat(landSize),
        },
      });
      setdata(res.data);
    } catch (err) {
      console.error(err);
      alert("Backend rejected request");
    }
  };

  return (
    <Box
      sx={{
        mx: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        width: "100%",
        gap: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Typography
            variant="h2"
            component={"span"}
            sx={{
              fontSize: { xs: "30px", md: "2.2rem" },
              background:
                "linear-gradient(90deg, #09b947ff 0%, #046720ff 100%);",
              backgroundClip: "text",
              color: "transparent",
              textAlign: "left",
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            Land
          </Typography>
          <Typography
            component={"span"}
            sx={{
              fontSize: { xs: "30px", md: "2.2rem" },

              color: "#000",
              textAlign: "left",
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            Valuation
          </Typography>
        </Box>
        <Divider
          orientation="horizontal"
          sx={{
            flex: 1,
            borderBottom: "1px solid #02563087",
          }}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "3fr 2fr",
          gap: 4,
        }}
      >
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            display: "grid",
            gridTemplateAreas: `
          "a b"
          "c c"
          "d e"
        `,
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            "& .MuiOutlinedInput-root": {
              px: 2,
              "& fieldset": { borderColor: "#000", borderRadius: "10px" },
              "&:hover fieldset": { borderColor: "#000" },
              "&.Mui-focused fieldset": { borderColor: "#000" },
            },
            "& .MuiInputBase-input": { color: "#000", py: "16.5px" },
            "& .MuiInputLabel-root": { color: "#000" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#000" },
          }}
        >
          <TextField
            label="Owners First Name"
            variant="outlined"
            sx={{ gridArea: "a" }}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <TextField
            label="Owners Last Name"
            variant="outlined"
            sx={{ gridArea: "b" }}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <TextField
            label="Property Address"
            variant="outlined"
            sx={{ gridArea: "c" }}
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
          />

          <TextField
            label="Size of The Land"
            variant="outlined"
            sx={{ borderRadius: "20px", gridArea: "d" }}
            value={landSize}
            onChange={(e) => setLandSize(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">perches</InputAdornment>
              ),
            }}
          />

          <Button
            sx={{
              bgcolor: "#000",
              color: "#fff",
              gridArea: "e",
              borderRadius: "20px",
            }}
            onClick={handleCalculate}
          >
            Calculate Value
          </Button>
        </Box>
        <Box sx={{ bgcolor: "#fff", boxShadow: 20, borderRadius: 10, p: 2 }}>
          {data ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              {" "}
              <Typography
                component={"span"}
                sx={{
                  fontSize: { xs: "30px", md: "1.3rem" },

                  color: "#000",
                  textAlign: "left",
                  lineHeight: 1.2,
                  fontWeight: 700,
                }}
              >
                Land Valuation Data
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 2,
                  }}
                >
                  {" "}
                  <Typography sx={{ fontWeight: 500 }}>Zone=</Typography>
                  <Typography sx={{ fontWeight: 3500 }}>
                    {data.zone_type}
                  </Typography>
                </Box>

                {/* <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 2,
                  }}
                >
                  {" "}
                  <Typography sx={{ fontWeight: 500 }}>
                    Ditance To Main Road =
                  </Typography>
                  <Typography sx={{ fontWeight: 3500 }}>{data.DTMR}</Typography>
                </Box> */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 2,
                  }}
                >
                  {" "}
                  <Typography sx={{ fontWeight: 500 }}>
                    Final Land Value =
                  </Typography>
                  <Typography sx={{ fontWeight: 3500 }}>
                    LKR {data.predicted_value}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={100} />
            </Box>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          height: "400px",
          overflow: "hidden",
          borderRadius: "10px",
          mt: 2,
        }}
      >
        <Map address={propertyAddress} />
      </Box>
    </Box>
  );
};

export default LandValuation;
