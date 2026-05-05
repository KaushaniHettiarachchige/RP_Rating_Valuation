import { useEffect, useRef } from "react";
import RealEstateAgentRoundedIcon from "@mui/icons-material/RealEstateAgentRounded";
import RequestQuoteRoundedIcon from "@mui/icons-material/RequestQuoteRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import MapRoundedIcon from "@mui/icons-material/MapRounded";
import { HomeFilled } from "@mui/icons-material";

const cards = [
  {
    href: "/propertyManagement",
    label: "Property Management",
    sublabel: "Manage My Properties",
    icon: HomeFilled,
    img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    accent: "#4ade80",
  },
  {
    href: "/valuation",
    label: "Property Valuation",
    sublabel: "Instant AI estimates",
    icon: RealEstateAgentRoundedIcon,
    img: "https://images.unsplash.com/photo-1501516069922-a9982bd6f3bd?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    accent: "#15d655",
  },
  {
    href: "/tax-point",
    label: "Tax Point",
    sublabel: "Calculate with clarity",
    icon: RequestQuoteRoundedIcon,
    img: "https://images.unsplash.com/photo-1709880945165-d2208c6ad2ec?q=80&w=1170&auto=format&fit=crop",
    accent: "#22c55e",
  },

  {
    href: "/zone-map",
    label: "Accessbility Score",
    sublabel: "Explore Acseesbility",
    icon: MapRoundedIcon,
    img: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1170&auto=format&fit=crop",
    accent: "#86efac",
  },
];

const Home = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(32px); }
        to   { opacity: 1; transform: translateY(0); }
      }

      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }

      @keyframes rotateSlow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .home-card {
        animation: fadeUp 0.7s ease both;
      }
      .home-card:nth-child(1) { animation-delay: 0.15s; }
      .home-card:nth-child(2) { animation-delay: 0.28s; }
      .home-card:nth-child(3) { animation-delay: 0.41s; }
      .home-card:nth-child(4) { animation-delay: 0.54s; }

      .home-card img {
        transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
      }
      .home-card:hover img {
        transform: scale(1.1);
      }

      .home-card .card-overlay {
        transition: opacity 0.4s ease;
      }
      .home-card:hover .card-overlay {
        opacity: 1 !important;
      }

      .home-card .card-btn {
        transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease;
      }
      .home-card:hover .card-btn {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 16px 40px rgba(0,0,0,0.25) !important;
      }

      .hero-title {
        font-family: 'Playfair Display', serif;
        animation: fadeUp 0.9s ease both;
      }

      .hero-sub,
      .hero-body {
        font-family: 'DM Sans', sans-serif;
        animation: fadeUp 0.9s ease both;
      }

      .shimmer-text {
        background: linear-gradient(90deg, #297d18 0%, #15d655 40%, #86efac 60%, #297d18 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shimmer 3s linear infinite;
      }

      .ring {
        animation: rotateSlow 18s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
      linear-gradient(rgba(255, 255, 255, 0.67), rgba(255, 255, 255, 0.7)),
      url("/Images/back.png"),
      radial-gradient(circle at 12% 22%, rgba(50, 217, 20, 0.18) 0%, rgba(20, 217, 99, 0) 40%),
      radial-gradient(circle at 88% 15%, rgba(60, 165, 0, 0.2) 0%, rgba(0, 165, 47, 0) 38%),
      linear-gradient(160deg, #f7fbff 0%, #edf3ff 100%)
    `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="absolute top-[-100px] left-[-100px] w-[420px] h-[420px] rounded-full opacity-30 -z-10"
        style={{
          background: "radial-gradient(circle, #86efac 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-80px] right-[-80px] w-[500px] h-[500px] rounded-full opacity-20 -z-10"
        style={{
          background: "radial-gradient(circle, #15d655 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #297d18 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="mt-16 flex flex-col justify-center items-center  container w-full">
        <div className="mb-12 text-center flex flex-row items-center justify-center gap-12">
          <h1
            className="hero-title leading-none mb-5 shimmer-text"
            style={{
              fontSize: "clamp(3.5rem, 8vw, 8rem)",
              fontFamily: "'Red Hat Display', sans-serif",
              fontWeight: 800,
              letterSpacing: "-1px",
            }}
          >
            ValuerBot
          </h1>

          <p
            className="hero-body text-gray-500 max-w-md mx-auto leading-relaxed text-left"
            style={{ fontSize: "clamp(0.9rem, 1.1vw, 1.05rem)" }}
          >
            A platform for accurate property valuations and tax assessments.
            Access reliable data with confidence and transparency.
          </p>
        </div>

        <div
          className="grid grid-cols-4 gap-5 w-full"
          style={{ height: "clamp(260px, 38vh, 420px)" }}
        >
          {cards.map(
            ({ href, label, sublabel, icon: Icon, img, accent }, i) => (
              <a
                key={href}
                href={href}
                ref={(el) => (cardRefs.current[i] = el)}
                className="home-card relative rounded-3xl overflow-hidden shadow-xl cursor-pointer block"
              >
                <img
                  src={img}
                  alt={label}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div
                  className="card-overlay absolute inset-0 opacity-0"
                  style={{
                    background: `linear-gradient(to top, ${accent}55 0%, transparent 60%)`,
                  }}
                />

                <div
                  className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: accent }}
                  />
                  <span className="text-white text-[10px] uppercase tracking-widest">
                    {sublabel}
                  </span>
                </div>

                <div
                  className="card-btn absolute bottom-4 left-4 right-4 flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, #297d18, ${accent})`,
                    }}
                  >
                    <Icon style={{ fontSize: "1.4rem", color: "#fff" }} />
                  </div>

                  <div>
                    <p className="text-[#1a4d0f] font-semibold text-sm m-0">
                      {label}
                    </p>
                    <p className="text-gray-400 text-[11px] m-0">{sublabel}</p>
                  </div>
                </div>
              </a>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
