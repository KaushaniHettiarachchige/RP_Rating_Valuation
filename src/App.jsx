import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // Import the new page
import SatelliteImageAnalysis from "./pages/SatelliteImageAnalysis"; // You will create this later
import StreetViewAnalysis from "./pages/StreetViewAnalysis"; // You will create this later
import ValuationCalculation from "./pages/ValuationCalculation"; // You will create this later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/satellite-image-analysis" element={<SatelliteImageAnalysis />} />
        <Route path="/street-view-analysis" element={<StreetViewAnalysis />} />
        <Route path="/valuation-calculation" element={<ValuationCalculation />} />
      </Routes>
    </Router>
  );
}

export default App;
