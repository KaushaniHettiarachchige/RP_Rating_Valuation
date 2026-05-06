import Alert from '../../../components/Alert';

const AssessmentStatus = ({ status }) => {
  if (!status) return null;

  return (
    <div
      className={`
        mt-8 rounded-xl border-2 overflow-hidden transition-all
        ${
          status.type === 'success'
            ? 'border-emerald-400 shadow-lg shadow-emerald-100'
            : 'border-green-400 shadow-lg shadow-green-100'
        }
      `}
    >
      <div
        className={`
          px-6 py-4 border-b-2
          ${status.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-700' : 'bg-gradient-to-r from-green-600 to-green-600 border-green-700'}
        `}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
            {status.type === 'success' ? (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">{status.msg}</h3>
            {status.type === 'error' && status.details && (
              <p className="text-sm text-white/90 mt-1">{status.details}</p>
            )}
          </div>
        </div>
      </div>

      {status.type === 'success' && (
        <div className="bg-white p-6">
          {/* Generated Wallet Credentials */}
          <div className="bg-gradient-to-br from-emerald-50 to-lime-50 p-6 rounded-xl border-2 border-emerald-300 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-emerald-900">🎉 Digital Identity Generated!</h3>
                <p className="text-sm text-emerald-700">Custodial wallet created for property owner</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <p className="font-semibold text-emerald-900 text-sm">Generated Wallet Address:</p>
                </div>
                <code className="block bg-emerald-900 text-emerald-100 px-4 py-3 rounded font-mono text-xs break-all border border-emerald-700">
                  {status.walletAddress}
                </code>
                <p className="text-xs text-emerald-600 mt-2">✅ This address can receive property ownership tokens</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-300">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-emerald-900 text-sm">🔗 Transaction Hash:</p>
                </div>
                <code className="block bg-emerald-900 text-emerald-100 px-4 py-3 rounded font-mono text-xs break-all border border-emerald-700">
                  {status.txHash}
                </code>
                <p className="text-xs text-emerald-700 mt-2">
                  ✅ This hash uniquely identifies the blockchain transaction and can be used to verify the record.
                </p>
              </div>
            </div>
          </div>

          {/* Methodology Badge */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <div>
              <p className="font-bold text-lg">{status.methodology}</p>
              <p className="text-sm text-green-100">Statutory Framework Compliance</p>
            </div>
          </div>

          {/* Valuation Breakdown - Contractor's Test Method */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-bold text-green-900">Valuation Calculation Breakdown</p>
            </div>

            <div className="space-y-3">
              {/* Gross Construction Cost */}
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-600 mb-1">📐 Gross Construction Cost</p>
                    <p className="text-xs text-green-500 font-mono">
                      {status.algorithm.sqFt} sqft × {status.algorithm.constructionRate} LKR/sqft
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    {parseInt(status.algorithm.grossCost).toLocaleString()} LKR
                  </p>
                </div>
              </div>

              {/* Depreciation */}
              <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-900 font-semibold mb-1">📉 Depreciation Deduction</p>
                    <p className="text-xs text-green-700 font-mono">
                      {status.algorithm.buildingAge} years × 2% = {status.algorithm.depreciationPercentage}
                    </p>
                  </div>
                  <p className="text-xl font-bold text-green-700">
                    -{parseInt(status.algorithm.depreciationAmount).toLocaleString()} LKR
                  </p>
                </div>
              </div>

              <div className="h-px bg-green-300 my-2"></div>

              {/* Effective Capital Value */}
              <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-emerald-900 font-semibold mb-1">🏗️ Effective Capital Value (ECV)</p>
                    <p className="text-xs text-emerald-700 font-mono">Gross Cost - Depreciation</p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {parseInt(status.val).toLocaleString()} LKR
                  </p>
                </div>
              </div>

              {/* Annual Value */}
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-300">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-emerald-900 font-semibold mb-1">📊 Annual Value</p>
                    <p className="text-xs text-emerald-700 font-mono">
                      ECV × {status.algorithm.decapitalizationRate} (Decapitalization Rate)
                    </p>
                  </div>
                  <p className="text-xl font-bold text-emerald-700">
                    {parseInt(status.annualValue).toLocaleString()} LKR
                  </p>
                </div>
              </div>

              <div className="h-px bg-green-300 my-2"></div>

              {/* Tax Payable */}
              <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-400">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-emerald-900 font-semibold mb-1">💰 Tax Payable</p>
                    <p className="text-xs text-emerald-700 font-mono">
                      Annual Value × {status.algorithm.taxRate}
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-emerald-700">
                    {parseInt(status.tax).toLocaleString()} LKR
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900 to-green-800 p-5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-emerald-500/20 p-2 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <p className="font-semibold text-emerald-400 text-sm">Transaction Hash:</p>
            </div>
            <code className="block bg-green-950 text-emerald-400 px-4 py-3 rounded font-mono text-xs break-all border border-green-700">
              {status.txHash}
            </code>
            <div className="mt-3 flex items-center gap-2 text-green-400 text-xs">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Block: #{status.blockNumber}</span>
            </div>
          </div>
        </div>
      )}

      {status.type === 'error' && (
        <div className="bg-gradient-to-br from-green-50 to-green-50 p-6">
          <Alert type="error">
            <p className="font-semibold mb-2">Transaction Failed</p>
            <p className="text-sm">{status.details || 'Please check the console for more details.'}</p>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AssessmentStatus;
