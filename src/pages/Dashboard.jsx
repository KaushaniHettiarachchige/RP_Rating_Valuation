import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Dashboard Page
const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Header />
      <main className="main-content">
        {/* Welcome Section */}
        <section className="welcome-section">
          <h1>Welcome to Valuerbot!</h1>
          <p>Automated Property Valuation System</p>
        </section>

        {/* Quick Overview */}
        <section className="quick-overview">
          <div className="overview-card">
            <h3>Recent Analysis</h3>
            <ul>
              <li>Last Analysis: Building Front, 450 m²</li>
              <li>Valuation: LKR 60,000</li>
            </ul>
          </div>

          <div className="overview-card">
            <h3>Pending Tasks</h3>
            <ul>
              <li>2 Properties Awaiting Valuation</li>
              <li>1 Report in Review</li>
            </ul>
          </div>
        </section>

        {/* Navigation Cards for Analysis */}
        <section className="analysis-cards">
          <div className="card">
            <h3>Acquire Property Images</h3>
            <p>Step 1 & 2: Receive parcel information and acquire satellite and street view images.</p>
            <Link to="/parcel-input" className="button">
              Start Image Acquisition
            </Link>
          </div>

          <div className="card">
            <h3>Preprocess Images</h3>
            <p>Step 3: Resize and format the acquired property images natively for deep learning models.</p>
            <Link to="/preprocess-images" className="button">
              Start Preprocessing
            </Link>
          </div>

          <div className="card">
            <h3>Detect Features</h3>
            <p>Step 4: AI models analyze images to detect internal land and building features.</p>
            <Link to="/detect-features" className="button">
              Detect Land Features
            </Link>
          </div>

          <div className="card">
            <h3>Estimate Measurements</h3>
            <p>Step 5: Estimate the Building Footprint Area (FAB) or related feature sizes.</p>
            <Link to="/estimate-measurements" className="button">
              Estimate Measurements
            </Link>
          </div>

          <div className="card">
            <h3>Collect Building Variables</h3>
            <p>Step 6: Fill Equation (2) variables combining AI and Manual GIS input.</p>
            <Link to="/collect-variables" className="button">
              Collate Data Fields
            </Link>
          </div>

          <div className="card">
            <h3>Satellite Image Analysis</h3>
            <p>Analyze satellite images for land classification.</p>
            <Link to="/satellite-image-analysis" className="button">
              Analyze Satellite Images
            </Link>
          </div>

          <div className="card">
            <h3>Street View Analysis</h3>
            <p>Analyze street view images for property context.</p>
            <Link to="/street-view-analysis" className="button">
              Analyze Street View Images
            </Link>
          </div>

          {/* <div className="card">
            <h3>Valuation Calculation</h3>
            <p>Calculate property valuation based on analysis.</p>
            <Link to="/valuation-calculation" className="button">
              Calculate Property Values
            </Link>
          </div> */}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
