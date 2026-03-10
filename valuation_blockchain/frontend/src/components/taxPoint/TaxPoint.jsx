import { useState } from "react";
import ResidentPortal from "../../pages/ResidentPortal";
import CouncilDashboard from "../../pages/CouncilDashboard";
import { Container } from "@mui/material";

const TaxPoint = () => {
  const [activeTab, setActiveTab] = useState("resident");

  return (
    <Container>
      {" "}
      <div className="min-h-screen">
        <div className="w-full py-6">
          {/* Segmented Navigation */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white rounded-xl shadow-md border border-gray-200 p-1.5">
              {/* Resident Button */}
              <button
                onClick={() => setActiveTab("resident")}
                className={`
                px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                flex items-center gap-3
                ${
                  activeTab === "resident"
                    ? "bg-gradient-to-r from-green-600 to-green-400 text-white shadow"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }
              `}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>

                <div className="text-left">
                  <div>Resident Portal</div>
                  <div
                    className={`text-xs font-normal ${
                      activeTab === "resident"
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    Verify Property
                  </div>
                </div>
              </button>

              {/* Council Button */}
              <button
                onClick={() => setActiveTab("council")}
                className={`
                px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300
                flex items-center gap-3
                ${
                  activeTab === "council"
                    ? "bg-gradient-to-r from-green-600 to-green-400 text-white shadow"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }
              `}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1"
                  />
                </svg>

                <div className="text-left">
                  <div>Council Dashboard</div>
                  <div
                    className={`text-xs font-normal ${
                      activeTab === "council"
                        ? "text-green-100"
                        : "text-gray-500"
                    }`}
                  >
                    Assess Properties
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Content Card */}
          <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 md:p-6 lg:p-8">
              {activeTab === "resident" ? (
                <ResidentPortal />
              ) : (
                <CouncilDashboard />
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TaxPoint;
