import { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'https://esm.sh/ethers@6.11.1';
import { BACKEND_URL } from '../constants/config';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../constants/config';
import AssessmentSection from './council/components/AssessmentSection';
import TransferSection from './council/components/TransferSection';

const CouncilDashboard = () => {
  const [form, setForm] = useState({ 
    propertyId: "", 
    propertyAddress: "",
    zone: "A", 
    sqFt: "", 
    nic: "", 
    buildingAge: "",
    ownershipDocs: null,
    propertyImages: null,
    latitude: "",
    longitude: "",
    status: "Pending",
    landSize: "",
    estimatedValue: ""
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

  const DOC_FILE_TYPES = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]);
  const MAX_DOC_SIZE_BYTES = 10 * 1024 * 1024;
  const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

  const getFileValidationError = (file, allowDocs, maxBytes) => {
    const isImage = file.type && file.type.startsWith('image/');
    const isDoc = DOC_FILE_TYPES.has(file.type);

    if (!(isImage || (allowDocs && isDoc))) {
      return `Unsupported file type: ${file.name}`;
    }

    if (file.size > maxBytes) {
      return `File too large: ${file.name}. Max ${Math.round(maxBytes / (1024 * 1024))}MB.`;
    }

    return null;
  };

  const validateFileList = (files, allowDocs, maxBytes) => {
    if (!files || files.length === 0) return null;
    for (const file of files) {
      const error = getFileValidationError(file, allowDocs, maxBytes);
      if (error) return error;
    }
    return null;
  };

  const validateCoordinates = (latitude, longitude) => {
    const lat = Number(latitude);
    const lon = Number(longitude);

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return 'Latitude and longitude must be valid numbers.';
    }

    if (lat < -90 || lat > 90) {
      return 'Latitude must be between -90 and 90.';
    }

    if (lon < -180 || lon > 180) {
      return 'Longitude must be between -180 and 180.';
    }

    return null;
  };

  const validateForm = () => {
    const coordinateError = validateCoordinates(form.latitude, form.longitude);
    if (coordinateError) return coordinateError;

    if (form.estimatedValue !== "" && Number(form.estimatedValue) < 0) {
      return 'Estimated value must be a positive number.';
    }

    const docsError = validateFileList(form.ownershipDocs, true, MAX_DOC_SIZE_BYTES);
    if (docsError) return docsError;

    const imagesError = validateFileList(form.propertyImages, false, MAX_IMAGE_SIZE_BYTES);
    if (imagesError) return imagesError;

    return null;
  };

  const handleOwnershipDocsChange = (e) => {
    const files = e.target.files;
    const error = validateFileList(files, true, MAX_DOC_SIZE_BYTES);
    if (error) {
      setStatus({ type: 'error', msg: ' Validation Failed', details: error });
      e.target.value = '';
      setForm((prev) => ({ ...prev, ownershipDocs: null }));
      return;
    }
    setForm((prev) => ({ ...prev, ownershipDocs: files }));
  };

  const handlePropertyImagesChange = (e) => {
    const files = e.target.files;
    const error = validateFileList(files, false, MAX_IMAGE_SIZE_BYTES);
    if (error) {
      setStatus({ type: 'error', msg: ' Validation Failed', details: error });
      e.target.value = '';
      setForm((prev) => ({ ...prev, propertyImages: null }));
      return;
    }
    setForm((prev) => ({ ...prev, propertyImages: files }));
  };

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
    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: 'error', msg: ' Validation Failed', details: validationError });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const hasFiles =
        (form.ownershipDocs && form.ownershipDocs.length > 0) ||
        (form.propertyImages && form.propertyImages.length > 0);

      let response;
      if (hasFiles) {
        const payload = new FormData();
        Object.entries(form).forEach(([key, value]) => {
          if (key === 'ownershipDocs' && value) {
            Array.from(value).forEach((file) => payload.append('ownershipDocs', file));
            return;
          }
          if (key === 'propertyImages' && value) {
            Array.from(value).forEach((file) => payload.append('propertyImages', file));
            return;
          }
          payload.append(key, value === "" ? "" : value);
        });

        response = await axios.post(`${BACKEND_URL}/assess-property`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        const payload = {
          ...form,
          estimatedValue: form.estimatedValue === "" ? null : form.estimatedValue
        };

        // Send data to Backend Automation Engine
        response = await axios.post(`${BACKEND_URL}/assess-property`, payload);
      }
      
      setStatus({
        type: 'success',
        msg: ` Success! Property recorded on blockchain.`,
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
      setForm({ 
        propertyId: "", 
        propertyAddress: "",
        zone: "A", 
        sqFt: "", 
        nic: "", 
        buildingAge: "",
        ownershipDocs: null,
        propertyImages: null,
        latitude: "",
        longitude: "",
        status: "Pending",
        landSize: "",
        estimatedValue: ""
      });
    } catch (err) {
      console.error(err);
      setStatus({ 
        type: 'error', 
        msg: " Transaction Failed. Is the Backend server running? Check console for details.",
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
        msg: ' Transfer Request Submitted',
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
          ? " Transfer Blocked: Tax Must Be Paid Before Land Transfer!" 
          : " Transfer Failed",
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
        msg: ' Transfer Approved and Finalized',
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
        msg: ' Ownership Transfer Finalized',
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
        msg: ' Approval Failed',
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
        msg: ' Transfer Request Rejected',
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
        msg: ' Rejection Failed',
        details: errorData?.error || err.message,
      });
    }

    setApprovalLoading(false);
  };

  return (
    <div>
      <AssessmentSection
        form={form}
        setForm={setForm}
        handleOwnershipDocsChange={handleOwnershipDocsChange}
        handlePropertyImagesChange={handlePropertyImagesChange}
        handleSubmit={handleSubmit}
        loading={loading}
        status={status}
      />

      <TransferSection
        transferForm={transferForm}
        setTransferForm={setTransferForm}
        handleTransferSubmit={handleTransferSubmit}
        transferLoading={transferLoading}
        pendingTransfers={pendingTransfers}
        pendingLoading={pendingLoading}
        pendingError={pendingError}
        loadPendingTransfers={loadPendingTransfers}
        approvalLoading={approvalLoading}
        handleApproveTransfer={handleApproveTransfer}
        handleRejectTransfer={handleRejectTransfer}
        approvalStatus={approvalStatus}
        transferStatus={transferStatus}
        legalSummary={legalSummary}
        legalSummaryLoading={legalSummaryLoading}
        legalSummaryError={legalSummaryError}
        legalSummaryWarning={legalSummaryWarning}
      />
    </div>
  );
};

export default CouncilDashboard;
