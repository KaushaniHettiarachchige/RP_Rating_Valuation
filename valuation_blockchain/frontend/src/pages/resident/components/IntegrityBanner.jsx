const IntegrityBanner = ({ isVerified }) => (
  <div
    className={`
      mb-8 p-6 rounded-xl border-2 transition-all duration-300
      ${
        isVerified
          ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-emerald-500 shadow-lg'
          : 'bg-gradient-to-r from-green-50 via-green-50 to-green-50 border-green-600 animate-pulse shadow-lg shadow-green-200'
      }
    `}
  >
    {isVerified ? (
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-emerald-600 rounded-full p-3 shadow-md">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-emerald-900 mb-1">✓ Data Integrity Verified</h3>
          <p className="text-emerald-800 font-medium">
            All property information matches the blockchain signature. No tampering detected.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-white px-5 py-3 rounded-lg border-2 border-emerald-500 shadow-sm">
            <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Status</p>
            <p className="text-lg font-bold text-emerald-900">Verified</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 bg-green-700 rounded-full p-3 animate-pulse shadow-md">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-green-900 mb-1">⚠ CRITICAL: Data Corruption Detected</h3>
          <p className="text-green-800 font-bold">
            SECURITY ALERT: The displayed data does not match the blockchain hash.
            Unauthorized modification detected!
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-green-700 px-5 py-3 rounded-lg border-2 border-green-800 shadow-md">
            <p className="text-xs text-green-100 font-bold uppercase tracking-wider">Status</p>
            <p className="text-lg font-bold text-white">TAMPERED</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default IntegrityBanner;
