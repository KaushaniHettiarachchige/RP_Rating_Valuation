import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Import the new page
import SatelliteImageAnalysis from "./pages/SatelliteImageAnalysis"; // You will create this later
import StreetViewAnalysis from "./pages/StreetViewAnalysis"; // You will create this later
import ValuationCalculation from "./pages/ValuationCalculation"; // You will create this later
import ParcelInput from "./pages/ParcelInput";
import PreprocessImages from "./pages/PreprocessImages";
import DetectFeatures from "./pages/DetectFeatures";
import EstimateMeasurements from "./pages/EstimateMeasurements";
import CollectVariables from "./pages/CollectVariables";
import AssessmentReport from "./pages/AssessmentReport";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/parcel-input" element={<ParcelInput />} />
        <Route path="/preprocess-images" element={<PreprocessImages />} />
        <Route path="/detect-features" element={<DetectFeatures />} />
        <Route path="/estimate-measurements" element={<EstimateMeasurements />} />
        <Route path="/collect-variables" element={<CollectVariables />} />
        <Route path="/satellite-image-analysis" element={<SatelliteImageAnalysis />} />
        <Route path="/street-view-analysis" element={<StreetViewAnalysis />} />
        <Route path="/valuation-calculation" element={<ValuationCalculation />} />
        <Route path="/assessment-report" element={<AssessmentReport />} />
      </Routes>
    </Router>
  );
}

export default App;
