import { QRCode } from 'react-qr-code';
import Button from '../../../components/Button';
import DataCard from '../../../components/DataCard';

const DetailsTab = ({
  displayData,
  originalData,
  isVerified,
  isPaid,
  handlePayTax,
  userRole,
  newOwnerAddress,
  setNewOwnerAddress,
  newOwnerNic,
  setNewOwnerNic,
  openStampDutyModal,
  handleWithdrawTransfer,
  withdrawProcessing,
  transferStatus,
  transferTxHash,
  transferError,
  transferLockedByTax,
  transferLockedByLoan,
  isCorrupted,
  isSimulating,
  simulateCorruption,
  resetData,
  logs,
  history,
  deedRef,
  isDownloadingPDF,
  downloadDeedPDF,
  ethers,
}) => (
  <>
    {/* PROPERTY DETAILS CARD */}
    <div
      className={`
        rounded-xl border-2 mb-8 transition-all duration-300 overflow-hidden shadow-lg
        ${isVerified ? 'bg-white border-green-200' : 'bg-gradient-to-br from-green-50 to-green-50 border-green-400'}
      `}
    >
      <div
        className={`px-6 py-4 border-b-2 ${
          isVerified ? 'bg-green-50 border-green-200' : 'bg-green-200 border-green-400'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-green-900 flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Property Information
          </h3>
          {!isVerified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-700 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Data Tampered
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DataCard label="Property ID" value={displayData.id} variant="default" />
          <DataCard label="Building Age" value={`${displayData.buildingAge} years`} variant="default" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <DataCard
            label="Assessed Value"
            value={`LKR ${parseInt(displayData.value).toLocaleString()}`}
            variant={isVerified ? 'primary' : 'warning'}
            className={!isVerified ? 'ring-2 ring-green-400' : ''}
          />
          <div
            className={`
              p-5 rounded-lg border-2 shadow-sm transition-all
              ${isVerified ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200' : 'bg-green-200 border-green-500 ring-2 ring-green-500 animate-pulse'}
            `}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">Annual Tax</p>
                <p className="text-2xl font-bold text-emerald-700">
                  LKR {parseInt(displayData.tax).toLocaleString()}
                </p>
                <div className="mt-2">
                  {isPaid ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full border border-green-300">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Tax Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-100 text-lime-800 text-xs font-bold rounded-full border border-lime-300">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Tax Unpaid
                    </span>
                  )}
                </div>
              </div>

              {isVerified && !isPaid && (
                <button
                  onClick={handlePayTax}
                  className="px-4 py-2 bg-gradient-to-r from-lime-600 to-green-700 hover:from-lime-700 hover:to-green-800 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Pay Tax
                </button>
              )}
            </div>
            {!isVerified && (
              <div className="mt-2 flex items-center gap-1.5 text-green-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-bold">Value has been altered!</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
          <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wider">Owner Wallet Address</p>
          <p className="text-sm font-mono text-green-800 break-all bg-white px-3 py-2 rounded border border-green-200">
            {displayData.owner}
          </p>
        </div>

        <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-6">
          <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wider">Legal Title Checks</p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-medium text-green-700">Encumbrance Status:</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                displayData.hasBankLoan ? 'bg-green-100 text-green-800 border-green-300' : 'bg-green-100 text-green-800 border-green-300'
              }`}
            >
              {displayData.hasBankLoan ? 'Mortgaged' : 'Clear'}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-lg border-2 border-green-200 bg-green-50 mb-6">
          <h4 className="text-lg font-bold text-green-900 mb-2">Legal Land Transfer</h4>
          <p className="text-sm text-green-800 mb-4">
            Current Role: <span className="font-bold">{userRole === 'owner' ? 'Property Owner' : 'Council Officer'}</span>
          </p>

          {userRole === 'owner' && (
            <>
              <label className="block text-sm font-semibold text-green-700 mb-1.5">New Owner Wallet Address</label>
              <input
                type="text"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800 placeholder-green-400 mb-3"
              />

              <label className="block text-sm font-semibold text-green-700 mb-1.5">Or New Owner NIC</label>
              <input
                type="text"
                value={newOwnerNic}
                onChange={(e) => setNewOwnerNic(e.target.value)}
                placeholder="e.g., 199512345678 or 945671234V"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-green-800 placeholder-green-400 mb-3"
              />

              <button
                onClick={openStampDutyModal}
                disabled={
                  !isVerified ||
                  transferLockedByTax ||
                  transferLockedByLoan ||
                  displayData.hasPendingTransfer ||
                  (!ethers.isAddress(newOwnerAddress || '') && !newOwnerNic.trim())
                }
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all"
              >
                Submit Transfer Request
              </button>

              {displayData.hasPendingTransfer && (
                <button
                  onClick={handleWithdrawTransfer}
                  disabled={withdrawProcessing}
                  className="mt-3 w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 disabled:from-green-300 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all"
                >
                  {withdrawProcessing ? 'Withdrawing Request...' : 'Withdraw Pending Request'}
                </button>
              )}

              {transferLockedByTax && (
                <p className="mt-3 text-sm font-semibold text-green-700">
                  ⚠ Transfer Locked: Outstanding municipal taxes must be cleared before ownership transfer.
                </p>
              )}
              {transferLockedByLoan && (
                <p className="mt-2 text-sm font-semibold text-green-700">
                  ⚠ Transfer Locked: Encumbrance must be cleared before ownership transfer.
                </p>
              )}
            </>
          )}

          {userRole === 'officer' && (
            <div className="w-full sm:w-auto px-4 py-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm font-semibold">
              Council review actions are handled from the Council Dashboard queue.
            </div>
          )}

          {displayData.hasPendingTransfer && (
            <p className="mt-3 text-sm font-semibold text-lime-700">Transfer Status: Pending Council Approval</p>
          )}

          {transferStatus && <p className="mt-2 text-sm font-semibold text-green-800">{transferStatus}</p>}

          {transferTxHash && (
            <p className="mt-2 text-xs font-mono text-green-600 break-all">TxHash: {transferTxHash}</p>
          )}

          {transferError && <p className="mt-2 text-sm font-semibold text-green-700">{transferError}</p>}
        </div>

        <div className="p-5 bg-gradient-to-br from-green-900 to-green-950 rounded-lg shadow-md">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-300 text-sm mb-1">Blockchain Integrity Hash (SHA-256)</p>
              <code className="block bg-green-950 text-green-300 px-4 py-3 rounded font-mono text-xs break-all border border-green-800">
                {originalData.hash}
              </code>
            </div>
          </div>
          <p className="text-xs text-green-400 leading-relaxed">
            This cryptographic signature proves the authenticity of the data. Any modification
            to the tax amount will cause a hash mismatch, instantly exposing corruption.
          </p>
        </div>
      </div>
    </div>

    {/* CORRUPTION DEMO CONTROLS */}
    <div className="bg-gradient-to-br from-green-50 to-green-50 rounded-xl border-2 border-green-400 overflow-hidden mb-8 shadow-lg">
      <div className="bg-green-700 px-6 py-3 border-b-2 border-green-800">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-lg font-bold text-white uppercase tracking-wide">Corruption Detection Test</h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 bg-green-200 p-3 rounded-lg">
            <svg className="w-8 h-8 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-green-700 leading-relaxed mb-4">
              Click the button below to simulate a malicious database hack. The system will
              immediately detect the tampering through hash verification
            </p>
            <div className="flex gap-3 flex-wrap">
              <Button onClick={simulateCorruption} disabled={isCorrupted || isSimulating} variant="danger">
                <span className="flex items-center gap-2">
                  {isSimulating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running Diagnostic...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Simulate Database Hack
                    </>
                  )}
                </span>
              </Button>
              {isCorrupted && (
                <Button onClick={resetData} variant="primary">
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restore Original Data
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* LIVE INTEGRITY LOG - Diagnostic Console */}
    {logs.length > 0 && (
      <div className="bg-gradient-to-br from-green-900 to-green-950 rounded-xl border-2 border-green-700 overflow-hidden mb-8 shadow-2xl">
        <div className="bg-gradient-to-r from-green-800 to-green-900 px-6 py-3 border-b-2 border-green-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-lime-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-green-400 font-mono text-sm font-bold">INTEGRITY-DIAGNOSTIC-TERMINAL</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSimulating && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded border border-green-500/50">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                RUNNING
              </span>
            )}
            {!isSimulating && isCorrupted && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 text-xs font-mono rounded border border-green-500/50">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                CORRUPTION DETECTED
              </span>
            )}
          </div>
        </div>

        <div className="p-4 bg-black/50 backdrop-blur-sm max-h-96 overflow-y-auto">
          <div className="space-y-1 font-mono text-sm">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`
                  flex items-start gap-2 py-1 animate-fadeIn
                  ${log.type === 'error' ? 'text-green-400' : ''}
                  ${log.type === 'success' ? 'text-green-400' : ''}
                  ${log.type === 'warning' ? 'text-lime-400' : ''}
                  ${log.type === 'info' ? 'text-cyan-400' : ''}
                `}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                <span className="text-green-500 select-none">{String(index + 1).padStart(3, '0')}</span>
                <span className="text-green-600 select-none">│</span>
                <span className="flex-1 break-all">{log.text}</span>
              </div>
            ))}
            {isSimulating && (
              <div className="flex items-center gap-2 py-2 text-green-400">
                <span className="text-green-500 select-none">{String(logs.length + 1).padStart(3, '0')}</span>
                <span className="text-green-600 select-none">│</span>
                <span className="animate-pulse">▊</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-900 border-t border-green-700 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-green-500">
              Lines: <span className="text-green-400">{logs.length}</span>
            </span>
            <span className="text-green-500">
              Status:
              <span className={isCorrupted ? 'text-green-400 ml-1' : 'text-green-400 ml-1'}>
                {isSimulating ? 'ANALYZING' : isCorrupted ? 'COMPROMISED' : 'IDLE'}
              </span>
            </span>
          </div>
          <div className="text-xs font-mono text-green-500">BlockchainIntegrityMonitor v1.0.0</div>
        </div>
      </div>
    )}

    {/* AUDIT TRAIL */}
    {history.length > 0 && (
      <div className="mt-8">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-300 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-green-800 to-green-900 px-6 py-5 border-b-2 border-green-900">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Immutable Audit Trail</h3>
                  <p className="text-green-200 text-sm">
                    Complete history of all valuation changes recorded on blockchain
                  </p>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border-2 border-white/30">
                <p className="text-2xl font-bold text-white">{history.length}</p>
                <p className="text-xs text-green-200 uppercase tracking-wide">
                  {history.length === 1 ? 'Record' : 'Records'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {history.map((record, index) => (
              <div
                key={record.id}
                className={`
                  rounded-xl border-2 transition-all duration-200 overflow-hidden
                  ${index === 0 ? 'border-green-500 shadow-lg shadow-green-100' : 'border-green-200 hover:border-green-300 hover:shadow-md'}
                `}
              >
                <div
                  className={`
                    px-5 py-3 flex items-center justify-between flex-wrap gap-3
                    ${index === 0 ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-green-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                        ${index === 0 ? 'bg-green-700 text-white' : 'bg-green-300 text-green-700'}
                      `}
                    >
                      {history.length - index}
                    </div>
                    {index === 0 && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-700 text-white text-xs font-bold rounded-full">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Current Record
                      </span>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-green-300">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span className="text-xs font-mono font-semibold text-green-700">Block #{record.blockNumber}</span>
                  </span>
                </div>

                <div className="p-5 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs font-semibold text-green-500 mb-1.5 uppercase tracking-wider">Assessed Value</p>
                      <p className="text-xl font-bold text-green-900">
                        LKR {parseInt(record.value).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-500 mb-1.5 uppercase tracking-wider">Tax Amount</p>
                      <p className="text-xl font-bold text-emerald-700">
                        LKR {parseInt(record.tax).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-500 mb-1.5 uppercase tracking-wider">Building Age</p>
                      <p className="text-xl font-bold text-green-700">{record.buildingAge} years</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-lime-50 border-t-2 border-lime-300 p-5">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-lime-600 p-2 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-lime-900 mb-1"></p>
                <p className="text-sm text-lime-800 leading-relaxed">
                  This audit trail is permanently recorded on the blockchain and cannot be deleted or modified.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* QR CODE VERIFICATION SECTION - Only shown when data is verified */}
    {isVerified && (
      <div className="mt-8">
        <div ref={deedRef} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border-2 border-emerald-400 overflow-hidden shadow-xl">
          <div className="bg-gradient-to-r from-emerald-700 to-green-700 px-6 py-4 border-b-2 border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Digital Property Deed (QR Code)</h3>
                <p className="text-emerald-100 text-sm">
                  Verified authenticity - Generated only for blockchain-verified data
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-6 rounded-xl border-2 border-emerald-500 shadow-lg">
                  <QRCode
                    value={`PropertyID:${displayData.id} | Tax:${displayData.tax} | Status:Verified`}
                    size={220}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                <p className="mt-3 text-xs text-emerald-800 font-bold uppercase tracking-wide">Scan to Verify</p>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-emerald-300">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Encoded Data</p>
                  </div>
                  <code className="block text-sm font-mono text-green-800 bg-green-50 p-3 rounded border border-green-200 break-all">
                    PropertyID:{displayData.id} | Tax:{displayData.tax} | Status:Verified
                  </code>
                </div>

                <div className="bg-lime-50 p-4 rounded-lg border-2 border-lime-400">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-lime-600 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-lime-900 mb-1"></p>
                      <p className="text-sm text-lime-800 leading-relaxed">
                        This QR code serves as a digital property deed that can be scanned by banks, notaries,
                        or property buyers to instantly verify authenticity.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Download PDF Button ── */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={downloadDeedPDF}
            disabled={isDownloadingPDF}
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-700 to-green-700 hover:from-emerald-800 hover:to-green-800 disabled:from-emerald-400 disabled:to-green-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-sm"
          >
            {isDownloadingPDF ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating PDF...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Official Deed (PDF)
              </>
            )}
          </button>
        </div>
      </div>
    )}
  </>
);

export default DetailsTab;
