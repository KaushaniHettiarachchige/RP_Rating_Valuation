import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../BuildingValuation/pages/Dashboard";
import SatelliteImageAnalysis from "../BuildingValuation/pages/SatelliteImageAnalysis";
import StreetViewAnalysis from "../BuildingValuation/pages/StreetViewAnalysis";
import ValuationCalculation from "../BuildingValuation/pages/ValuationCalculation";
import ParcelInput from "../BuildingValuation/pages/ParcelInput";
import PreprocessImages from "../BuildingValuation/pages/PreprocessImages";
import DetectFeatures from "../BuildingValuation/pages/DetectFeatures";
import EstimateMeasurements from "../BuildingValuation/pages/EstimateMeasurements";
import CollectVariables from "../BuildingValuation/pages/CollectVariables";
import AssessmentReport from "../BuildingValuation/pages/AssessmentReport";

const PropertyValuation = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="parcel-input" element={<ParcelInput />} />
        <Route path="preprocess-images" element={<PreprocessImages />} />
        <Route path="detect-features" element={<DetectFeatures />} />
        <Route
          path="estimate-measurements"
          element={<EstimateMeasurements />}
        />
        <Route path="collect-variables" element={<CollectVariables />} />
        <Route
          path="satellite-image-analysis"
          element={<SatelliteImageAnalysis />}
        />
        <Route path="street-view-analysis" element={<StreetViewAnalysis />} />
        <Route
          path="valuation-calculation"
          element={<ValuationCalculation />}
        />
        <Route path="assessment-report" element={<AssessmentReport />} />
      </Routes>
    </div>
  );
};

export default PropertyValuation;
