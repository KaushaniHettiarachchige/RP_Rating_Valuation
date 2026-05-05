const PaymentModal = ({
  showPaymentModal,
  paymentStatus,
  paymentTxHash,
  closePaymentModal,
  handleRealTaxPayment,
  cardholderName,
  setCardholderName,
  cardNumber,
  setCardNumber,
  expiry,
  setExpiry,
  cvv,
  setCvv,
  displayData,
}) => {
  if (!showPaymentModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-900 px-6 py-5 border-b-2 border-green-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">GovPay Secure Gateway</h3>
                <p className="text-green-200 text-xs">Test Mode - System Integration Demo</p>
              </div>
            </div>
            {paymentStatus !== 'processing' && (
              <button onClick={closePaymentModal} className="text-white/80 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {paymentStatus === 'success' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-green-700 mb-2">✅ Payment Successful!</h4>
              <p className="text-green-600 mb-2">Tax payment recorded on the blockchain.</p>
              {paymentTxHash && (
                <p className="text-xs font-mono text-green-500 bg-green-100 rounded px-3 py-2 break-all">
                  TxHash: {paymentTxHash}
                </p>
              )}
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-green-700 mb-2">Payment Failed</h4>
              <p className="text-sm text-green-600">Please try again</p>
            </div>
          ) : paymentStatus === 'processing' ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                <svg className="w-12 h-12 text-green-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h4 className="text-xl font-bold text-green-800 mb-2">Recording payment on blockchain...</h4>
              <p className="text-sm text-green-600">Please wait while we verify your payment</p>
            </div>
          ) : (
            /* ── Stripe-style card form — calls real /pay-tax API ── */
            <form onSubmit={handleRealTaxPayment} className="space-y-4">
              {/* Amount banner */}
              <div className="bg-gradient-to-r from-lime-50 to-green-50 p-4 rounded-xl border-2 border-lime-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-lime-700 font-bold uppercase tracking-wider mb-1">
                      Tax Due — Property #{displayData?.id}
                    </p>
                    <p className="text-3xl font-bold text-lime-800">
                      LKR {parseInt(displayData?.tax || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-lime-100 p-3 rounded-full border border-lime-300">
                    <svg className="w-8 h-8 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-1.5">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800 placeholder-green-400"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-semibold text-green-700 mb-1.5">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="19"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800 placeholder-green-400 pr-16"
                    required
                  />
                  {/* Fake card brand icons */}
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                    <div className="w-8 h-5 bg-green-500 rounded opacity-80"></div>
                    <div className="w-8 h-5 bg-lime-400 rounded opacity-80 -ml-3"></div>
                  </div>
                </div>
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    maxLength="5"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800 placeholder-green-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-green-700 mb-1.5">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength="3"
                    className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800"
                    required
                  />
                </div>
              </div>

              {/* Security badge */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2.5">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-xs font-bold text-emerald-800">SSL Encrypted & Secure</p>
                  <p className="text-xs text-emerald-700">Payment recorded on blockchain — tamper-proof</p>
                </div>
              </div>

              {/* Confirm Payment button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-base"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm Payment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
