import TransferHeader from './TransferHeader';
import TransferRequestForm from './TransferRequestForm';
import PendingTransfersQueue from './PendingTransfersQueue';
import TransferStatusPanel from './TransferStatusPanel';

const TransferSection = ({
  transferForm,
  setTransferForm,
  handleTransferSubmit,
  transferLoading,
  pendingTransfers,
  pendingLoading,
  pendingError,
  loadPendingTransfers,
  approvalLoading,
  handleApproveTransfer,
  handleRejectTransfer,
  approvalStatus,
  transferStatus,
  legalSummary,
  legalSummaryLoading,
  legalSummaryError,
  legalSummaryWarning,
}) => (
  <div className="mt-12 pt-8 border-t-2 border-green-200">
    <TransferHeader />

    <TransferRequestForm
      transferForm={transferForm}
      setTransferForm={setTransferForm}
      handleTransferSubmit={handleTransferSubmit}
      transferLoading={transferLoading}
    />

    <PendingTransfersQueue
      pendingTransfers={pendingTransfers}
      pendingLoading={pendingLoading}
      pendingError={pendingError}
      loadPendingTransfers={loadPendingTransfers}
      approvalLoading={approvalLoading}
      handleApproveTransfer={handleApproveTransfer}
      handleRejectTransfer={handleRejectTransfer}
      approvalStatus={approvalStatus}
    />

    <TransferStatusPanel
      transferStatus={transferStatus}
      transferForm={transferForm}
      legalSummary={legalSummary}
      legalSummaryLoading={legalSummaryLoading}
      legalSummaryError={legalSummaryError}
      legalSummaryWarning={legalSummaryWarning}
    />
  </div>
);

export default TransferSection;
