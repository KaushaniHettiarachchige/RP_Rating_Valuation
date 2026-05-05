import { useEffect, useRef } from "react";

import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import RealEstateAgentRoundedIcon from "@mui/icons-material/RealEstateAgentRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";

const cards = [
  {
    href: "/properties",
    label: "Property Verification",
    sublabel: "Verify ownership & legal status instantly",
    icon: VerifiedUserRoundedIcon,
    img: "https://images.unsplash.com/photo-1603899122406-e7eb957f9fd6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    href: "/valuation",
    label: "Property Valuation",
    sublabel: "Government-approved property estimates",
    icon: RealEstateAgentRoundedIcon,
    img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1170&auto=format&fit=crop",
  },
  {
    href: "/ownership-transfer",
    label: "Ownership Transfer",
    sublabel: "Secure digital title transfer system",
    icon: SwapHorizRoundedIcon,
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1170&auto=format&fit=crop",
  },
  
];

const CouncilHome = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      body {
        font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      }

      .gov-card {
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        background: rgba(255,255,255,0.85);
      }

      .gov-card:hover {
        transform: translateY(-6px);
        box-shadow: 0 18px 40px rgba(0,0,0,0.12);
      }

      .gov-card img {
        transition: transform 0.6s ease;
      }

      .gov-card:hover img {
        transform: scale(1.08);
      }
    `;
    document.head.appendChild(style);

    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-[#0f2e22] via-[#1f3d2b] to-[#0b1f17] flex flex-col items-center px-6 py-14">
      <div className="absolute w-72 h-72 bg-green-400/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="text-center mb-12 max-w-3xl z-10">
        <h1 className="text-5xl font-bold text-white tracking-tight">
          ValuerBot - Council Portal
        </h1>
        <p className="text-green-100 mt-4 text-base leading-relaxed">
          A platform for property verification, valuation, ownership transfer,
          and tax management for Sri Jayewardenepura Kotte Municipal Council
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 w-full max-w-6xl z-10">
        {cards.map(({ href, label, sublabel, icon: Icon, img }, i) => (
          <a
            key={href}
            href={href}
            ref={(el) => (cardRefs.current[i] = el)}
            className="gov-card relative rounded-2xl overflow-hidden border border-white/20 shadow-lg block"
          >
            <div className="h-40 overflow-hidden">
              <img
                src={img}
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-lg bg-[#1f3d2b] flex items-center justify-center shadow-md">
                  <Icon style={{ color: "#fff", fontSize: "1.3rem" }} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1f3d2b]">{label}</h3>
                  <p className="text-xs text-gray-600 mt-1">{sublabel}</p>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default CouncilHome;
