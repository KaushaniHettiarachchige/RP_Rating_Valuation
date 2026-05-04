import Alert from '../../../components/Alert';

const TransferStatusPanel = ({
  transferStatus,
  transferForm,
  legalSummary,
  legalSummaryLoading,
  legalSummaryError,
  legalSummaryWarning,
}) => {
  if (!transferStatus) return null;

  return (
    <div
      className={`
        mt-8 rounded-xl border-2 overflow-hidden transition-all
        ${
          transferStatus.type === 'success'
            ? 'border-emerald-400 shadow-lg shadow-emerald-100'
            : 'border-green-400 shadow-lg shadow-green-100 animate-pulse'
        }
      `}
    >
      <div
        className={`
          px-6 py-4 border-b-2
          ${transferStatus.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-700' : 'bg-gradient-to-r from-green-700 to-green-700 border-green-800'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            {transferStatus.type === 'success' ? (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{transferStatus.msg}</h3>
            {transferStatus.details && (
              <p className="text-sm text-white/90 mt-1">{transferStatus.details}</p>
            )}
          </div>
        </div>
      </div>

      {transferStatus.type === 'success' ? (
        <div className="bg-white p-6">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl border-2 border-emerald-300 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900">
                  {transferStatus.stage === 'pending' ? 'Transfer Pending Approval' : 'Transfer Complete!'}
                </h3>
                <p className="text-sm text-emerald-700">
                  {transferStatus.stage === 'pending'
                    ? 'Transfer request recorded. Await council approval to finalize ownership.'
                    : 'Property ownership updated on blockchain'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <p className="text-xs font-semibold text-green-600 mb-2">Property ID</p>
                <p className="text-2xl font-bold text-emerald-700">#{transferStatus.propertyId}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-xs font-semibold text-green-600 mb-2">Previous Owner</p>
                  <code className="block text-xs font-mono text-green-700 break-all">
                    {transferStatus.previousOwner}
                  </code>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-300">
                  <p className="text-xs font-semibold text-emerald-800 mb-2">New Owner</p>
                  <code className="block text-xs font-mono text-emerald-700 break-all">
                    {transferStatus.newOwner}
                  </code>
                </div>
              </div>
            </div>
          </div>

          {/* New Owner Wallet Credentials */}
          {transferStatus.newOwnerWallet && (
            <div className="bg-gradient-to-br from-emerald-50 to-lime-50 p-6 rounded-xl border-2 border-emerald-300 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-600 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-emerald-900">New Owner Wallet Generated</h3>
                  <p className="text-sm text-emerald-700">NIC: {transferStatus.newOwnerWallet.nic}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-200">
                  <p className="text-xs font-semibold text-emerald-900 mb-2">Wallet Address:</p>
                  <code className="block bg-emerald-900 text-emerald-100 px-4 py-3 rounded font-mono text-xs break-all">
                    {transferStatus.newOwnerWallet.address}
                  </code>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-xs font-semibold text-green-900 mb-2">🔑 Private Key (Keep Secret!):</p>
                  <code className="block bg-green-900 text-green-100 px-4 py-3 rounded font-mono text-xs break-all">
                    {transferStatus.newOwnerWallet.privateKey}
                  </code>
                </div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-green-900 to-green-800 p-5 rounded-lg">
            <p className="font-semibold text-emerald-400 text-sm mb-2">Transaction Hash:</p>
            <code className="block bg-green-950 text-emerald-400 px-4 py-3 rounded font-mono text-xs break-all border border-green-700">
              {transferStatus.txHash}
            </code>
            <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Block: #{transferStatus.blockNumber}</span>
            </div>
          </div>

          {/* AI Legal Title Summary Panel */}
          {(legalSummaryLoading || legalSummary || legalSummaryError) && (
            <div className="mt-6 bg-gradient-to-br from-emerald-50 to-emerald-50 rounded-xl border-2 border-emerald-300 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 px-5 py-3 flex items-center gap-3">
                <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-bold text-white text-sm">AI-Generated Legal Title Summary</p>
                  <p className="text-emerald-200 text-xs">Powered by Google Gemini · Municipal Registrar Format</p>
                </div>
              </div>

              <div className="p-5">
                {legalSummaryLoading && (
                  <div className="flex items-center gap-3 text-emerald-700">
                    <svg className="w-5 h-5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span className="text-sm italic">Drafting official legal summary via Gemini AI...</span>
                  </div>
                )}

                {legalSummary && !legalSummaryLoading && (
                  <div className="bg-white border border-emerald-200 rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <p className="text-green-800 leading-relaxed text-sm italic">&ldquo;{legalSummary}&rdquo;</p>
                    </div>
                    {legalSummaryWarning ? (
                      <div className="mt-3 pt-3 border-t border-lime-200 flex items-center gap-2 text-xs text-lime-600">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>{legalSummaryWarning}</span>
                      </div>
                    ) : (
                      <div className="mt-3 pt-3 border-t border-emerald-100 flex items-center gap-2 text-xs text-emerald-500">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span>Generated by Gemini · gemini-2.0-flash-lite · {new Date().toLocaleDateString('en-LK')}</span>
                      </div>
                    )}
                  </div>
                )}

                {legalSummaryError && !legalSummaryLoading && (
                  <div className="bg-lime-50 border border-lime-300 rounded-lg p-4 flex items-start gap-3">
                    <svg className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm font-semibold text-lime-900">Legal Summary Unavailable</p>
                      <p className="text-xs text-lime-800 mt-1">{legalSummaryError}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-green-50 to-green-50 p-6">
          {transferStatus.requiresPayment ? (
            <div className="space-y-4">
              {/* Primary tax-payment error banner */}
              <div className="flex items-start gap-4 bg-green-700 text-white p-5 rounded-xl border-2 border-green-800 shadow-md">
                <div className="bg-white/20 p-2 rounded-lg flex-shrink-0">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-extrabold tracking-tight">Tax Must Be Paid Before Land Transfer</p>
                  <p className="text-green-200 text-sm mt-1">
                    Property ID <span className="font-bold text-white">#{transferForm.propertyId}</span> has outstanding tax. The blockchain has blocked this transfer to protect ownership integrity.
                  </p>
                </div>
              </div>

              {/* Step-by-step instructions */}
              <div className="bg-white border-2 border-green-300 rounded-xl p-5">
                <p className="text-sm font-bold text-green-900 mb-3">🛡️ Transaction Integrity Protection Active — Next Steps:</p>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <p className="text-sm text-green-700">Navigate to the <span className="font-semibold text-green-800">Resident Portal</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <p className="text-sm text-green-700">Look up <span className="font-semibold text-green-800">Property ID: {transferForm.propertyId}</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <p className="text-sm text-green-700">Click the <span className="font-semibold text-green-800">"Pay Tax"</span> button and confirm payment</p>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="bg-green-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <p className="text-sm text-green-700">Return here and retry the ownership transfer</p>
                  </li>
                </ol>
              </div>
            </div>
          ) : (
            <Alert type="error">
              <p className="font-bold text-lg">{transferStatus.details}</p>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default TransferStatusPanel;
