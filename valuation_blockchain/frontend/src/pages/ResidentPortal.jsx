import { useState } from 'react';
import { ethers } from 'https://esm.sh/ethers@6.11.1';
import { QRCode } from 'react-qr-code';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/config';
import Button from '../components/Button';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import LoadingSkeleton from '../components/LoadingSkeleton';
import DataCard from '../components/DataCard';

const ResidentPortal = () => {
  const [pId, setPId] = useState("");
  const [originalData, setOriginalData] = useState(null); // Original blockchain data
  const [displayData, setDisplayData] = useState(null); // What's shown on screen (can be tampered)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCorrupted, setIsCorrupted] = useState(false); // Track if data has been tampered
  const [history, setHistory] = useState([]); // Audit Trail History
  const [logs, setLogs] = useState([]); // Live Integrity Log (Terminal)
  const [isSimulating, setIsSimulating] = useState(false); // Track if simulation is running

  const verifyProperty = async () => {
    if (!pId) return;
    setLoading(true);
    setError("");
    setOriginalData(null);
    setDisplayData(null);
    setHistory([]);
    setIsCorrupted(false);
    setLogs([]); // Clear logs when verifying new property

    try {
      // 1. Connect to Blockchain (with ENS disabled for local network)
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545", {
        chainId: 31337,
        name: "localhost",
        ensAddress: null // Disable ENS for local Hardhat network
      });
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // 2. Fetch Current Data from Blockchain
      const record = await contract.getPropertyDetails(pId);
      
      const fetchedId = record[0].toString();
      const fetchedValue = record[1].toString();
      const fetchedTax = record[2].toString();
      const fetchedAge = record[3].toString();
      const fetchedOwner = record[4];
      const fetchedHash = record[5];

      const data = {
        id: fetchedId,
        value: fetchedValue,
        tax: fetchedTax,
        buildingAge: fetchedAge,
        owner: fetchedOwner,
        hash: fetchedHash
      };

      // Store both original (for verification) and display (for showing)
      setOriginalData(data);
      setDisplayData({...data}); // Clone for display

      // 3. FETCH AUDIT TRAIL (Historical Valuations)
      const filter = contract.filters.ValuationUpdated(pId);
      const events = await contract.queryFilter(filter);
      
      const auditTrail = events.map((event, index) => ({
        id: index + 1,
        blockNumber: event.blockNumber,
        value: event.args.value.toString(),
        tax: event.args.tax.toString(),
        buildingAge: event.args.buildingAge.toString(),
        docHash: event.args.docHash,
      })).reverse(); // Most recent first
      
      setHistory(auditTrail);

    } catch (err) {
      console.error(err);
      setError("❌ Property Not Found or Blockchain Error. Ensure Hardhat is running and property exists.");
    }
    setLoading(false);
  };

  // NOVELTY FEATURE: Real-time Integrity Verification
  const verifyIntegrity = () => {
    if (!originalData || !displayData) return null;

    // Calculate what the hash SHOULD be based on displayed data
    const localString = displayData.id + displayData.value + displayData.tax;
    const calculatedHash = ethers.id(localString);

    // Compare with the original blockchain hash
    return calculatedHash === originalData.hash;
  };

  const isVerified = verifyIntegrity();

  // 🔴 CORRUPTION DEMO: Simulate Database Hack with Live Diagnostic Log
  const simulateCorruption = async () => {
    if (!displayData || isSimulating) return;
    
    setIsSimulating(true);
    setLogs([]); // Clear previous logs
    
    // Calculate tampered values
    const tamperedTax = Math.floor(parseInt(displayData.tax) * 0.5).toString();
    const localString = displayData.id + displayData.value + tamperedTax;
    const calculatedHash = ethers.id(localString);
    
    // Step 1: Fetching ledger record
    await new Promise(resolve => setTimeout(resolve, 300));
    setLogs(prev => [...prev, { 
      type: 'info', 
      text: '[SYSTEM] Initializing corruption detection protocol...' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, { 
      type: 'info', 
      text: `[STEP 1/4] Fetching blockchain ledger for Property ID: ${displayData.id}` 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setLogs(prev => [...prev, { 
      type: 'success', 
      text: `[STEP 1/4] ✓ Ledger record retrieved from Block #${history[0]?.blockNumber || 'N/A'}` 
    }]);
    
    // Step 2: Apply database hack (tamper with tax)
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, { 
      type: 'warning', 
      text: '[STEP 2/4] ⚠ SIMULATING MALICIOUS DATABASE MODIFICATION...' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setLogs(prev => [...prev, { 
      type: 'warning', 
      text: `[STEP 2/4] Tax value altered: ${displayData.tax} → ${tamperedTax} (50% reduction)` 
    }]);
    
    // Apply the tampering to display
    setDisplayData({
      ...displayData,
      tax: tamperedTax
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, { 
      type: 'warning', 
      text: '[STEP 2/4] ⚠ Database record corrupted successfully (simulated attack)' 
    }]);
    
    // Step 3: Recalculating hash
    await new Promise(resolve => setTimeout(resolve, 600));
    setLogs(prev => [...prev, { 
      type: 'info', 
      text: '[STEP 3/4] Recalculating SHA-256 integrity hash from modified data...' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setLogs(prev => [...prev, { 
      type: 'info', 
      text: `[STEP 3/4] Calculated Hash: ${calculatedHash.substring(0, 20)}...` 
    }]);
    
    // Step 4: Compare hashes
    await new Promise(resolve => setTimeout(resolve, 700));
    setLogs(prev => [...prev, { 
      type: 'info', 
      text: '[STEP 4/4] Comparing calculated hash with blockchain signature...' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: `[STEP 4/4] ❌ HASH MISMATCH DETECTED!` 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: `Expected: ${originalData.hash.substring(0, 20)}...` 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: `Received: ${calculatedHash.substring(0, 20)}...` 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: '═══════════════════════════════════════════════════════' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: '⚠ CRITICAL ALERT: DATA CORRUPTION DETECTED' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: 'Integrity verification FAILED. Unauthorized modification confirmed.' 
    }]);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    setLogs(prev => [...prev, { 
      type: 'error', 
      text: '═══════════════════════════════════════════════════════' 
    }]);
    
    // NOW set the corruption flag (triggers red banner)
    await new Promise(resolve => setTimeout(resolve, 400));
    setIsCorrupted(true);
    setIsSimulating(false);
  };

  // Reset to original blockchain data
  const resetData = () => {
    if (originalData) {
      setDisplayData({...originalData});
      setIsCorrupted(false);
      setLogs([]); // Clear logs on reset
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-6 border-b-2 border-slate-100">
        <div className="flex items-start gap-4 mb-3">
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-3 rounded-xl shadow-sm">
            <svg className="w-8 h-8 text-blue-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Property Verification & Integrity Check
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Enter your Property ID to verify the official valuation against blockchain records and test the corruption detection system.
            </p>
          </div>
        </div>
      </div>
      
      {/* Verification Form */}
      <div className="mb-8">
        <div className="flex gap-3">
          <div className="flex-1">
            <InputField
              type="number" 
              placeholder="Enter Property ID (e.g., 101)" 
              value={pId}
              onChange={(e) => setPId(e.target.value)}
              className="text-lg"
            />
          </div>
          <Button 
            onClick={verifyProperty}
            loading={loading}
            variant="primary"
            className="px-10 py-3 text-lg"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Verify Property</span>
            </span>
          </Button>
        </div>
      </div>

      {error && (
        <Alert type="error">
          <p className="font-semibold">{error}</p>
        </Alert>
      )}

      {loading && !displayData && (
        <div className="mt-8">
          <LoadingSkeleton />
        </div>
      )}

      {displayData && (
        <>
          {/* INTEGRITY STATUS BANNER */}
          <div className={`
            mb-8 p-6 rounded-xl border-2 transition-all duration-300
            ${
              isVerified 
                ? 'bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-emerald-500 shadow-lg' 
                : 'bg-gradient-to-r from-rose-50 via-red-50 to-rose-50 border-rose-600 animate-pulse shadow-lg shadow-rose-200'
            }
          `}>
            {isVerified ? (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-emerald-600 rounded-full p-3 shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-emerald-900 mb-1">✓ Data Integrity Verified</h3>
                  <p className="text-emerald-800 font-medium">
                    All property information matches the blockchain signature. No tampering detected.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-white px-5 py-3 rounded-lg border-2 border-emerald-500 shadow-sm">
                    <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-lg font-bold text-emerald-900">Verified</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-rose-700 rounded-full p-3 animate-pulse shadow-md">
                  <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-rose-900 mb-1">⚠ CRITICAL: Data Corruption Detected</h3>
                  <p className="text-rose-800 font-bold">
                    SECURITY ALERT: The displayed data does not match the blockchain hash. 
                    Unauthorized modification detected!
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-rose-700 px-5 py-3 rounded-lg border-2 border-rose-800 shadow-md">
                    <p className="text-xs text-rose-100 font-bold uppercase tracking-wider">Status</p>
                    <p className="text-lg font-bold text-white">TAMPERED</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* PROPERTY DETAILS CARD */}
          <div className={`
            rounded-xl border-2 mb-8 transition-all duration-300 overflow-hidden shadow-lg
            ${
              isVerified 
                ? 'bg-white border-slate-200' 
                : 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-400'
            }
          `}>
            <div className={`px-6 py-4 border-b-2 ${
              isVerified ? 'bg-blue-50 border-blue-200' : 'bg-rose-200 border-rose-400'
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Property Information
                </h3>
                {!isVerified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 text-white text-xs font-bold rounded-full animate-pulse shadow-md">
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
                  variant={isVerified ? "primary" : "warning"}
                  className={!isVerified ? "ring-2 ring-rose-400" : ""}
                />
                <div className={`
                  p-5 rounded-lg border-2 shadow-sm transition-all
                  ${isVerified ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200' : 'bg-rose-200 border-rose-500 ring-2 ring-rose-500 animate-pulse'}
                `}>
                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Annual Tax</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    LKR {parseInt(displayData.tax).toLocaleString()}
                  </p>
                  {!isVerified && (
                    <div className="mt-2 flex items-center gap-1.5 text-rose-800">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs font-bold">Value has been altered!</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Owner Wallet Address</p>
                <p className="text-sm font-mono text-slate-800 break-all bg-white px-3 py-2 rounded border border-slate-200">
                  {displayData.owner}
                </p>
              </div>

              <div className="p-5 bg-gradient-to-br from-blue-900 to-blue-950 rounded-lg shadow-md">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-blue-300 text-sm mb-1">Blockchain Integrity Hash (SHA-256)</p>
                    <code className="block bg-blue-950 text-blue-300 px-4 py-3 rounded font-mono text-xs break-all border border-blue-800">
                      {originalData.hash}
                    </code>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This cryptographic signature proves the authenticity of the data. Any modification 
                  to the tax amount will cause a hash mismatch, instantly exposing corruption.
                </p>
              </div>
            </div>
          </div>

          {/* CORRUPTION DEMO CONTROLS */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-xl border-2 border-rose-400 overflow-hidden mb-8 shadow-lg">
            <div className="bg-rose-700 px-6 py-3 border-b-2 border-rose-800">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h3 className="text-lg font-bold text-white uppercase tracking-wide">
                  Research Demo: Corruption Detection Test
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 bg-rose-200 p-3 rounded-lg">
                  <svg className="w-8 h-8 text-rose-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Click the button below to simulate a malicious database hack. The system will 
                    immediately detect the tampering through hash verification, demonstrating the 
                    security of blockchain-based systems.
                  </p>
                  <div className="flex gap-3 flex-wrap">
                    <Button 
                      onClick={simulateCorruption}
                      disabled={isCorrupted || isSimulating}
                      variant="danger"
                    >
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
                      <Button 
                        onClick={resetData}
                        variant="primary"
                      >
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
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border-2 border-slate-700 overflow-hidden mb-8 shadow-2xl">
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-3 border-b-2 border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
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
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-mono rounded border border-red-500/50">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
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
                        ${log.type === 'error' ? 'text-red-400' : ''}
                        ${log.type === 'success' ? 'text-green-400' : ''}
                        ${log.type === 'warning' ? 'text-yellow-400' : ''}
                        ${log.type === 'info' ? 'text-cyan-400' : ''}
                      `}
                      style={{
                        animationDelay: `${index * 0.05}s`
                      }}
                    >
                      <span className="text-slate-500 select-none">{String(index + 1).padStart(3, '0')}</span>
                      <span className="text-slate-600 select-none">│</span>
                      <span className="flex-1 break-all">{log.text}</span>
                    </div>
                  ))}
                  {isSimulating && (
                    <div className="flex items-center gap-2 py-2 text-green-400">
                      <span className="text-slate-500 select-none">{String(logs.length + 1).padStart(3, '0')}</span>
                      <span className="text-slate-600 select-none">│</span>
                      <span className="animate-pulse">▊</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-slate-900 border-t border-slate-700 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="text-slate-500">Lines: <span className="text-green-400">{logs.length}</span></span>
                  <span className="text-slate-500">Status: 
                    <span className={isCorrupted ? "text-red-400 ml-1" : "text-green-400 ml-1"}>
                      {isSimulating ? 'ANALYZING' : isCorrupted ? 'COMPROMISED' : 'IDLE'}
                    </span>
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  BlockchainIntegrityMonitor v1.0.0
                </div>
              </div>
            </div>
          )}

          {/* AUDIT TRAIL */}
          {history.length > 0 && (
            <div className="mt-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl border-2 border-blue-300 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-blue-800 to-blue-900 px-6 py-5 border-b-2 border-blue-900">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
                        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Immutable Audit Trail</h3>
                        <p className="text-blue-200 text-sm">
                          Complete history of all valuation changes recorded on blockchain
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full border-2 border-white/30">
                      <p className="text-2xl font-bold text-white">{history.length}</p>
                      <p className="text-xs text-blue-200 uppercase tracking-wide">
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
                        ${
                          index === 0 
                            ? 'border-blue-500 shadow-lg shadow-blue-100' 
                            : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className={`
                        px-5 py-3 flex items-center justify-between flex-wrap gap-3
                        ${index === 0 ? 'bg-gradient-to-r from-blue-100 to-indigo-100' : 'bg-slate-50'}
                      `}>
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                            ${index === 0 ? 'bg-blue-700 text-white' : 'bg-slate-300 text-slate-700'}
                          `}>
                            {history.length - index}
                          </div>
                          {index === 0 && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-700 text-white text-xs font-bold rounded-full">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Current Record
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-300">
                          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="text-xs font-mono font-semibold text-slate-700">
                            Block #{record.blockNumber}
                          </span>
                        </span>
                      </div>
                      
                      <div className="p-5 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Assessed Value</p>
                            <p className="text-xl font-bold text-slate-900">
                              LKR {parseInt(record.value).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Tax Amount</p>
                            <p className="text-xl font-bold text-emerald-700">
                              LKR {parseInt(record.tax).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Building Age</p>
                            <p className="text-xl font-bold text-slate-700">
                              {record.buildingAge} years
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 border-t-2 border-amber-300 p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 bg-amber-600 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-900 mb-1">Research Significance</p>
                      <p className="text-sm text-amber-800 leading-relaxed">
                        This audit trail is permanently recorded on the blockchain and cannot be deleted or modified. 
                        Any attempt to alter past records would require changing the entire blockchain history, which is 
                        computationally impossible. This demonstrates the immutability principle of blockchain technology 
                        in preventing corruption.
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
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-400 overflow-hidden shadow-xl">
                <div className="bg-gradient-to-r from-emerald-700 to-teal-700 px-6 py-4 border-b-2 border-emerald-800">
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
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Encoded Data</p>
                        </div>
                        <code className="block text-sm font-mono text-slate-800 bg-slate-50 p-3 rounded border border-slate-200 break-all">
                          PropertyID:{displayData.id} | Tax:{displayData.tax} | Status:Verified
                        </code>
                      </div>

                      <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-400">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 bg-amber-600 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-900 mb-1">Commercial Value & Security Feature</p>
                            <p className="text-sm text-amber-800 leading-relaxed">
                              This QR code serves as a digital property deed that can be scanned by banks, notaries, 
                              or property buyers to instantly verify authenticity. If you simulate corruption, 
                              this QR code will disappear immediately, proving the system only issues digital deeds for 
                              uncorrupted, blockchain-verified data.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResidentPortal;
