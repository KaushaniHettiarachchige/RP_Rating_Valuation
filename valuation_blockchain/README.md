# 🏰 Blockchain-Based Rating Valuation System



## 🎓 Research Project Overview

**Title:** Automated Rating Valuation System for Enhanced Efficiency and Accuracy: A Blockchain-Based Solution for Sri Jayewardenepura Kotte Municipal Council

**Type:** Final Year Software Engineering Research Project  
**Focus:** Solving tax corruption and data tampering using blockchain immutability  


---

## 🌟 Key Features

### 1. **Algorithmic Governance** - Eliminates Human Bias
- Multi-criteria valuation algorithm (Location + Size + Age)
- Automated depreciation calculation
- Transparent tax computation
- Zero human discretion = Zero corruption at source

### 2. **Cryptographic Integrity Verification** - Real-time Tampering Detection
- SHA-256 hash generation for all valuations
- Instant corruption detection (vs. months in traditional audits)
- Visual proof of data authenticity (✅ / ⚠️)
- **Live demonstration with "Simulate Database Hack" button**

### 3. **Immutable Audit Trail** - Historical Transparency
- Every valuation change recorded as blockchain event
- Cannot delete or modify past records
- Complete history visible to all stakeholders
- Proves blockchain immutability principle

### 4. **Dual Interface Design** - Complete Governance Workflow
- **Council Dashboard:** Assess properties and write to blockchain
- **Resident Portal:** Verify taxes and detect corruption
- User-friendly design for non-technical users

---

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- npm v9+
- Terminal/PowerShell

### Installation

```shell
# 1. Install dependencies
cd c:\Users\ACER\Desktop\valuation_blockchain
npm install

cd backend
npm install

cd ../frontend
npm install
```

### Running the System

**Terminal 1: Start Blockchain**
```shell
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat node
```

**Terminal 2: Deploy Contract**
```shell
npx hardhat run scripts/deploy.js --network localhost
# Copy the contract address that's displayed
```

**Terminal 3: Start Backend**
```shell
cd backend
node server.js
```

**Terminal 4: Start Frontend**
```shell
cd frontend
npm run dev
```

**Open Browser:** http://localhost:5173/

**Detailed Guide:** [QUICK_START.md](QUICK_START.md)

---

## 🎬 Live Demonstration (8 Minutes)

### 1. Assess a Property (Council Dashboard)
- Fill in property details
- Watch automated algorithm calculate tax
- Record on blockchain

### 2. Verify Tax (Resident Portal)
- Search by Property ID
- See ✅ INTEGRITY VERIFIED badge
- View complete audit trail

### 3. **🔴 Corruption Detection Demo** (Main Research Feature)
- Click "Simulate Database Hack"
- Watch system detect tampering instantly
- See ⚠️ DATA CORRUPTION DETECTED alert
- Restore original data

**Full Script:** [RESEARCH_DOCUMENTATION.md - Section: Research Demonstration Guide](RESEARCH_DOCUMENTATION.md#-research-demonstration-guide-for-exam-panel)

---



## 🛠️ Technology Stack

### Blockchain Layer
- **Hardhat** - Local Ethereum blockchain
- **Solidity ^0.8.0** - Smart contract language
- **Ethers.js v6** - Blockchain interaction library

### Backend Layer
- **Node.js v18+** - Runtime environment
- **Express.js** - API framework
- **Ethers.js** - Blockchain communication
- **Crypto** - SHA-256 hash generation

### Frontend Layer
- **React.js 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Ethers.js** - Web3 integration

---


## 📊 Research Impact

### Problem Solved
Traditional property tax systems suffer from:
- Human assessors accepting bribes to lower valuations
- Silent database tampering with no detection
- Deleted audit logs hiding corruption
- Months-long audit cycles before fraud discovery


---
