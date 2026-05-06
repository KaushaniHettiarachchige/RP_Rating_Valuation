const TransferHeader = () => (
  <div className="mb-8 pb-6 border-b-2 border-green-100">
    <div className="flex items-start gap-4 mb-3">
      <div className="bg-gradient-to-br from-emerald-100 to-emerald-100 p-3 rounded-xl">
        <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      </div>
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-green-900 mb-2">Transfer Property Ownership</h2>
        <p className="text-green-600 leading-relaxed">
          Transfer property title to a new owner. <span className="font-bold text-lime-700">Note:</span> Tax must be paid before transfer can proceed (Transaction Integrity Check).
        </p>
      </div>
    </div>
  </div>
);

export default TransferHeader;
