# 🚀 Quick Start Guide - 5 Minutes to Running System

## Prerequisites Check

```bash
# Verify Node.js installed (should be v18+)
node --version

# Verify npm installed (should be v9+)
npm --version
```

If not installed, download from: https://nodejs.org/

---

## Step-by-Step Setup

### 1. Open 4 Terminal Windows

**Terminal Layout:**
```
┌─────────────┬─────────────┐
│ Terminal 1  │ Terminal 2  │
│ (Blockchain)│ (Deploy)    │
├─────────────┼─────────────┤
│ Terminal 3  │ Terminal 4  │
│ (Backend)   │ (Frontend)  │
└─────────────┴─────────────┘
```

---

### 2. Terminal 1: Start Blockchain

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat node
```

**Wait for:** "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"

✅ **SUCCESS:** You should see 20 accounts with 10000 ETH each

❌ **ERROR:** "hardhat: command not found"  
   **Fix:** Run `npm install` in project root first

⚠️ **IMPORTANT:** Keep this terminal running! Don't close it!

---

### 3. Terminal 2: Deploy Contract

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Wait for:** 
```
✅ Contract deployed successfully!
📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

✅ **SUCCESS:** Copy the contract address

❌ **ERROR:** "Error HH108: Cannot connect to the network localhost"  
   **Fix:** Make sure Terminal 1 is still running the blockchain

---

### 4. Terminal 3: Start Backend

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain\backend
node server.js
```

**Wait for:**
```
╔═══════════════════════════════════════════════════╗
║   🚀 BLOCKCHAIN AUTOMATION ENGINE STARTED        ║
╚═══════════════════════════════════════════════════╝
```

✅ **SUCCESS:** You should see "⏳ Waiting for assessment requests..."

❌ **ERROR:** "Cannot find module 'express'"  
   **Fix:** Run `npm install` in the backend folder first

⚠️ **IMPORTANT:** Keep this terminal running!

---

### 5. Terminal 4: Start Frontend

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain\frontend
npm run dev
```

**Wait for:**
```
  ➜  Local:   http://localhost:5173/
```

✅ **SUCCESS:** Open browser at http://localhost:5173/

❌ **ERROR:** "Port 5173 is already in use"  
   **Fix:** Kill the process using port 5173 or change port in vite.config.js

---

## 🎯 Quick Test (2 Minutes)

### Test 1: Assess a Property

1. Open http://localhost:5173/
2. Click **"🏛️ Council Dashboard"** tab
3. Fill in:
   - Property ID: `101`
   - Zone: `A`
   - Square Footage: `2000`
   - Building Age: `10`
   - Owner Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
4. Click **"🚀 Assess & Record on Blockchain"**

**Expected:** ✅ Success message with transaction hash

---

### Test 2: Verify Property

1. Click **"👤 Resident Portal"** tab
2. Enter Property ID: `101`
3. Click **"✅ Verify"**

**Expected:** 
- ✅ INTEGRITY VERIFIED banner
- Property details displayed
- Audit trail showing 1 record

---

### Test 3: Corruption Detection Demo

1. While viewing property 101, scroll down
2. Click **"🔴 Simulate Database Hack"**

**Expected:**
- Tax value changes
- ✅ Green checkmark disappears
- ⚠️ **"DATA CORRUPTION DETECTED!"** appears
- Affected field turns red and pulses

3. Click **"🔄 Restore Original Data"**

**Expected:** Returns to ✅ INTEGRITY VERIFIED state

---

## ✅ System Status Checklist

Before your demo/presentation, verify all 4 terminals are showing:

```
☑️ Terminal 1: "Account #0", "Account #1", etc. (Blockchain running)
☑️ Terminal 2: Shows contract address (Can close after deploy)
☑️ Terminal 3: "⏳ Waiting for assessment requests..." (Backend running)
☑️ Terminal 4: "Local: http://localhost:5173/" (Frontend running)
☑️ Browser: System loads at http://localhost:5173/
```

---

## 🔄 Restart Instructions

If you need to restart everything:

### Full Reset:
```bash
# 1. Stop all terminals (Ctrl+C on each)

# 2. Terminal 1 - Restart blockchain
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat node

# 3. Terminal 2 - Redeploy contract
npx hardhat run scripts/deploy.js --network localhost

# 4. Terminal 3 - Restart backend
cd backend
node server.js

# 5. Terminal 4 - Restart frontend
cd ../frontend
npm run dev
```

---

## 🆘 Common Issues & Quick Fixes

### "Property Not Found" Error

**Cause:** Contract address mismatch

**Fix:**
1. Check deployed address in Terminal 2
2. Update `backend/server.js` line 14
3. Update `frontend/src/App.jsx` line 9
4. Restart backend and frontend

---

### "Transaction Failed" Error

**Cause:** Backend not connected to blockchain

**Fix:**
1. Verify Terminal 1 (blockchain) is running
2. Verify Terminal 3 (backend) shows "ENGINE STARTED"
3. Test: Open browser → http://localhost:3001/health
4. Should see: `{"status":"running"}`

---

### Frontend Shows Old Data

**Cause:** Browser cache

**Fix:**
1. Hard reload: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Or open DevTools (F12) → disable cache → reload

---

### "Nonce Has Already Been Used"

**Cause:** Blockchain state mismatch

**Fix:**
1. Stop Terminal 1 (Ctrl+C)
2. Restart blockchain: `npx hardhat node`
3. Redeploy contract (Terminal 2)
4. Restart backend (Terminal 3)

---

## 📞 Need More Help?

See full documentation: `RESEARCH_DOCUMENTATION.md`

---

## 🎓 For Your Presentation

### Opening Statement:
"I've developed a blockchain-based property tax system that eliminates corruption through automated valuation and cryptographic verification. Let me demonstrate the live corruption detection feature."

### Demo Flow (5 minutes):
1. **Assess** a property (Council Dashboard) - 1 min
2. **Verify** the property (Resident Portal) - 1 min  
3. **Demonstrate** corruption detection (Red Button) - 2 min
4. **Show** audit trail immutability - 1 min

### Closing Statement:
"This prototype demonstrates three key research contributions: algorithmic governance to eliminate bias, real-time corruption detection through cryptographic hashing, and immutable audit trails for historical transparency."

---

**Good Luck with Your Research Presentation! 🎓**
