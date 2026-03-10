const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 border-b-4 border-blue-600 shadow-xl">
      <div className="w-full px-6 py-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <span className="text-5xl">🏛️</span>
          </div>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
             Rating Valuation System
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-1 w-12 bg-blue-400 rounded-full"></div>
              <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider">
                 Sri Jayewardenepura Kotte Municipal Council
              </p>
              <div className="h-1 w-12 bg-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-300 text-sm max-w-3xl mx-auto">
         
        </p>
      </div>
    </header>
  );
};

export default Header;
