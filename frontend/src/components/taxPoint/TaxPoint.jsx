import { useState } from "react";

import { Container } from "@mui/material";
import ResidentPortal from "../../pages/ResidentPortal";

const TaxPoint = () => {
  const [activeTab, setActiveTab] = useState("resident");

  return (
    <Container>
      {" "}
      <div className="min-h-screen">
        <div className="w-full py-6">
          <div className="w-full bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 md:p-6 lg:p-8">
              <ResidentPortal />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TaxPoint;
