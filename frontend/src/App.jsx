import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Login from "./pages/Login";
import ResidentPortal from "./pages/ResidentPortal";
import CouncilDashboard from "./pages/CouncilDashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import TaxPoint from "./components/taxPoint/TaxPoint";
import PropertyValuation from "./components/valuation/PropertyValuation";
import BuildingValuation from "./components/valuation/BuildingValuation";
import MyPropertiesSection from "./components/land-valuation/LandValuation";
import ValuateLand from "./components/land-valuation/ValuateLand";
function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      {isLoggedIn && <Header />} {/* show header only when logged in */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/tax-point"
          element={isLoggedIn ? <TaxPoint /> : <Navigate to="/login" />}
        />
        <Route
          path="/valuation/*"
          element={
            isLoggedIn ? <PropertyValuation /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/val-store"
          element={isLoggedIn ? <CouncilDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/valuation/building/*"
          element={
            isLoggedIn ? <BuildingValuation /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/properties"
          element={
            isLoggedIn ? <MyPropertiesSection /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/valuate/:id"
          element={isLoggedIn ? <ValuateLand /> : <Navigate to="/login" />}
        />
      </Routes>
      {isLoggedIn && <Footer />}
    </BrowserRouter>
  );
}

export default App;
