const HistoryTab = ({ timelineEvents, getEventConfig }) => (
  <div>
    {/* Header */}
    <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
      <div className="flex items-center gap-4">
        <div className="bg-gradient-to-br from-emerald-100 to-emerald-100 p-3 rounded-2xl shadow-sm">
          <svg className="w-7 h-7 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-green-900">Immutable Audit Trail</h3>
          <p className="text-green-500 text-sm mt-0.5">
            Every on-chain event sealed permanently • Tamper-proof • Cannot be deleted
          </p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-md">
        {timelineEvents.length} {timelineEvents.length === 1 ? 'Event' : 'Events'} Found
      </div>
    </div>

    {timelineEvents.length === 0 ? (
      <div className="text-center py-16 bg-green-50 rounded-2xl border-2 border-dashed border-green-300">
        <svg className="w-14 h-14 mx-auto text-green-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-semibold text-green-400">No historical events found for this property.</p>
      </div>
    ) : (
      <div className="relative">
        {/* Vertical spine */}
        <div className="absolute left-[1.65rem] top-5 bottom-12 w-0.5 bg-gradient-to-b from-green-400 via-emerald-400 to-emerald-400 opacity-40 rounded-full" />

        <div className="space-y-6">
          {timelineEvents.map((event, idx) => {
            const cfg = getEventConfig(event.type);
            return (
              <div key={idx} className="relative pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-3 top-5 w-6 h-6 ${cfg.dotColor} rounded-full ring-4 ${cfg.ringColor} shadow-md flex items-center justify-center z-10`}>
                  <span className="text-white text-xs font-bold leading-none">{timelineEvents.length - idx}</span>
                </div>

                {/* Event card */}
                <div className={`rounded-2xl border-2 ${cfg.cardBorder} bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200`}>
                  {/* Card header */}
                  <div className={`px-5 py-3 ${cfg.headerBg} border-b ${cfg.headerBorder} flex items-center justify-between flex-wrap gap-2`}>
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none" role="img" aria-label={cfg.title}>{cfg.icon}</span>
                      <span className={`font-bold text-base ${cfg.textColor}`}>{cfg.title}</span>
                      {idx === 0 && (
                        <span className="px-2.5 py-0.5 bg-white/80 text-green-700 text-xs font-bold rounded-full border border-green-300 shadow-sm">
                          Latest
                        </span>
                      )}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-mono font-semibold ${cfg.badge}`}>
                      Block #{event.blockNumber}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-5">
                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-green-500 text-sm mb-4">
                      <svg className="w-4 h-4 flex-shrink-0 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{event.timestamp}</span>
                    </div>

                    {/* ── PropertyRegistered details ── */}
                    {event.type === 'PropertyRegistered' && (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-200 mb-4">
                        <p className="text-xs text-green-600 font-bold mb-2 uppercase tracking-wider">Initial Owner Wallet</p>
                        <p className="font-mono text-sm text-green-800 break-all">{event.details.owner}</p>
                      </div>
                    )}

                    {/* ── ValuationUpdated details ── */}
                    {event.type === 'ValuationUpdated' && (
                      <div className="mb-4">
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
                            <p className="text-xs text-emerald-600 font-bold mb-1 uppercase tracking-wide">Assessed Value</p>
                            <p className="font-bold text-green-800 text-sm">LKR {parseInt(event.details.value).toLocaleString()}</p>
                          </div>
                          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 text-center">
                            <p className="text-xs text-emerald-600 font-bold mb-1 uppercase tracking-wide">Tax Amount</p>
                            <p className="font-bold text-green-800 text-sm">LKR {parseInt(event.details.tax).toLocaleString()}</p>
                          </div>
                          <div className="bg-green-50 rounded-xl p-3 border border-green-200 text-center">
                            <p className="text-xs text-green-500 font-bold mb-1 uppercase tracking-wide">Building Age</p>
                            <p className="font-bold text-green-800 text-sm">{event.details.buildingAge} yrs</p>
                          </div>
                        </div>
                        {event.details.docHash && (
                          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                            <p className="text-xs text-green-500 font-bold uppercase tracking-wide mb-1">Document Hash (SHA-256)</p>
                            <p className="font-mono text-xs text-green-700 break-all">{event.details.docHash}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ── TaxPaid details ── */}
                    {event.type === 'TaxPaid' && (
                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mb-4 flex items-start gap-3">
                        <div className="flex-shrink-0 bg-emerald-600 rounded-full p-1.5 mt-0.5">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-emerald-800 mb-1">Tax obligation fulfilled on blockchain</p>
                          <p className="text-xs text-emerald-600 font-semibold mb-1.5 uppercase tracking-wide">Authorized by (Council Wallet):</p>
                          <p className="font-mono text-xs text-green-700 break-all">{event.details.payer}</p>
                        </div>
                      </div>
                    )}

                    {/* ── TransferRequested details ── */}
                    {event.type === 'TransferRequested' && (
                      <div className="mb-4 space-y-2">
                        <div className="bg-lime-50 rounded-xl p-3 border border-lime-200 flex items-center gap-3">
                          <span className="bg-lime-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">By</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.requestedBy}</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-3">
                          <span className="bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">To</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.proposedNewOwner}</p>
                        </div>
                      </div>
                    )}

                    {event.type === 'TransferRejected' && (
                      <div className="mb-4">
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-3">
                          <span className="bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">By</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.rejectedBy}</p>
                        </div>
                      </div>
                    )}

                    {event.type === 'TransferWithdrawn' && (
                      <div className="mb-4">
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-3">
                          <span className="bg-green-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">By</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.withdrawnBy}</p>
                        </div>
                      </div>
                    )}

                    {/* ── OwnershipTransferred details ── */}
                    {event.type === 'OwnershipTransferred' && (
                      <div className="mb-4 space-y-2">
                        <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex items-center gap-3">
                          <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">From</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.from}</p>
                        </div>
                        <div className="flex justify-center">
                          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200 flex items-center gap-3">
                          <span className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide flex-shrink-0">To</span>
                          <p className="font-mono text-xs text-green-800 break-all">{event.details.to}</p>
                        </div>
                      </div>
                    )}

                    {/* TxHash proof */}
                    <div className="flex items-start gap-3 bg-green-900 rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-green-400 font-bold uppercase tracking-wider mb-1">
                          Transaction Hash — Immutability Proof
                        </p>
                        <code className="text-xs text-cyan-400 font-mono break-all leading-relaxed">
                          {event.txHash}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Genesis marker */}
        <div className="relative pl-16 mt-6">
          <div className="absolute left-3 top-2.5 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center ring-4 ring-green-100 shadow-sm z-10">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="bg-green-100 rounded-2xl border-2 border-dashed border-green-300 px-5 py-3">
            <p className="text-xs text-green-500 font-semibold">⛓ Chain Origin — All records above are cryptographically sealed</p>
          </div>
        </div>
      </div>
    )}

    {/* Immutability notice footer */}
    <div className="mt-8 flex items-start gap-4 bg-lime-50 rounded-2xl border-2 border-lime-300 p-5 shadow-sm">
      <div className="flex-shrink-0 bg-lime-600 p-2.5 rounded-xl shadow-sm">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-bold text-lime-900 mb-1">Tamper-Proof Permanent Record</p>
        <p className="text-sm text-lime-800 leading-relaxed">
          This audit trail is permanently sealed on the Ethereum blockchain. Each transaction hash is a
          cryptographic fingerprint proving the event occurred at that exact block. No authority — including
          the Municipal Council — can delete, alter, or reorder any entry in this immutable ledger.
        </p>
      </div>
    </div>
  </div>
);

export default HistoryTab;
