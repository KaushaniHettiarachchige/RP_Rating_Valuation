import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'https://esm.sh/ethers@6.11.1';
import { BACKEND_URL } from '../constants/config';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import DataCard from '../components/DataCard';
import Alert from '../components/Alert';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/config';

const CouncilDashboard = () => {
  const [form, setForm] = useState({ 
    propertyId: "", 
    zone: "A", 
    sqFt: "", 
    nic: "", 
    buildingAge: "" 
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Property Transfer States
  const [transferForm, setTransferForm] = useState({
    propertyId: "",
    newOwnerNIC: ""
  });
  const [transferStatus, setTransferStatus] = useState(null);
  const [transferLoading, setTransferLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [pendingTransfers, setPendingTransfers] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingError, setPendingError] = useState('');

  // AI Legal Title Summary States
  const [legalSummary, setLegalSummary] = useState(null);
  const [legalSummaryLoading, setLegalSummaryLoading] = useState(false);
  const [legalSummaryError, setLegalSummaryError] = useState(null);
  const [legalSummaryWarning, setLegalSummaryWarning] = useState(null);

  const fetchPropertyValue = async (propertyId) => {
    const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    const record = await contract.getPropertyDetails(propertyId);
    return record[1]?.toString() || "0";
  };

  const loadPendingTransfers = async () => {
    setPendingLoading(true);
    setPendingError('');
    try {
      const response = await axios.get(`${BACKEND_URL}/pending-transfers`);
      setPendingTransfers(response.data.items || []);
    } catch (err) {
      setPendingError(err.response?.data?.error || err.message || 'Failed to load pending requests.');
    }
    setPendingLoading(false);
  };

  useEffect(() => {
    loadPendingTransfers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Send data to Backend Automation Engine
      const response = await axios.post(`${BACKEND_URL}/assess-property`, form);
      
      setStatus({
        type: 'success',
        msg: `✅ Success! Property recorded on blockchain.`,
        txHash: response.data.txHash,
        blockNumber: response.data.blockNumber,
        val: response.data.valuation,
        annualValue: response.data.annualValue,
        tax: response.data.tax,
        methodology: response.data.methodology,
        algorithm: response.data.algorithm,
        walletAddress: response.data.walletAddress
      });

      // Clear form
      setForm({ propertyId: "", zone: "A", sqFt: "", nic: "", buildingAge: "" });
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        msg: "❌ Transaction Failed. Is the Backend server running? Check console for details.",
        details: err.response?.data?.error || err.message
      });
    }
    setLoading(false);
  };

  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferStatus(null);
    setLegalSummary(null);
    setLegalSummaryError(null);
    setLegalSummaryWarning(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/transfer-property`, transferForm);
      
      setTransferStatus({
        type: 'success',
        stage: 'pending',
        msg: '✅ Transfer Request Submitted',
        txHash: response.data.txHash,
        blockNumber: response.data.blockNumber,
        propertyId: response.data.propertyId,
        previousOwner: response.data.currentOwner,
        newOwner: response.data.proposedNewOwner,
        newOwnerWallet: response.data.newOwnerWallet || {
          nic: transferForm.newOwnerNIC || 'Direct Wallet Transfer',
          address: response.data.proposedNewOwner || '',
          privateKey: ''
        }
      });

      // Clear form
      setTransferForm({ propertyId: "", newOwnerNIC: "" });
      loadPendingTransfers();
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      
      setTransferStatus({ 
        type: 'error', 
        msg: errorData?.requiresPayment 
          ? "❌ Transfer Blocked: Tax Must Be Paid Before Land Transfer!" 
          : "❌ Transfer Failed",
        details: errorData?.error || err.message,
        requiresPayment: errorData?.requiresPayment || false
      });
    }
    setTransferLoading(false);
  };

  const handleApproveTransfer = async (propertyId) => {
    setApprovalLoading(true);
    setApprovalStatus(null);
    setLegalSummary(null);
    setLegalSummaryError(null);
    setLegalSummaryWarning(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/approve-transfer`, {
        propertyId,
      });

      const propertyValue = await fetchPropertyValue(propertyId);
      const summaryPayload = {
        propertyId: response.data.propertyId,
        oldOwner: response.data.previousOwner,
        newOwner: response.data.newOwner,
        propertyValue,
        transferDate: new Date().toLocaleDateString('en-LK', {
          year: 'numeric', month: 'long', day: 'numeric'
        })
      };
      const summaryRes = await axios.post(`${BACKEND_URL}/api/generate-title-summary`, summaryPayload);

      setApprovalStatus({
        type: 'success',
        msg: '✅ Transfer Approved and Finalized',
        txHash: response.data.txHash,
        blockNumber: response.data.blockNumber,
        propertyId: response.data.propertyId,
        previousOwner: response.data.previousOwner,
        newOwner: response.data.newOwner,
      });

      setLegalSummary(summaryRes.data.summary);
      if (summaryRes.data.warning) {
        setLegalSummaryWarning(summaryRes.data.warning);
      }

      setTransferStatus({
        type: 'success',
        stage: 'completed',
        msg: '✅ Ownership Transfer Finalized',
        txHash: response.data.txHash,
        blockNumber: response.data.blockNumber,
        propertyId: response.data.propertyId,
        previousOwner: response.data.previousOwner,
        newOwner: response.data.newOwner,
        newOwnerWallet: null
      });

      loadPendingTransfers();
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      setApprovalStatus({
        type: 'error',
        msg: '❌ Approval Failed',
        details: errorData?.error || err.message,
      });
    }

    setApprovalLoading(false);
  };

  const handleRejectTransfer = async (propertyId) => {
    setApprovalLoading(true);
    setApprovalStatus(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/reject-transfer`, { propertyId });
      setApprovalStatus({
        type: 'success',
        msg: '✅ Transfer Request Rejected',
        txHash: response.data.txHash,
        blockNumber: response.data.blockNumber,
        propertyId: response.data.propertyId,
      });
      loadPendingTransfers();
    } catch (err) {
      console.error(err);
      const errorData = err.response?.data;
      setApprovalStatus({
        type: 'error',
        msg: '❌ Rejection Failed',
        details: errorData?.error || err.message,
      });
    }

    setApprovalLoading(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-green-100">
        <div className="flex items-start gap-4 mb-3">
          <div className="bg-gradient-to-br from-lime-100 to-green-100 p-3 rounded-xl">
            <svg className="w-8 h-8 text-lime-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-green-900 mb-2">
              Automated Valuation Engine
            </h2>
            <p className="text-green-600 leading-relaxed">
              Input property details. The system will automatically calculate tax using the multi-criteria 
              algorithm and record it on the blockchain.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Property ID"
            required
            type="number"
            placeholder="e.g., 101"
            value={form.propertyId}
            onChange={(e) => setForm({...form, propertyId: e.target.value})}
          />

          <SelectField
            label="Location Zone"
            required
            value={form.zone}
            onChange={(e) => setForm({...form, zone: e.target.value})}
          >
            <option value="A">Zone A - Luxury Residential (Rate: 8,000 LKR)</option>
            <option value="B">Zone B - Standard Residential (Rate: 6,000 LKR)</option>
            <option value="C">Zone C - Basic/Rural (Rate: 4,500 LKR)</option>
          </SelectField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Square Footage"
            required
            type="number"
            min="1"
            placeholder="e.g., 2000"
            value={form.sqFt}
            onChange={(e) => setForm({...form, sqFt: e.target.value})}
            helper="Total area of the property"
          />

          <InputField
            label="Building Age (Years)"
            required
            type="number"
            min="0"
            placeholder="e.g., 10"
            value={form.buildingAge}
            onChange={(e) => setForm({...form, buildingAge: e.target.value})}
            helper="📉 Critical: 2% depreciation per year (max 50%)"
          />
        </div>

        <InputField
          label="National ID (NIC)"
          required
          placeholder="e.g., 199512345678 or 945671234V"
          value={form.nic}
          onChange={(e) => setForm({...form, nic: e.target.value})}
          helper="Citizen's National Identity Card number (Wallet will be auto-generated)"
        />

        {/* Algorithm Preview - Contractor's Test Method */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-3 border-b-2 border-green-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h4 className="font-bold text-white">Contractor's Test Method Preview</h4>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="text-sm text-green-700 space-y-2 font-mono">
              <p className="flex items-center gap-2">
                <span className="text-green-600 font-semibold">Gross Cost =</span>
                <span>{form.sqFt || "?"} sqft × {form.zone === "A" ? "8,000" : form.zone === "B" ? "6,000" : "4,500"} LKR/sqft</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-lime-600 font-semibold">Depreciation =</span>
                <span>Gross Cost × ({form.buildingAge || "?"} years × 2%, max 50%)</span>
              </p>
              <div className="h-px bg-green-300 my-2"></div>
              <p className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">ECV =</span>
                <span>Gross Cost - Depreciation</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">Annual Value =</span>
                <span>ECV × 5%</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">Tax =</span>
                <span>Annual Value × 10%</span>
              </p>
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          loading={loading}
          variant="council"
          className="w-full py-5 text-lg"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>{loading ? "Processing Algorithm..." : "Assess & Record on Blockchain"}</span>
          </span>
        </Button>
      </form>

      {/* STATUS DISPLAY */}
      {status && (
        <div className={`
          mt-8 rounded-xl border-2 overflow-hidden transition-all
          ${
            status.type === 'success' 
              ? 'border-emerald-400 shadow-lg shadow-emerald-100' 
              : 'border-green-400 shadow-lg shadow-green-100'
          }
        `}>
          <div className={`
            px-6 py-4 border-b-2
            ${status.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-700' : 'bg-gradient-to-r from-green-600 to-green-600 border-green-700'}
          `}>
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
                <h3 className="text-2xl font-bold text-white">
                  {status.msg}
                </h3>
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
                    <p className="text-xs text-emerald-700 mt-2">✅ This hash uniquely identifies the blockchain transaction and can be used to verify the record.</p>
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
                        <p className="text-xs text-emerald-700 font-mono">
                          Gross Cost - Depreciation
                        </p>
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
                <p className="text-sm">{status.details || "Please check the console for more details."}</p>
              </Alert>
            </div>
          )}
        </div>
      )}
      
      {/* PROPERTY TRANSFER SECTION */}
      <div className="mt-12 pt-8 border-t-2 border-green-200">
        <div className="mb-8 pb-6 border-b-2 border-green-100">
          <div className="flex items-start gap-4 mb-3">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-100 p-3 rounded-xl">
              <svg className="w-8 h-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-green-900 mb-2">
                Transfer Property Ownership
              </h2>
              <p className="text-green-600 leading-relaxed">
                Transfer property title to a new owner. <span className="font-bold text-lime-700">Note:</span> Tax must be paid before transfer can proceed (Transaction Integrity Check).
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleTransferSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Property ID"
              required
              type="number"
              placeholder="e.g., 101"
              value={transferForm.propertyId}
              onChange={(e) => setTransferForm({...transferForm, propertyId: e.target.value})}
              helper="Enter the property ID to transfer"
            />

            <InputField
              label="New Owner NIC"
              required
              placeholder="e.g., 199512345678 or 945671234V"
              value={transferForm.newOwnerNIC}
              onChange={(e) => setTransferForm({...transferForm, newOwnerNIC: e.target.value})}
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

          <Button 
            type="submit"
            loading={transferLoading}
            variant="council"
            className="w-full py-5 text-lg"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <span>{transferLoading ? "Submitting Transfer Request..." : "Submit Transfer Request"}</span>
            </span>
          </Button>
        </form>

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
                    <span className="text-xs text-green-500">Requested at: {item.requestedAt ? new Date(item.requestedAt).toLocaleString() : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {approvalStatus && (
            <div className={`mt-5 rounded-lg border-2 overflow-hidden ${approvalStatus.type === 'success' ? 'border-emerald-300 bg-white' : 'border-green-300 bg-white'}`}>
              <div className={`px-4 py-3 ${approvalStatus.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-green-600 text-white'}`}>
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

        {/* TRANSFER STATUS DISPLAY */}
        {transferStatus && (
          <div className={`
            mt-8 rounded-xl border-2 overflow-hidden transition-all
            ${
              transferStatus.type === 'success' 
                ? 'border-emerald-400 shadow-lg shadow-emerald-100' 
                : 'border-green-400 shadow-lg shadow-green-100 animate-pulse'
            }
          `}>
            <div className={`
              px-6 py-4 border-b-2
              ${transferStatus.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-700' : 'bg-gradient-to-r from-green-700 to-green-700 border-green-800'}
            `}>
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
                  <h3 className="text-2xl font-bold text-white">
                    {transferStatus.msg}
                  </h3>
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
                          <p className="text-green-800 leading-relaxed text-sm italic">
                            &ldquo;{legalSummary}&rdquo;
                          </p>
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
        )}
      </div>
    </div>
  );
};

export default CouncilDashboard;
