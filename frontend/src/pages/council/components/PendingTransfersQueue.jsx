import Button from '../../../components/Button';
import Alert from '../../../components/Alert';

const PendingTransfersQueue = ({
  pendingTransfers,
  pendingLoading,
  pendingError,
  loadPendingTransfers,
  approvalLoading,
  handleApproveTransfer,
  handleRejectTransfer,
  approvalStatus,
}) => (
  <div className="mt-8 p-6 rounded-xl border-2 border-emerald-200 bg-emerald-50">
    <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
      <div className="flex items-start gap-3">
        <div className="bg-emerald-600 p-2 rounded-lg flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-900 mb-1">Council Review Queue</p>
          <p className="text-sm text-emerald-800 leading-relaxed">
            Review pending transfer requests below and approve or reject each case directly.
          </p>
        </div>
      </div>
      <Button type="button" onClick={loadPendingTransfers} variant="primary" className="px-4 py-2">
        Refresh Queue
      </Button>
    </div>

    {pendingError && (
      <Alert type="error">
        <p className="font-semibold">{pendingError}</p>
      </Alert>
    )}

    {pendingLoading ? (
      <p className="text-sm text-emerald-900 font-semibold">Loading pending requests...</p>
    ) : pendingTransfers.length === 0 ? (
      <p className="text-sm text-green-700">No pending transfer requests in the queue.</p>
    ) : (
      <div className="space-y-3">
        {pendingTransfers.map((item) => (
          <div key={item.propertyId} className="bg-white rounded-lg border border-emerald-200 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-green-500 font-semibold">Property ID</p>
                <p className="text-lg font-bold text-emerald-800">#{item.propertyId}</p>
              </div>
              <div>
                <p className="text-xs text-green-500 font-semibold">Current Owner</p>
                <p className="text-xs font-mono text-green-700 break-all">{item.currentOwner}</p>
              </div>
              <div>
                <p className="text-xs text-green-500 font-semibold">Proposed New Owner</p>
                <p className="text-xs font-mono text-green-700 break-all">{item.proposedNewOwner}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <Button
                type="button"
                loading={approvalLoading}
                onClick={() => handleApproveTransfer(item.propertyId)}
                variant="council"
                className="px-4 py-2"
              >
                Approve
              </Button>
              <Button
                type="button"
                loading={approvalLoading}
                onClick={() => handleRejectTransfer(item.propertyId)}
                variant="danger"
                className="px-4 py-2"
              >
                Reject
              </Button>
              <span className="text-xs text-green-500">
                Requested at: {item.requestedAt ? new Date(item.requestedAt).toLocaleString() : 'N/A'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}

    {approvalStatus && (
      <div
        className={`mt-5 rounded-lg border-2 overflow-hidden ${approvalStatus.type === 'success' ? 'border-emerald-300 bg-white' : 'border-green-300 bg-white'}`}
      >
        <div
          className={`px-4 py-3 ${approvalStatus.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-green-600 text-white'}`}
        >
          <p className="font-bold">{approvalStatus.msg}</p>
        </div>
        {approvalStatus.type === 'success' && (
          <div className="p-4 text-sm text-green-700 space-y-1">
            <p>Property ID: #{approvalStatus.propertyId}</p>
            {approvalStatus.previousOwner && <p>Previous Owner: {approvalStatus.previousOwner}</p>}
            {approvalStatus.newOwner && <p>New Owner: {approvalStatus.newOwner}</p>}
            <p className="font-mono break-all">TxHash: {approvalStatus.txHash}</p>
          </div>
        )}
        {approvalStatus.type === 'error' && approvalStatus.details && (
          <div className="p-4 text-sm text-green-800">{approvalStatus.details}</div>
        )}
      </div>
    )}
  </div>
);

export default PendingTransfersQueue;
