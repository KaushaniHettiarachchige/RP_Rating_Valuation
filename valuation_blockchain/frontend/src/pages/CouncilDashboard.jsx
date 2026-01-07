import { useState } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../constants/config';
import Button from '../components/Button';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import DataCard from '../components/DataCard';
import Alert from '../components/Alert';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      // Send data to Backend Automation Engine
      const response = await axios.post(BACKEND_URL, form);
      
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
        walletAddress: response.data.walletAddress,
        privateKey: response.data.privateKey
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

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-slate-100">
        <div className="flex items-start gap-4 mb-3">
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-3 rounded-xl">
            <svg className="w-8 h-8 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Automated Valuation Engine
            </h2>
            <p className="text-slate-600 leading-relaxed">
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 border-b-2 border-blue-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h4 className="font-bold text-white">Contractor's Test Method Preview</h4>
            </div>
          </div>
          <div className="p-5 bg-white">
            <div className="text-sm text-slate-700 space-y-2 font-mono">
              <p className="flex items-center gap-2">
                <span className="text-blue-600 font-semibold">Gross Cost =</span>
                <span>{form.sqFt || "?"} sqft × {form.zone === "A" ? "8,000" : form.zone === "B" ? "6,000" : "4,500"} LKR/sqft</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-amber-600 font-semibold">Depreciation =</span>
                <span>Gross Cost × ({form.buildingAge || "?"} years × 2%, max 50%)</span>
              </p>
              <div className="h-px bg-slate-300 my-2"></div>
              <p className="flex items-center gap-2">
                <span className="text-emerald-600 font-semibold">ECV =</span>
                <span>Gross Cost - Depreciation</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-indigo-600 font-semibold">Annual Value =</span>
                <span>ECV × 5%</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-purple-600 font-semibold">Tax =</span>
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
              : 'border-rose-400 shadow-lg shadow-rose-100'
          }
        `}>
          <div className={`
            px-6 py-4 border-b-2
            ${status.type === 'success' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-700' : 'bg-gradient-to-r from-rose-600 to-red-600 border-rose-700'}
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
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-300 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-900">🎉 Digital Identity Generated!</h3>
                    <p className="text-sm text-purple-700">Custodial wallet created for property owner</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="font-semibold text-purple-900 text-sm">Generated Wallet Address:</p>
                    </div>
                    <code className="block bg-purple-900 text-purple-100 px-4 py-3 rounded font-mono text-xs break-all border border-purple-700">
                      {status.walletAddress}
                    </code>
                    <p className="text-xs text-purple-600 mt-2">✅ This address can receive property ownership tokens</p>
                  </div>
                  
                  <div className="bg-rose-50 p-4 rounded-lg border-2 border-rose-300">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      <p className="font-semibold text-rose-900 text-sm">🔑 Private Key (KEEP SECRET!):</p>
                    </div>
                    <code className="block bg-rose-900 text-rose-100 px-4 py-3 rounded font-mono text-xs break-all border border-rose-700">
                      {status.privateKey}
                    </code>
                    <div className="mt-3 bg-white p-3 rounded border border-rose-300">
                      <p className="text-xs text-rose-800 font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        CRITICAL: Share this private key ONLY with the property owner. Anyone with this key has full control over the wallet.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Methodology Badge */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <div>
                  <p className="font-bold text-lg">{status.methodology}</p>
                  <p className="text-sm text-blue-100">Statutory Framework Compliance</p>
                </div>
              </div>

              {/* Valuation Breakdown - Contractor's Test Method */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-bold text-blue-900">Valuation Calculation Breakdown</p>
                </div>
                
                <div className="space-y-3">
                  {/* Gross Construction Cost */}
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">📐 Gross Construction Cost</p>
                        <p className="text-xs text-slate-500 font-mono">
                          {status.algorithm.sqFt} sqft × {status.algorithm.constructionRate} LKR/sqft
                        </p>
                      </div>
                      <p className="text-xl font-bold text-blue-700">
                        {parseInt(status.algorithm.grossCost).toLocaleString()} LKR
                      </p>
                    </div>
                  </div>

                  {/* Depreciation */}
                  <div className="bg-rose-50 p-4 rounded-lg border-2 border-rose-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-rose-900 font-semibold mb-1">📉 Depreciation Deduction</p>
                        <p className="text-xs text-rose-700 font-mono">
                          {status.algorithm.buildingAge} years × 2% = {status.algorithm.depreciationPercentage}
                        </p>
                      </div>
                      <p className="text-xl font-bold text-rose-700">
                        -{parseInt(status.algorithm.depreciationAmount).toLocaleString()} LKR
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-blue-300 my-2"></div>

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
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-300">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-indigo-900 font-semibold mb-1">📊 Annual Value</p>
                        <p className="text-xs text-indigo-700 font-mono">
                          ECV × {status.algorithm.decapitalizationRate} (Decapitalization Rate)
                        </p>
                      </div>
                      <p className="text-xl font-bold text-indigo-700">
                        {parseInt(status.annualValue).toLocaleString()} LKR
                      </p>
                    </div>
                  </div>

                  <div className="h-px bg-blue-300 my-2"></div>

                  {/* Tax Payable */}
                  <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-400">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-purple-900 font-semibold mb-1">💰 Tax Payable</p>
                        <p className="text-xs text-purple-700 font-mono">
                          Annual Value × {status.algorithm.taxRate}
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {parseInt(status.tax).toLocaleString()} LKR
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-emerald-500/20 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <p className="font-semibold text-emerald-400 text-sm">Transaction Hash:</p>
                </div>
                <code className="block bg-slate-950 text-emerald-400 px-4 py-3 rounded font-mono text-xs break-all border border-slate-700">
                  {status.txHash}
                </code>
                <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>Block: #{status.blockNumber}</span>
                </div>
              </div>
            </div>
          )}

          {status.type === 'error' && (
            <div className="bg-gradient-to-br from-rose-50 to-red-50 p-6">
              <Alert type="error">
                <p className="font-semibold mb-2">Transaction Failed</p>
                <p className="text-sm">{status.details || "Please check the console for more details."}</p>
              </Alert>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CouncilDashboard;
