import Logo from "/Images/valuerBot-logo.png";

const Footer = () => {
  const techStack = [
    { category: "Frontend", items: ["React", "Tailwind CSS", "MUI"] },
    { category: "Mapping", items: ["Leaflet", "OSMNX"] },
    { category: "Backend", items: ["Python", "FastAPI", "SQLite"] },
  ];

  const links = ["Home", "Valuation", "Tax Point", "Market Trends", "Zone Map"];

  return (
    <footer className="relative overflow-hidden">
      <div
        className="h-1 w-full"
        style={{
          background:
            "linear-gradient(90deg,#2A9B3D 0%,#57C785 50%,#53ED72 100%)",
        }}
      />

      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg,#0f2d1a 0%,#1a4d2a 45%,#0d2318 100%)",
        }}
      />

      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle,#4ade80 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        className="absolute top-0 right-[15%] w-96 h-96 rounded-full -z-10 opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle,#22c55e,transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-[5%] w-64 h-64 rounded-full -z-10 opacity-10 blur-3xl"
        style={{
          background: "radial-gradient(circle,#15d655,transparent 70%)",
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-14">
          <div className="flex flex-col gap-5">
            <img
              src={Logo}
              alt="ValuerBot Logo"
              className="w-44 object-contain"
            />

            <p className="text-green-200/70 text-sm leading-relaxed max-w-xs">
              The official platform for accurate property valuations and tax
              assessments in Sri Lanka.
            </p>

            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full w-fit"
              style={{
                background: "rgba(74,222,128,0.08)",
                border: "0.5px solid rgba(74,222,128,0.2)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-xs font-medium tracking-wider uppercase">
                Final Year Research Project
              </span>
            </div>

            <div>
              <p className="text-green-400/60 text-[11px] uppercase tracking-widest mb-2">
                Contributors
              </p>
              <div className="flex flex-wrap gap-2">
                {["Name 1", "Name 2", "Name 3", "Name 4"].map((name) => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full text-green-200 text-xs font-medium"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "0.5px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-green-400/60 text-[11px] uppercase tracking-widest mb-5">
              Navigation
            </p>
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href={`/${link.toLowerCase().replace(" ", "-")}`}
                    className="group flex items-center gap-2 text-green-100/70 text-sm no-underline transition-colors duration-200 hover:text-green-300"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-green-400 transition-all duration-300 ease-out" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {techStack.map(({ category, items }) => (
            <div key={category}>
              <p className="text-green-400/60 text-[11px] uppercase tracking-widest mb-5">
                {category}
              </p>
              <ul className="flex flex-col gap-3 list-none p-0 m-0">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-green-100/70 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="w-full h-px mb-8"
          style={{
            background:
              "linear-gradient(90deg,transparent,rgba(74,222,128,0.25),transparent)",
          }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-200/40 text-xs m-0">
            &copy; {new Date().getFullYear()} ValuerBot Project. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400/50 text-xs">
              Built with React &amp; FastAPI
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
