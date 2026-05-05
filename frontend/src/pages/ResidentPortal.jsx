import { useState, useRef } from 'react';
import { ethers } from 'https://esm.sh/ethers@6.11.1';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CONTRACT_ADDRESS, CONTRACT_ABI, BACKEND_URL } from '../constants/config';
import Alert from '../components/Alert';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ResidentHeader from './resident/components/ResidentHeader';
import VerificationForm from './resident/components/VerificationForm';
import IntegrityBanner from './resident/components/IntegrityBanner';
import TabNavigation from './resident/components/TabNavigation';
import DetailsTab from './resident/components/DetailsTab';
import HistoryTab from './resident/components/HistoryTab';
import StampDutyModal from './resident/components/StampDutyModal';
import PaymentModal from './resident/components/PaymentModal';

const ResidentPortal = () => {
  // Helper function to paginate queryFilter calls (max 50,000 blocks per RPC call)
  const queryFilterPaginated = async (contract, filter, fromBlock, toBlock, maxBlockRange = 50000) => {
    let allEvents = [];
    let currentBlock = fromBlock;
    const latestBlockNumber = toBlock === "latest" ? await contract.runner.provider.getBlockNumber() : toBlock;
    
    while (currentBlock <= latestBlockNumber) {
      const endBlock = Math.min(currentBlock + maxBlockRange - 1, latestBlockNumber);
      try {
        const events = await contract.queryFilter(filter, currentBlock, endBlock);
        allEvents = allEvents.concat(events);
      } catch (err) {
        console.error(`Error querying blocks ${currentBlock}-${endBlock}:`, err.message);
      }
      currentBlock = endBlock + 1;
    }
    return allEvents;
  };

  const [pId, setPId] = useState("");
  const [originalData, setOriginalData] = useState(null); // Original blockchain data
  const [displayData, setDisplayData] = useState(null); // What's shown on screen (can be tampered)
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCorrupted, setIsCorrupted] = useState(false); // Track if data has been tampered
  const [history, setHistory] = useState([]); // Audit Trail History
  const [timelineEvents, setTimelineEvents] = useState([]); // Full Immutable Event Timeline
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'history'
  const [logs, setLogs] = useState([]); // Live Integrity Log (Terminal)
  const [isSimulating, setIsSimulating] = useState(false); // Track if simulation is running
  
  // Payment Gateway States
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // null, 'processing', 'success'
  const [isPaid, setIsPaid] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState("");
  const [paymentTxHash, setPaymentTxHash] = useState("");
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

  // Legal Land Transfer States
  const [userRole, setUserRole] = useState('owner');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [newOwnerNic, setNewOwnerNic] = useState('');
  const [showStampDutyModal, setShowStampDutyModal] = useState(false);
  const [stampDutyPaid, setStampDutyPaid] = useState(false);
  const [transferStatus, setTransferStatus] = useState('');
  const [transferTxHash, setTransferTxHash] = useState('');
  const [transferError, setTransferError] = useState('');
  const [transferProcessing, setTransferProcessing] = useState(false);
  const [withdrawProcessing, setWithdrawProcessing] = useState(false);

  const deedRef = useRef(null);

  const verifyProperty = async () => {
    if (!pId) return;
    setLoading(true);
    setError("");
    setOriginalData(null);
    setDisplayData(null);
    setHistory([]);
    setTimelineEvents([]);
    setActiveTab('details');
    setIsCorrupted(false);
    setLogs([]); // Clear logs when verifying new property
    setIsPaid(false); // Reset payment status
    setPaymentStatus(null);
    setPaymentSuccessMsg("");
    setPaymentTxHash("");
    setNewOwnerAddress("");
    setNewOwnerNic("");
    setShowStampDutyModal(false);
    setStampDutyPaid(false);
    setTransferStatus("");
    setTransferTxHash("");
    setTransferError("");
    setTransferProcessing(false);
    setWithdrawProcessing(false);

    try {
      // 1. Connect to Blockchain (with ENS disabled for local network)
      const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      // 2. Fetch Current Data from Blockchain
      const record = await contract.getPropertyDetails(pId);
      
      const fetchedId = record[0].toString();
      const fetchedValue = record[1].toString();
      const fetchedTax = record[2].toString();
      const fetchedAge = record[3].toString();
      const fetchedOwner = record[4];
      const fetchedHash = record[5];
      const fetchedIsPaid = record[6]; // New field from smart contract
      const fetchedHasBankLoan = record[7] ?? false;
      const fetchedHasPendingTransfer = record[8] ?? false;
      const fetchedPendingNewOwner = record[9] ?? ethers.ZeroAddress;

      const data = {
        id: fetchedId,
        value: fetchedValue,
        tax: fetchedTax,
        buildingAge: fetchedAge,
        owner: fetchedOwner,
        hash: fetchedHash,
        isPaid: fetchedIsPaid,
        hasBankLoan: fetchedHasBankLoan,
        hasPendingTransfer: fetchedHasPendingTransfer,
        pendingNewOwner: fetchedPendingNewOwner
      };

      // Store both original (for verification) and display (for showing)
      setOriginalData(data);
      setDisplayData({...data}); // Clone for display
      setIsPaid(fetchedIsPaid); // Set payment status from blockchain

      // 3. FETCH AUDIT TRAIL (Historical Valuations)
      const START_BLOCK = 10708153;
      const filter = contract.filters.ValuationUpdated(pId);
      const events = await queryFilterPaginated(contract, filter, START_BLOCK, "latest");
      
      const auditTrail = events.map((event, index) => ({
        id: index + 1,
        blockNumber: event.blockNumber,
        value: event.args.value.toString(),
        tax: event.args.tax.toString(),
        buildingAge: event.args.buildingAge.toString(),
        docHash: event.args.docHash,
      })).reverse(); // Most recent first
      
      setHistory(auditTrail);

      // 4. FETCH FULL IMMUTABLE HISTORY TIMELINE (All event types)
      const formatTimestamp = (ts) => {
        try {
          const date = new Date(Number(ts) * 1000);
          return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            + ' at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } catch { return 'Date Unavailable'; }
      };

      const [taxPaidEvents, ownershipEvents, registrationEvents, transferRequestedEvents, transferRejectedEvents, transferWithdrawnEvents] = await Promise.all([
        queryFilterPaginated(contract, contract.filters.TaxPaid(pId), START_BLOCK, "latest"),
        queryFilterPaginated(contract, contract.filters.OwnershipTransferred(pId), START_BLOCK, "latest"),
        queryFilterPaginated(contract, contract.filters.PropertyRegistered(pId), START_BLOCK, "latest"),
        queryFilterPaginated(contract, contract.filters.TransferRequested(pId), START_BLOCK, "latest"),
        queryFilterPaginated(contract, contract.filters.TransferRejected(pId), START_BLOCK, "latest"),
        queryFilterPaginated(contract, contract.filters.TransferWithdrawn(pId), START_BLOCK, "latest"),
      ]);

      const allTimeline = [
        ...registrationEvents.map(e => ({
          type: 'PropertyRegistered',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: { owner: e.args.owner },
        })),
        ...events.map(e => ({
          type: 'ValuationUpdated',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: {
            value: e.args.value.toString(),
            tax: e.args.tax.toString(),
            buildingAge: e.args.buildingAge?.toString() ?? 'N/A',
            docHash: e.args.docHash,
          },
        })),
        ...taxPaidEvents.map(e => ({
          type: 'TaxPaid',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: { payer: e.args.payer },
        })),
        ...transferRequestedEvents.map(e => ({
          type: 'TransferRequested',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: {
            requestedBy: e.args.requestedBy,
            proposedNewOwner: e.args.proposedNewOwner,
          },
        })),
        ...transferRejectedEvents.map(e => ({
          type: 'TransferRejected',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: { rejectedBy: e.args.rejectedBy },
        })),
        ...transferWithdrawnEvents.map(e => ({
          type: 'TransferWithdrawn',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: { withdrawnBy: e.args.withdrawnBy },
        })),
        ...ownershipEvents.map(e => ({
          type: 'OwnershipTransferred',
          blockNumber: e.blockNumber,
          txHash: e.transactionHash,
          timestamp: formatTimestamp(e.args.timestamp),
          details: { from: e.args.previousOwner, to: e.args.newOwner },
        })),
      ].sort((a, b) => b.blockNumber - a.blockNumber);

      setTimelineEvents(allTimeline);

    } catch (err) {
      console.error(err);
      setError(" Property Not Found or Blockchain Error. ");
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

  // CORRUPTION DEMO: Simulate Database Hack with Live Diagnostic Log
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
      text: 'CRITICAL ALERT: DATA CORRUPTION DETECTED' 
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

  // Payment Gateway Functions
  const handlePayTax = () => {
    setShowPaymentModal(true);
    setCardholderName("");
    setCardNumber("");
    setExpiry("");
    setCvv("");
    setPaymentStatus(null);
  };

  // Real blockchain tax payment — called on card form submit
  const handleRealTaxPayment = async (e) => {
    e.preventDefault();
    if (!displayData) return;

    setPaymentStatus('processing');

    try {
      const response = await axios.post(`${BACKEND_URL}/pay-tax`, {
        propertyId: displayData.id
      });

      if (response.data.success) {
        const txHash =
          response.data.txHash ||
          response.data.transactionHash ||
          `TXN_${Date.now()}`;

        setPaymentTxHash(txHash);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPaymentStatus('success');

        // Update local state so Pay Tax button disappears
        setIsPaid(true);
        setDisplayData({ ...displayData, isPaid: true });
        if (originalData) {
          setOriginalData({ ...originalData, isPaid: true });
        }

        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowPaymentModal(false);
        setPaymentStatus(null);
        setPaymentSuccessMsg(`Tax Paid Successfully! TxHash: ${txHash}`);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('error');
      setTimeout(() => {
        setPaymentStatus(null);
        setShowPaymentModal(false);
      }, 2000);
    }
  };



  const closePaymentModal = () => {
    if (paymentStatus !== 'processing') {
      setShowPaymentModal(false);
      setPaymentStatus(null);
    }
  };

  const stampDutyAmount = Math.floor((Number(displayData?.value || 0) * 4) / 100);
  const totalTransferPayable = stampDutyAmount;
  const transferLockedByTax = displayData ? !displayData.isPaid : true;
  const transferLockedByLoan = displayData ? !!displayData.hasBankLoan : false;

  const openStampDutyModal = () => {
    if (!displayData) return;

    if (!ethers.isAddress(newOwnerAddress) && !newOwnerNic.trim()) {
      setTransferError('Please enter either a valid new owner wallet address or a NIC.');
      return;
    }

    if (ethers.isAddress(newOwnerAddress) && newOwnerAddress.toLowerCase() === displayData.owner.toLowerCase()) {
      setTransferError('New owner must be different from current owner.');
      return;
    }

    if (transferLockedByTax || transferLockedByLoan || displayData.hasPendingTransfer) {
      setTransferError('Transfer is locked until all legal conditions are satisfied.');
      return;
    }

    setTransferError('');
    setStampDutyPaid(false);
    setShowStampDutyModal(true);
  };

  const simulateStampDutyPayment = async () => {
    setTransferProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setStampDutyPaid(true);
    setTransferProcessing(false);
  };

  const handleRequestTransfer = async () => {
    if (!displayData || !stampDutyPaid) return;

    setTransferError('');
    setTransferProcessing(true);

    try {
      const payload = { propertyId: displayData.id };
      if (newOwnerNic.trim()) {
        payload.newOwnerNIC = newOwnerNic.trim();
      } else {
        payload.newOwnerAddress = newOwnerAddress.trim();
      }

      const response = await axios.post(`${BACKEND_URL}/transfer-property`, payload);
      const proposedNewOwner = response.data.proposedNewOwner || response.data.newOwnerWallet?.address || newOwnerAddress || ethers.ZeroAddress;

      const updatedData = {
        ...displayData,
        hasPendingTransfer: true,
        pendingNewOwner: proposedNewOwner,
      };

      setDisplayData(updatedData);
      if (originalData) {
        setOriginalData({ ...originalData, hasPendingTransfer: true, pendingNewOwner: proposedNewOwner });
      }

      setTransferStatus(response.data.message || 'Transfer Status: Pending Council Approval');
      setTransferTxHash(response.data.txHash || '');
      setShowStampDutyModal(false);
    } catch (err) {
      const errorData = err?.response?.data;
      setTransferError(errorData?.details || errorData?.error || err?.reason || err?.shortMessage || err?.message || 'Transfer request failed.');
    } finally {
      setTransferProcessing(false);
    }
  };

  const handleWithdrawTransfer = async () => {
    if (!displayData) return;

    setTransferError('');
    setWithdrawProcessing(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/withdraw-transfer`, {
        propertyId: displayData.id,
      });

      const updatedData = {
        ...displayData,
        hasPendingTransfer: false,
        pendingNewOwner: ethers.ZeroAddress,
      };

      setDisplayData(updatedData);
      if (originalData) {
        setOriginalData({
          ...originalData,
          hasPendingTransfer: false,
          pendingNewOwner: ethers.ZeroAddress,
        });
      }

      setTransferStatus(response.data.message || 'Transfer request withdrawn.');
      setTransferTxHash(response.data.txHash || '');
    } catch (err) {
      const errorData = err?.response?.data;
      setTransferError(errorData?.details || errorData?.error || err?.reason || err?.shortMessage || err?.message || 'Transfer withdrawal failed.');
    } finally {
      setWithdrawProcessing(false);
    }
  };

  const downloadDeedPDF = async () => {
    if (!deedRef.current || !displayData) return;
    setIsDownloadingPDF(true);
    try {
      const canvas = await html2canvas(deedRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 14;

      // ── Dark teal header bar ──
      pdf.setFillColor(4, 47, 46);
      pdf.rect(0, 0, pageWidth, 32, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(17);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OFFICIAL DIGITAL PROPERTY DEED', pageWidth / 2, 13, { align: 'center' });
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Blockchain-Verified  •  Municipal Valuation Authority', pageWidth / 2, 22, { align: 'center' });

      // ── Light teal meta strip ──
      pdf.setFillColor(240, 253, 250);
      pdf.rect(0, 32, pageWidth, 16, 'F');
      pdf.setDrawColor(167, 243, 208);
      pdf.setLineWidth(0.3);
      pdf.line(0, 32, pageWidth, 32);
      pdf.line(0, 48, pageWidth, 48);
      pdf.setTextColor(5, 78, 72);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Property ID: #${displayData.id}`, margin, 42);
      pdf.text(
        `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        pageWidth - margin, 42,
        { align: 'right' }
      );

      // ── Deed screenshot ──
      const imgWidth = pageWidth - margin * 2;
      const rawImgHeight = (canvas.height * imgWidth) / canvas.width;
      const maxImgHeight = pageHeight - 55 - 22; // top offset + footer
      const imgHeight = Math.min(rawImgHeight, maxImgHeight);
      pdf.addImage(imgData, 'PNG', margin, 55, imgWidth, imgHeight);

      // ── Footer ──
      const footerY = pageHeight - 16;
      pdf.setFillColor(241, 245, 249);
      pdf.rect(0, footerY - 5, pageWidth, 21, 'F');
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.3);
      pdf.line(0, footerY - 5, pageWidth, footerY - 5);
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(6.5);
      pdf.setFont('helvetica', 'italic');
      pdf.text(
        'This document is a blockchain-verified digital property deed. Verify authenticity using the embedded QR code.',
        pageWidth / 2, footerY + 1, { align: 'center' }
      );
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Integrity Hash: ${originalData.hash.substring(0, 48)}...`,
        pageWidth / 2, footerY + 7, { align: 'center' }
      );

      pdf.save(`Property_${displayData.id}_Official_Deed.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const getEventConfig = (type) => {
    switch (type) {
      case 'PropertyRegistered':
        return {
          icon: '🏠', title: 'Property Registered',
          dotColor: 'bg-green-600', ringColor: 'ring-green-200',
          headerBg: 'bg-green-50', headerBorder: 'border-green-200',
          cardBorder: 'border-green-300', textColor: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-300',
        };
      case 'ValuationUpdated':
        return {
          icon: '📝', title: 'Valuation Updated',
          dotColor: 'bg-emerald-600', ringColor: 'ring-emerald-200',
          headerBg: 'bg-emerald-50', headerBorder: 'border-emerald-200',
          cardBorder: 'border-emerald-300', textColor: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'TaxPaid':
        return {
          icon: '💳', title: 'Tax Payment Recorded',
          dotColor: 'bg-emerald-600', ringColor: 'ring-emerald-200',
          headerBg: 'bg-emerald-50', headerBorder: 'border-emerald-200',
          cardBorder: 'border-emerald-300', textColor: 'text-emerald-800',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'TransferRequested':
        return {
          icon: '🧾', title: 'Transfer Requested',
          dotColor: 'bg-lime-600', ringColor: 'ring-lime-200',
          headerBg: 'bg-lime-50', headerBorder: 'border-lime-200',
          cardBorder: 'border-lime-300', textColor: 'text-lime-900',
          badge: 'bg-lime-100 text-lime-900 border-lime-300',
        };
      case 'OwnershipTransferred':
        return {
          icon: '🔄', title: 'Ownership Transferred',
          dotColor: 'bg-green-500', ringColor: 'ring-green-200',
          headerBg: 'bg-green-50', headerBorder: 'border-green-200',
          cardBorder: 'border-green-300', textColor: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-300',
        };
      case 'TransferRejected':
        return {
          icon: '⛔', title: 'Transfer Rejected',
          dotColor: 'bg-green-600', ringColor: 'ring-green-200',
          headerBg: 'bg-green-50', headerBorder: 'border-green-200',
          cardBorder: 'border-green-300', textColor: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-300',
        };
      case 'TransferWithdrawn':
        return {
          icon: '↩️', title: 'Transfer Withdrawn',
          dotColor: 'bg-green-600', ringColor: 'ring-green-200',
          headerBg: 'bg-green-50', headerBorder: 'border-green-200',
          cardBorder: 'border-green-300', textColor: 'text-green-800',
          badge: 'bg-green-100 text-green-800 border-green-300',
        };
      default:
        return {
          icon: '📋', title: type,
          dotColor: 'bg-green-500', ringColor: 'ring-green-200',
          headerBg: 'bg-green-50', headerBorder: 'border-green-200',
          cardBorder: 'border-green-300', textColor: 'text-green-700',
          badge: 'bg-green-100 text-green-700 border-green-300',
        };
    }
  };

  return (
    <div>
      <ResidentHeader />

      <VerificationForm pId={pId} setPId={setPId} verifyProperty={verifyProperty} loading={loading} />

      {paymentSuccessMsg && (
        <Alert type="success">
          <p className="font-semibold">✅ {paymentSuccessMsg}</p>
          <p className="text-xs mt-1 font-mono opacity-80 break-all">{paymentTxHash}</p>
        </Alert>
      )}

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
          <IntegrityBanner isVerified={isVerified} />

          <TabNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            timelineEvents={timelineEvents}
          />

          {activeTab === 'details' && (
            <DetailsTab
              displayData={displayData}
              originalData={originalData}
              isVerified={isVerified}
              isPaid={isPaid}
              handlePayTax={handlePayTax}
              userRole={userRole}
              newOwnerAddress={newOwnerAddress}
              setNewOwnerAddress={setNewOwnerAddress}
              newOwnerNic={newOwnerNic}
              setNewOwnerNic={setNewOwnerNic}
              openStampDutyModal={openStampDutyModal}
              handleWithdrawTransfer={handleWithdrawTransfer}
              withdrawProcessing={withdrawProcessing}
              transferStatus={transferStatus}
              transferTxHash={transferTxHash}
              transferError={transferError}
              transferLockedByTax={transferLockedByTax}
              transferLockedByLoan={transferLockedByLoan}
              isCorrupted={isCorrupted}
              isSimulating={isSimulating}
              simulateCorruption={simulateCorruption}
              resetData={resetData}
              logs={logs}
              history={history}
              deedRef={deedRef}
              isDownloadingPDF={isDownloadingPDF}
              downloadDeedPDF={downloadDeedPDF}
              ethers={ethers}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab timelineEvents={timelineEvents} getEventConfig={getEventConfig} />
          )}
        </>
      )}

      <StampDutyModal
        showStampDutyModal={showStampDutyModal}
        displayData={displayData}
        transferProcessing={transferProcessing}
        setShowStampDutyModal={setShowStampDutyModal}
        stampDutyAmount={stampDutyAmount}
        totalTransferPayable={totalTransferPayable}
        newOwnerAddress={newOwnerAddress}
        stampDutyPaid={stampDutyPaid}
        simulateStampDutyPayment={simulateStampDutyPayment}
        handleRequestTransfer={handleRequestTransfer}
      />

      <PaymentModal
        showPaymentModal={showPaymentModal}
        paymentStatus={paymentStatus}
        paymentTxHash={paymentTxHash}
        closePaymentModal={closePaymentModal}
        handleRealTaxPayment={handleRealTaxPayment}
        cardholderName={cardholderName}
        setCardholderName={setCardholderName}
        cardNumber={cardNumber}
        setCardNumber={setCardNumber}
        expiry={expiry}
        setExpiry={setExpiry}
        cvv={cvv}
        setCvv={setCvv}
        displayData={displayData}
      />
    </div>
  );
};

export default ResidentPortal;
