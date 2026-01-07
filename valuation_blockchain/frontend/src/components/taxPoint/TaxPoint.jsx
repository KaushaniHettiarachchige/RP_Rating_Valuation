import { useState } from "react";

const TaxPoint = () => {
  const [activeTab, setActiveTab] = useState("resident");
  return (
    <Box>
      <div className="w-full py-4">
        {/* Segmented Navigation Control */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex bg-white rounded-xl shadow-lg border border-slate-200 p-1.5">
            <button
              onClick={() => setActiveTab("resident")}
              className={`
                px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300
                flex items-center gap-3
                ${
                  activeTab === "resident"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                      ? "text-emerald-100"
                      : "text-slate-500"
                  }`}
                >
                  Verify & Detect Corruption
                </div>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("council")}
              className={`
                px-8 py-4 rounded-lg font-semibold text-base transition-all duration-300
                flex items-center gap-3
                ${
                  activeTab === "council"
                    ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <div className="text-left">
                <div>Council Dashboard</div>
                <div
                  className={`text-xs font-normal ${
                    activeTab === "council"
                      ? "text-amber-100"
                      : "text-slate-500"
                  }`}
                >
                  Assess Properties
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Render Active View */}
        <div className="w-full bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 md:p-6 lg:p-8">
            {activeTab === "resident" ? (
              <ResidentPortal />
            ) : (
              <CouncilDashboard />
            )}
          </div>
        </div>
      </div>
    </Box>
  );
};

export default TaxPoint;
