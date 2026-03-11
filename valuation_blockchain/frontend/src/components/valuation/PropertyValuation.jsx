import { Box, Divider, Step, StepLabel, Stepper } from "@mui/material";

import LandValuation from "./LandValuation";
import { useSelector } from "react-redux";
import BuildingValuation from "./BuildingValuation";
import CouncilDashboard from "../../pages/CouncilDashboard";

const PropertyValuation = () => {
  const steps = ["Land Valuation", "Building Valauation", "Finalize Valuation"];
  const activeStep = useSelector((state) => state.app.activeStep);

  return (
    <Box
      sx={{
        py: 4,
        mx: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 4,
      }}
    >
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          width: "100%",
          "& .MuiStepLabel-label": {
            color: "#555",
            fontWeight: 500,
            fontSize: "18px",
          },
          "& .MuiStepIcon-text": { fontSize: "16px" },
          "& .MuiStepIcon-root": {
            width: 30,
            height: 30,

            borderRadius: "50%",
          },

          "& .MuiStepLabel-label.Mui-active": {
            color: "#05230aff",
          },
          "& .MuiStepLabel-label.Mui-completed": {},
          "& .MuiStepConnector-line": {
            borderColor: "#ccc",
            borderTopWidth: 3,
          },
          "& .MuiStepConnector-line.Mui-active": {},
          "& .MuiStepConnector-line.Mui-completed": {
            borderColor: "#4caf50",
          },
          "& .MuiStepIcon-root.Mui-active": {
            color: "#248b11ff",
          },
          "& .MuiStepIcon-root.Mui-completed": {
            color: "#05230aff",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep == 0 ? (
        <LandValuation />
      ) : activeStep == 1 ? (
        <BuildingValuation />
      ) : activeStep == 2 ? (
        <CouncilDashboard />
      ) : null}
    </Box>
  );
};

export default PropertyValuation;
