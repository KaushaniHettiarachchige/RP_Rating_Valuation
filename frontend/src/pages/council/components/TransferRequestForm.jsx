import Button from '../../../components/Button';
import InputField from '../../../components/InputField';

const TransferRequestForm = ({ transferForm, setTransferForm, handleTransferSubmit, transferLoading }) => (
  <form onSubmit={handleTransferSubmit} className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputField
        label="Property ID"
        required
        type="number"
        placeholder="e.g., 101"
        value={transferForm.propertyId}
        onChange={(e) => setTransferForm({ ...transferForm, propertyId: e.target.value })}
        helper="Enter the property ID to transfer"
      />

      <InputField
        label="New Owner NIC"
        required
        placeholder="e.g., 199512345678 or 945671234V"
        value={transferForm.newOwnerNIC}
        onChange={(e) => setTransferForm({ ...transferForm, newOwnerNIC: e.target.value })}
        helper="National Identity Card of the new owner"
      />
    </div>

    <div className="bg-gradient-to-br from-lime-50 to-green-50 rounded-xl border-2 border-lime-300 p-5">
      <div className="flex items-start gap-3">
        <div className="bg-lime-600 p-2 rounded-lg flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-lime-900 mb-1">Transaction Integrity Protection</p>
          <p className="text-sm text-lime-800 leading-relaxed">
            This system prevents property transfers if taxes are unpaid. The blockchain will
            automatically reject the transaction..
          </p>
        </div>
      </div>
    </div>

    <Button type="submit" loading={transferLoading} variant="council" className="w-full py-5 text-lg">
      <span className="flex items-center justify-center gap-2">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        <span>{transferLoading ? 'Submitting Transfer Request...' : 'Submit Transfer Request'}</span>
      </span>
    </Button>
  </form>
);

export default TransferRequestForm;
