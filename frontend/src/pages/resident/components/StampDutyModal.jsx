const StampDutyModal = ({
  showStampDutyModal,
  displayData,
  transferProcessing,
  setShowStampDutyModal,
  stampDutyAmount,
  totalTransferPayable,
  newOwnerAddress,
  stampDutyPaid,
  simulateStampDutyPayment,
  handleRequestTransfer,
}) => {
  if (!showStampDutyModal || !displayData) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
        <div className="bg-gradient-to-r from-emerald-700 to-green-900 px-6 py-5 border-b-2 border-emerald-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">Stamp Duty & Transfer</h3>
              <p className="text-emerald-100 text-xs">Legal pre-check before transfer request</p>
            </div>
            {!transferProcessing && (
              <button
                onClick={() => setShowStampDutyModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-600">Property Value</p>
              <p className="text-lg font-bold text-green-900">LKR {Number(displayData.value).toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-green-600">Government Stamp Duty (4%)</p>
              <p className="text-lg font-bold text-lime-700">LKR {stampDutyAmount.toLocaleString()}</p>
            </div>
            <div className="border-t border-green-300 pt-2 flex items-center justify-between">
              <p className="text-sm font-semibold text-green-700">Total Payable</p>
              <p className="text-xl font-extrabold text-green-800">LKR {totalTransferPayable.toLocaleString()}</p>
            </div>
          </div>

          <div className="rounded-lg border border-green-200 bg-green-50 p-3">
            <p className="text-xs text-green-800 font-semibold">Proposed New Owner</p>
            <p className="text-xs font-mono text-green-700 break-all mt-1">{newOwnerAddress}</p>
          </div>

          {!stampDutyPaid ? (
            <button
              type="button"
              onClick={simulateStampDutyPayment}
              disabled={transferProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-lime-600 to-green-700 hover:from-lime-700 hover:to-green-800 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all"
            >
              {transferProcessing ? 'Processing Stamp Duty Payment...' : 'Pay Stamp Duty (Simulated)'}
            </button>
          ) : (
            <div className="rounded-lg border border-green-300 bg-green-50 p-3">
              <p className="text-sm font-bold text-green-800">Stamp duty paid. You can now submit transfer request.</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleRequestTransfer}
            disabled={!stampDutyPaid || transferProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg transition-all"
          >
            {transferProcessing ? 'Submitting Transfer Request...' : 'Submit Transfer Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StampDutyModal;
