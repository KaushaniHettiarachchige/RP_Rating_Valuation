import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ResidentPortal from "./pages/ResidentPortal";
import CouncilDashboard from "./pages/CouncilDashboard";
import Home from "./components/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TaxPoint from "./components/tax-point/TaxPoint";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/valuation" element={<Home />} />
        <Route path="/tax-point" element={<TaxPoint />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
