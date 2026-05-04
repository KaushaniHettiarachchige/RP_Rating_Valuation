const CouncilHeader = () => (
  <div className="mb-8 pb-6 border-b-2 border-green-100">
    <div className="flex items-start gap-4 mb-3">
      <div className="bg-gradient-to-br from-lime-100 to-green-100 p-3 rounded-xl">
        <svg className="w-8 h-8 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-green-900 mb-2">
          Automated Valuation Engine
        </h2>
        <p className="text-green-600 leading-relaxed">
          Input property details. The system will automatically calculate tax using the multi-criteria
          algorithm and record it on the blockchain.
        </p>
      </div>
    </div>
  </div>
);

export default CouncilHeader;
