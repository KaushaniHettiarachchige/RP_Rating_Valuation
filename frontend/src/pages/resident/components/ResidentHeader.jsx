const ResidentHeader = () => (
  <div className="mb-8 pb-6 border-b-2 border-green-100">
    <div className="flex items-start gap-4 mb-3">
      <div className="bg-gradient-to-br from-green-100 to-green-200 p-3 rounded-xl shadow-sm">
        <svg className="w-8 h-8 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-green-900 mb-2">
          Property Verification & Integrity Check
        </h2>
        <p className="text-green-600 leading-relaxed">
          Enter your Property ID to verify the official valuation against blockchain records and test the corruption detection system.
        </p>
      </div>
    </div>
  </div>
);

export default ResidentHeader;
