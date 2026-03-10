# Automated Rating Valuation System - Research Prototype

## 🎓 Academic Project Information

**Title:** Automated Rating Valuation System for Enhanced Efficiency and Accuracy: A Blockchain-Based Solution for Sri Jayewardenepura Kotte Municipal Council

**Purpose:** Final Year Software Engineering Research Project  
**Research Focus:** Solving tax corruption and data tampering using blockchain immutability

---

## 📚 Table of Contents

1. [System Overview](#system-overview)
2. [Novelty Features (Research Contributions)](#novelty-features)
3. [Architecture](#architecture)
4. [Installation & Setup](#installation--setup)
5. [Running the System](#running-the-system)
6. [Testing the Corruption Detection Demo](#corruption-detection-demo)
7. [Technical Documentation](#technical-documentation)
8. [Research Demonstration Guide](#research-demonstration-guide)

---

## 🎯 System Overview

This system demonstrates a blockchain-based solution for property tax valuation that:
- **Eliminates human discretion** through algorithmic governance
- **Prevents corruption** through cryptographic hash verification
- **Maintains audit trails** through immutable blockchain ledgers
- **Detects data tampering** in real-time using integrity checks

### Three-Tier Architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React.js)                          │
│  • Council Dashboard (Write)  • Resident Portal (Read/Verify)  │
│  • Corruption Detection Demo  • Audit Trail Visualization      │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP API (axios)
┌─────────────────────▼───────────────────────────────────────────┐
│                  BACKEND (Node.js + Express)                    │
│  • Multi-Criteria Valuation Algorithm                          │
│  • SHA-256 Hash Generation    • Manual Nonce Management        │
│  • Blockchain Transaction Handling                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │ ethers.js
┌─────────────────────▼───────────────────────────────────────────┐
│            BLOCKCHAIN (Hardhat Local Network)                   │
│  • Smart Contract (ValuationRegistry.sol)                       │
│  • Immutable Ledger          • Event Logging                    │
│  • Access Control            • Public Verification              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💡 Novelty Features (Research Contributions)

### 1. Multi-Criteria Valuation Algorithm (Algorithmic Governance)

**Research Problem:** Traditional systems allow human assessors to arbitrarily set tax values, leading to corruption.

**Solution:** Fully automated algorithm that removes human discretion:

```
Formula:
  Base Value = Square Footage × Zone Rate
  Depreciation = Building Age × 1,000 LKR
  Final Value = Base Value - Depreciation (minimum 0)
  Tax Amount = Final Value × 4%

Zone Rates:
  Zone A (City Center): 5,000 LKR/sqft
  Zone B (Suburbs):     3,000 LKR/sqft
  Zone C (Rural):       1,000 LKR/sqft
```

**Research Significance:** Demonstrates algorithmic transparency and eliminates assessment bias.

---

### 2. Cryptographic Integrity Verification (Corruption Detection)

**Research Problem:** Traditional databases can be tampered with silently without detection.

**Solution:** SHA-256 hash generation and verification:

```javascript
// Backend generates hash:
hash = SHA256(propertyId + assessedValue + taxAmount)

// Frontend verifies integrity:
calculatedHash = SHA256(displayedId + displayedValue + displayedTax)
if (calculatedHash !== blockchainHash) {
  → CORRUPTION DETECTED!
}
```

**Research Significance:** Proves that blockchain can detect data tampering instantly, even if external databases are compromised.

---

### 3. Immutable Audit Trail (Event Logging)

**Research Problem:** Traditional systems allow deletion or modification of historical records to hide corruption.

**Solution:** Every valuation update is recorded as a blockchain event:

```solidity
event ValuationUpdated(
    uint256 indexed propertyId,
    uint256 value,
    uint256 tax,
    uint256 buildingAge,
    string docHash,
    uint256 timestamp
);
```

**Research Significance:** Demonstrates blockchain immutability - historical records cannot be deleted or altered without detection.

---

### 4. Live Corruption Demonstration (The "Red Button")

**Research Problem:** Difficult to demonstrate security to non-technical stakeholders.

**Solution:** Interactive demo that:
1. Displays genuine blockchain data with ✅ verification
2. Allows user to click "🔴 Simulate Database Hack"
3. Tamperes with displayed tax value (reduces by 50%)
4. System immediately detects mismatch and shows "⚠️ CORRUPTION DETECTED"

**Research Significance:** Provides tangible proof-of-concept for exam panels and stakeholders.

---

## 🏗️ Architecture

### Smart Contract Layer (`ValuationRegistry.sol`)

```solidity
struct Property {
    uint256 id;
    uint256 assessedValue;
    uint256 taxAmount;
    uint256 buildingAge;      // New field for depreciation
    address ownerAddress;
    string documentHash;       // SHA-256 integrity hash
    bool isRegistered;
}
```

**Key Functions:**
- `registerProperty()` - Initialize new property (Council only)
- `updateValuation()` - Record calculated tax (Council only)
- `getPropertyDetails()` - Public read access for verification
- `onlyCouncil` modifier - Access control

---

### Backend Layer (`server.js`)

**Endpoint:** `POST /assess-property`

**Request:**
```json
{
  "propertyId": "101",
  "zone": "A",
  "sqFt": "2000",
  "buildingAge": "10",
  "ownerAddress": "0x..."
}
```

**Process:**
1. Run valuation algorithm
2. Generate SHA-256 hash
3. Check if property registered
4. Register if new (with nonce management)
5. Update valuation (with nonce N+1)
6. Return transaction hash

**Response:**
```json
{
  "success": true,
  "txHash": "0xabc...",
  "blockNumber": 123,
  "valuation": "10000000",
  "tax": "400000",
  "integrityHash": "0xdef...",
  "algorithm": { /* breakdown */ }
}
```

---

### Frontend Layer (`App.jsx`)

#### Council Dashboard (Write Mode)
- Input form for property details
- Real-time algorithm preview
- Submit → Backend API → Blockchain
- Display transaction confirmation

#### Resident Portal (Read Mode + Verification)
- Search by property ID
- Fetch data from blockchain
- **Real-time integrity check:**
  - Calculate hash of displayed data
  - Compare with blockchain hash
  - Show ✅ or ⚠️ status
- Display audit trail (event history)
- **Corruption Demo Button:**
  - Tamper with displayed tax
  - System detects mismatch immediately

---

## 🚀 Installation & Setup

### Prerequisites

```bash
# Node.js (v18 or higher)
node --version

# npm (v9 or higher)
npm --version
```

### Step 1: Install Dependencies

```bash
# Root project (Hardhat + Smart Contract)
cd c:\Users\ACER\Desktop\valuation_blockchain
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Step 2: Verify Installation

```bash
# Check Hardhat
npx hardhat --version

# Check dependencies
npm list ethers hardhat
```

---

## 🏃 Running the System

### Terminal 1: Start Hardhat Blockchain

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

**⚠️ IMPORTANT:** Keep this terminal running! The blockchain stops if you close it.

---

### Terminal 2: Deploy Smart Contract

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output:**
```
Deploying ValuationRegistry contract...
----------------------------------------------------
✅ Contract deployed successfully!
📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
----------------------------------------------------
⚠️  SAVE THIS ADDRESS! You need it for the Backend & Frontend.
```

**📝 UPDATE CONFIGURATION:**

If the contract address is different, update these files:
1. `backend/server.js` → Line 14 (`CONTRACT_ADDRESS`)
2. `frontend/src/App.jsx` → Line 9 (`CONTRACT_ADDRESS`)

---

### Terminal 3: Start Backend Server

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain\backend
node server.js
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════╗
║   🚀 BLOCKCHAIN AUTOMATION ENGINE STARTED        ║
╚═══════════════════════════════════════════════════╝

📡 API Server: http://localhost:3001
📋 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🔗 Blockchain Network: Hardhat Local (http://127.0.0.1:8545)

✨ Features:
   • Multi-Criteria Valuation Algorithm
   • Automated Depreciation Calculation
   • SHA-256 Integrity Hash Generation
   • Manual Nonce Management

⏳ Waiting for assessment requests...
```

**⚠️ IMPORTANT:** Keep this terminal running! The backend handles all API requests.

---

### Terminal 4: Start Frontend

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain\frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**🌐 Open your browser:** http://localhost:5173/

---

## 🎯 Testing the Corruption Detection Demo

### Step 1: Assess a Property (Council Dashboard)

1. Click **"🏛️ Council Dashboard"** tab
2. Fill in the form:
   - Property ID: `101`
   - Zone: `A (City Center)`
   - Square Footage: `2000`
   - Building Age: `10`
   - Owner Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
3. Click **"🚀 Assess & Record on Blockchain"**

**Expected Result:**
```
✅ Success! Property recorded on blockchain.
Transaction Hash: 0x...
Calculated Assessed Value: LKR 10,000,000
Calculated Tax (4%): LKR 400,000
```

**Algorithm Verification:**
```
Zone A × 2000 sqft × 5,000 LKR/sqft = 10,000,000 LKR
Depreciation: 10 years × 1,000 = -10,000 LKR
Final Value: 9,990,000 LKR
Tax (4%): 399,600 LKR
```

---

### Step 2: Verify the Property (Resident Portal)

1. Click **"👤 Resident Portal"** tab
2. Enter Property ID: `101`
3. Click **"✅ Verify"**

**Expected Result:**
```
✅ INTEGRITY VERIFIED
Data matches blockchain signature. No tampering detected.

Property Information:
Property ID: 101
Building Age: 10 years
Assessed Value: LKR 9,990,000
Annual Tax: LKR 399,600
```

You should also see the **Audit Trail** showing all historical valuations.

---

### Step 3: Run the Corruption Demo

1. While viewing the property, scroll down to the **"🎯 Research Demo: Corruption Detection Test"** section
2. Click **"🔴 Simulate Database Hack"**

**What Happens:**
1. A popup appears: "🚨 CORRUPTION SIMULATED! A malicious actor has modified the database to reduce your tax by 50%."
2. The displayed tax changes from `LKR 399,600` to `LKR 199,800`
3. **The system immediately detects the tampering:**
   - ✅ Green checkmark disappears
   - ⚠️ Red warning appears: **"DATA CORRUPTION DETECTED!"**
   - The affected field highlights in red with pulsing animation
   - Message: "The displayed data does not match the blockchain hash. Someone has tampered with the database!"

**How It Works:**
```javascript
// Original blockchain data:
hash = SHA256("101" + "9990000" + "399600") = "0xabc..."

// After tampering:
calculatedHash = SHA256("101" + "9990000" + "199800") = "0xdef..."

// Verification:
if (calculatedHash !== blockchainHash) {
  → CORRUPTION DETECTED! ⚠️
}
```

4. Click **"🔄 Restore Original Data"** to reset

---

## 📖 Technical Documentation

### Smart Contract Gas Optimization

The contract uses `storage` pointers for updates to minimize gas costs:

```solidity
Property storage p = properties[_id];
p.assessedValue = _value;  // Direct storage modification
p.taxAmount = _tax;
```

### Backend Nonce Management

Critical for preventing "Nonce too low" errors:

```javascript
// Registration
let registrationNonce = await provider.getTransactionCount(wallet.address, 'latest');
await contract.registerProperty(id, owner, { nonce: registrationNonce });

// Update (must be N+1)
let updateNonce = registrationNonce + 1;
await contract.updateValuation(id, value, tax, age, hash, { nonce: updateNonce });
```

### Frontend Real-time Verification

```jsx
// Store original blockchain data
setOriginalData(blockchainData);

// Store display data (can be tampered)
setDisplayData({...blockchainData});

// Verify integrity on every render
const verifyIntegrity = () => {
  const calculatedHash = ethers.id(displayData.id + displayData.value + displayData.tax);
  return calculatedHash === originalData.hash;
};

// Render verification status
{verifyIntegrity() ? <GreenCheckmark /> : <RedAlert />}
```

---

## 🎓 Research Demonstration Guide (For Exam Panel)

### Research Questions to Address:

#### 1. "How does this solve tax corruption?"

**Answer:** 
- Traditional system: Human assessor can arbitrarily set tax values (e.g., accept bribes to lower taxes)
- Our system: Algorithm calculates tax automatically based on objective criteria (location, size, age)
- Result: No human can manipulate the valuation process

**Demo:** Show the algorithm breakdown in Council Dashboard

---

#### 2. "How does blockchain prevent data tampering?"

**Answer:**
- Traditional database: Anyone with admin access can modify records silently
- Our system: Data is cryptographically hashed and stored on blockchain
- Any modification to tax amount causes hash mismatch, immediately detected

**Demo:** Run the corruption detection demo (🔴 Simulate Database Hack button)

---

#### 3. "What if someone deletes the audit trail?"

**Answer:**
- Traditional system: Logs can be deleted to hide corruption
- Our system: Every change is recorded as a blockchain event (permanent)
- Even if server is destroyed, blockchain history remains

**Demo:** Show the Audit Trail section with multiple historical valuations

---

#### 4. "What are the research contributions?"

**Answer:**
1. **Algorithmic Governance:** Multi-criteria formula eliminates human bias
2. **Integrity Verification:** Real-time corruption detection using cryptographic hashing
3. **Immutable Audit Trail:** Historical transparency prevents record manipulation
4. **Practical Demo:** Interactive visualization of security concepts for stakeholders

---

### Demonstration Script (10 Minutes)

**Minute 1-2: Introduction**
- Open system at http://localhost:5173/
- Explain the dual-interface design (Council vs. Resident)

**Minute 3-5: Council Dashboard Demo**
- Input property details
- Show algorithm preview updating in real-time
- Submit and show transaction confirmation
- Explain backend automation

**Minute 6-7: Resident Verification**
- Search for the property
- Show ✅ verification badge
- Explain the hash verification process
- Display audit trail

**Minute 8-9: Corruption Detection Demo**
- Click "🔴 Simulate Database Hack"
- Show immediate detection
- Explain cryptographic principles
- Restore original data

**Minute 10: Research Significance**
- Summarize novel contributions
- Discuss real-world applicability
- Address scalability considerations

---

## 🔧 Troubleshooting

### Issue: Contract Address Mismatch

**Symptom:** "Property Not Found" errors

**Solution:**
1. Check the deployed contract address: `npx hardhat run scripts/deploy.js --network localhost`
2. Update `backend/server.js` line 14
3. Update `frontend/src/App.jsx` line 9
4. Restart backend and frontend

---

### Issue: Nonce Too Low

**Symptom:** "Nonce has already been used" error

**Solution:**
1. Stop Hardhat node (Ctrl+C)
2. Restart: `npx hardhat node`
3. Redeploy contract
4. Restart backend

---

### Issue: Backend Not Connecting

**Symptom:** "Transaction Failed" in frontend

**Solution:**
1. Check backend is running: Look for "🚀 BLOCKCHAIN AUTOMATION ENGINE STARTED"
2. Verify URL: Backend should be on `http://localhost:3001`
3. Check blockchain: `http://127.0.0.1:8545` should be accessible
4. Test backend health: Open browser → `http://localhost:3001/health`

---

### Issue: Frontend Not Updating

**Symptom:** Old values still showing

**Solution:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console for errors (F12)
3. Restart frontend: Ctrl+C then `npm run dev`

---

## 📊 System Requirements

### Minimum:
- CPU: Dual-core 2GHz
- RAM: 4GB
- Storage: 2GB free space
- OS: Windows 10/11, macOS 10.14+, Linux

### Recommended:
- CPU: Quad-core 2.5GHz+
- RAM: 8GB+
- Storage: 5GB+ SSD
- OS: Windows 11, macOS 12+, Ubuntu 20.04+

---

## 📄 License

This is an academic research project for educational purposes. Not licensed for commercial use.

---

## 👨‍💻 Development Team

**Student:** [Your Name]  
**Program:** Final Year Software Engineering  
**Institution:** [Your University]  
**Supervisor:** [Supervisor Name]

---

## 📧 Contact & Support

For questions regarding this research prototype, please contact: [your-email@example.com]

---

## 🙏 Acknowledgments

- **Hardhat Team** - Local blockchain framework
- **Ethers.js** - Ethereum interaction library
- **React.js & Vite** - Frontend framework
- **Tailwind CSS** - UI styling
- **Express.js** - Backend API framework

---

## 🔍 Future Research Directions

1. **Scalability Testing:** Deploy to public testnet (Goerli, Sepolia)
2. **Enhanced Algorithm:** Machine learning for zone rate prediction
3. **Mobile Application:** React Native version for field assessors
4. **Integration:** Connect to real municipal databases
5. **Decentralized Storage:** Use IPFS for property documents

---

**End of Documentation**

*Generated for Research Prototype v1.0*  
*Last Updated: December 2024*
