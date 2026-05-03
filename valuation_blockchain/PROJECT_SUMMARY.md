# Project Summary

## System Overview
This project is a blockchain-based property rating valuation platform with three integrated layers:

1. Smart contract layer for immutable property records and legal transfer workflow.
2. Backend automation engine for valuation, tax workflow, transfer orchestration, and AI legal summary generation.
3. React frontend with two role-oriented interfaces: Council Dashboard and Resident Portal.

The solution is designed to reduce corruption risk in municipal valuation systems through automated calculations, cryptographic integrity checks, and an immutable event trail.

## Core Features Implemented

### 1. Smart Contract Features
Primary file: contracts/ValuationRegistry.sol

1. Property lifecycle management:
   - Register property with owner address.
   - Update assessed value, annual tax, building age, and integrity document hash.
   - Retrieve complete property details for verification.
2. Access control:
   - Council-only actions enforced through onlyCouncil modifier for restricted operations.
3. Tax status management:
   - On-chain tax payment state (isPaid) and payment event logging.
4. Encumbrance control:
   - Bank-loan/mortgage state tracked with hasBankLoan.
   - Transfer flow can be blocked when encumbrance exists.
5. Two-step legal transfer workflow:
   - requestTransfer by owner or council.
   - approveTransfer by council to finalize ownership.
   - rejectTransfer and withdrawTransfer flows for pending requests.
   - Tax-paid and encumbrance-clear conditions are enforced before transfer.
6. Full event-driven auditability:
   - PropertyRegistered, ValuationUpdated, TaxPaid, TransferRequested, TransferRejected, TransferWithdrawn, OwnershipTransferred, and EncumbranceUpdated.

### 2. Backend Features
Primary file: backend/server.js

1. Automated valuation engine (Contractor's Test Method):
   - Zone-based construction rates (A, B, C).
   - Age-based depreciation (2%/year, capped at 50%).
   - Effective Capital Value (ECV), annual value (5% decapitalization), and tax (10% of annual value).
2. Integrity hash generation:
   - Hash generated from propertyId + assessedValue + tax for tamper detection.
3. Endpoints implemented:
   - POST /assess-property
   - POST /pay-tax
   - POST /transfer-property
   - POST /approve-transfer
   - POST /reject-transfer
   - POST /withdraw-transfer
   - GET /pending-transfers
   - POST /api/generate-title-summary
   - GET /health
4. Transfer queue construction:
   - Reads transfer request events and resolves currently pending requests.
5. AI legal summary generation:
   - Google Gemini integration for formal municipal transfer summary text.
   - Key rotation and retry logic.
   - Fallback template summary when AI is unavailable.
6. Wallet handling:
   - Custodial wallet creation for citizens/new owners via NIC-based flows.
7. Transaction reliability:
   - Manual nonce handling and explicit gas limit usage to reduce transaction sequencing issues.

### 3. Frontend Features
Primary files: frontend/src/pages/CouncilDashboard.jsx, frontend/src/pages/ResidentPortal.jsx

1. Council Dashboard:
   - Property assessment form and algorithm preview.
   - On-chain submission feedback with tx hash, block number, and valuation breakdown.
   - Transfer request creation (with NIC-based wallet generation path).
   - Pending transfer queue with approve/reject controls.
   - AI-generated legal title summary display after approval.
2. Resident Portal:
   - Property verification by ID against on-chain data.
   - Real-time integrity check (hash recomputation and comparison).
   - Corruption simulation flow:
     - Simulate tax tampering.
     - Detect hash mismatch instantly.
     - Restore original data state.
   - Tax payment UI flow connected to backend payment endpoint.
   - Legal transfer request initiation and pending request withdrawal.
   - Immutable event timeline and valuation history view.
   - Digital deed PDF export and QR code rendering.
3. Role-oriented UX:
   - Resident/Owner and Council workflow separation for clarity and governance alignment.

## End-to-End Functional Workflow

1. Council assesses property and records valuation on-chain.
2. Resident verifies valuation and integrity from blockchain data.
3. Resident settles tax payment.
4. Owner submits transfer request (if legal conditions are met).
5. Council reviews queue and approves or rejects.
6. On approval, ownership is finalized on-chain and legal summary is generated.
7. All actions remain visible in immutable event history.

## Technology Stack

1. Blockchain: Solidity, Hardhat, Ethers.js.
2. Backend: Node.js, Express, Ethers.js, dotenv, @google/genai.
3. Frontend: React (Vite), Tailwind CSS, Axios, Ethers.js, jsPDF, html2canvas, react-qr-code.

## Sepolia Deployment Guide

This project is already configured for Sepolia in hardhat.config.js and in frontend RPC usage.

### Prerequisites

1. A funded Sepolia wallet (test ETH).
2. Sepolia RPC endpoint.
3. Private key for deployment/admin wallet.

### 1) Configure Environment Variables

Set these values in environment files used by root Hardhat and backend:

1. SEPOLIA_RPC_URL
2. PRIVATE_KEY
3. GEMINI_API_KEY (optional for AI summary endpoint)

Important:

1. Never commit .env files.
2. If any key was exposed, rotate it before deployment.

### 2) Install Dependencies

Run from workspace root, backend, and frontend:

```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 3) Compile and Deploy Contract to Sepolia

From workspace root:

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Capture deployed contract address from command output.

### 4) Update Contract Address in Application

Update deployed address in both:

1. backend/server.js (CONTRACT_ADDRESS)
2. frontend/src/constants/config.js (CONTRACT_ADDRESS)

### 5) Start Backend and Frontend

```bash
cd backend
node server.js

cd ../frontend
npm run dev
```

### 6) Validate Sepolia Operation

1. Open frontend at local Vite URL.
2. Create an assessment from Council Dashboard.
3. Verify property from Resident Portal.
4. Confirm tx hashes and data on Sepolia block explorer.

Optional contract verification:

```bash
npx hardhat verify --network sepolia <DEPLOYED_CONTRACT_ADDRESS>
```

## Current Configuration Notes

1. Hardhat network config includes sepolia using SEPOLIA_RPC_URL and PRIVATE_KEY.
2. Frontend Resident Portal uses Sepolia RPC for read operations.
3. Backend provider uses RPC URL from environment, enabling Sepolia-backed write operations when configured.

## Deliverables Status

1. Smart contract layer: complete.
2. Backend automation/API layer: complete.
3. Frontend council/resident layer: complete.
4. Transfer governance and legal workflow: complete.
5. Integrity verification and corruption detection demo: complete.
6. Sepolia deployment path: documented and ready.