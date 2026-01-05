# ✅ Pre-Presentation Testing Checklist

## Use this checklist 24 hours before your demo/exam

---

## 🔍 Phase 1: Environment Setup (10 minutes)

### ☐ Step 1.1: Clean Installation Test

```bash
# Close all terminals and VSCode
# Restart your computer (fresh environment)

# Open fresh PowerShell and verify:
node --version   # Should show v18 or higher
npm --version    # Should show v9 or higher
```

**✅ PASS:** Version numbers displayed  
**❌ FAIL:** Command not found → Reinstall Node.js

---

### ☐ Step 1.2: Dependencies Check

```bash
cd c:\Users\ACER\Desktop\valuation_blockchain

# Check root dependencies
npm list ethers hardhat

# Check backend dependencies
cd backend
npm list express cors ethers

# Check frontend dependencies
cd ../frontend
npm list vite react
```

**✅ PASS:** All packages listed without errors  
**❌ FAIL:** Missing packages → Run `npm install` in respective folders

---

## 🚀 Phase 2: System Startup (15 minutes)

### ☐ Step 2.1: Blockchain Startup

```bash
# Terminal 1
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat node
```

**Expected Output Checklist:**
- ☐ "Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/"
- ☐ Lists Account #0 through Account #19
- ☐ Each account shows "10000 ETH"
- ☐ Account #0 private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

**✅ PASS:** All items checked  
**❌ FAIL:** Error messages → See troubleshooting section

---

### ☐ Step 2.2: Contract Deployment

```bash
# Terminal 2
cd c:\Users\ACER\Desktop\valuation_blockchain
npx hardhat run scripts/deploy.js --network localhost
```

**Expected Output Checklist:**
- ☐ "Deploying ValuationRegistry contract..."
- ☐ "✅ Contract deployed successfully!"
- ☐ Shows contract address (starts with 0x...)
- ☐ No error messages

**Critical Action:**
- ☐ Copy the contract address
- ☐ Verify it matches in `backend/server.js` line 14
- ☐ Verify it matches in `frontend/src/App.jsx` line 9

**✅ PASS:** Contract deployed and addresses match  
**❌ FAIL:** Address mismatch → Update files and restart backend/frontend

---

### ☐ Step 2.3: Backend Startup

```bash
# Terminal 3
cd c:\Users\ACER\Desktop\valuation_blockchain\backend
node server.js
```

**Expected Output Checklist:**
- ☐ "🚀 BLOCKCHAIN AUTOMATION ENGINE STARTED" (in box)
- ☐ "📡 API Server: http://localhost:3001"
- ☐ Shows correct contract address
- ☐ "🔗 Blockchain Network: Hardhat Local (http://127.0.0.1:8545)"
- ☐ Lists features (Multi-Criteria Algorithm, etc.)
- ☐ "⏳ Waiting for assessment requests..."

**✅ PASS:** All items checked, no error messages  
**❌ FAIL:** Cannot connect → Check Terminal 1 is running

---

### ☐ Step 2.4: Frontend Startup

```bash
# Terminal 4
cd c:\Users\ACER\Desktop\valuation_blockchain\frontend
npm run dev
```

**Expected Output Checklist:**
- ☐ "VITE v5.x.x ready in [X] ms"
- ☐ "➜ Local: http://localhost:5173/"
- ☐ No compilation errors
- ☐ No missing module errors

**✅ PASS:** Server started successfully  
**❌ FAIL:** Port already in use → Change port or kill process

---

### ☐ Step 2.5: Browser Access

```bash
# Open browser (Chrome, Firefox, or Edge recommended)
# Navigate to: http://localhost:5173/
```

**Expected Visual Checklist:**
- ☐ Page loads without errors
- ☐ Header shows: "Sri Jayewardenepura Kotte Municipal Council"
- ☐ Subtitle: "Blockchain-Based Rating Valuation System"
- ☐ Two navigation buttons visible:
  - ☐ "👤 Resident Portal"
  - ☐ "🏛️ Council Dashboard"
- ☐ Footer shows: "Final Year Software Engineering Research Project"
- ☐ No console errors (F12 → Console tab should be clean)

**✅ PASS:** UI loads correctly  
**❌ FAIL:** Blank page or errors → Check browser console for details

---

## 🧪 Phase 3: Functional Testing (20 minutes)

### ☐ Test 3.1: Property Assessment (Council Dashboard)

1. Click "🏛️ Council Dashboard" button
2. Fill in the form:
   - **Property ID:** `101`
   - **Location Zone:** `A (City Center)`
   - **Square Footage:** `2000`
   - **Building Age:** `10`
   - **Owner Address:** `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

3. Click "🚀 Assess & Record on Blockchain"

**Expected Results:**
- ☐ Button shows "⏳ Processing Algorithm..." (brief)
- ☐ Backend Terminal 3 shows:
  - ☐ "📥 NEW ASSESSMENT REQUEST RECEIVED"
  - ☐ "🤖 RUNNING VALUATION ALGORITHM..."
  - ☐ Shows calculations:
    - Base Value: 10,000,000 LKR
    - Depreciation: -10,000 LKR
    - Final Value: 9,990,000 LKR
    - Tax: 399,600 LKR
  - ☐ "🔐 GENERATING INTEGRITY HASH..."
  - ☐ "⛓️ WRITING TO BLOCKCHAIN..."
  - ☐ "✅ SUCCESS! Property recorded on immutable ledger."

- ☐ Frontend shows green success box with:
  - ☐ "✅ Success! Property recorded on blockchain."
  - ☐ Transaction Hash displayed
  - ☐ Block number displayed
  - ☐ Calculated Assessed Value: LKR 9,990,000
  - ☐ Calculated Tax: LKR 399,600
  - ☐ Algorithm breakdown matches backend calculations

**✅ PASS:** All items checked  
**❌ FAIL:** Transaction failed → Check error message in Terminal 3

---

### ☐ Test 3.2: Property Verification (Resident Portal)

1. Click "👤 Resident Portal" button
2. Enter Property ID: `101`
3. Click "✅ Verify"

**Expected Results:**
- ☐ Button shows "🔄 Checking..." (brief)
- ☐ Green banner appears: "✅ INTEGRITY VERIFIED"
- ☐ Message: "Data matches blockchain signature. No tampering detected."
- ☐ Property Information card shows:
  - ☐ Property ID: 101
  - ☐ Building Age: 10 years
  - ☐ Assessed Value: LKR 9,990,000 (with green border)
  - ☐ Annual Tax: LKR 399,600 (with green border)
  - ☐ Owner Wallet Address: 0xf39Fd6...
- ☐ Integrity Hash displayed (long hexadecimal string)
- ☐ Audit Trail section shows 1 record

**✅ PASS:** All data matches assessment  
**❌ FAIL:** Property not found → Ensure Test 3.1 passed

---

### ☐ Test 3.3: Corruption Detection Demo

**CRITICAL TEST - THIS IS YOUR MAIN RESEARCH DEMO**

1. While viewing Property 101 (from Test 3.2)
2. Scroll down to "🎯 Research Demo: Corruption Detection Test"
3. Click "🔴 Simulate Database Hack" button

**Expected Results (MUST ALL OCCUR):**
- ☐ Alert popup appears:
  - ☐ "🚨 CORRUPTION SIMULATED!"
  - ☐ Message explains tax was reduced by 50%
- ☐ Click OK to dismiss alert
- ☐ Tax value changes from LKR 399,600 → LKR 199,800
- ☐ ✅ Green "INTEGRITY VERIFIED" banner disappears
- ☐ ⚠️ Red banner appears: "DATA CORRUPTION DETECTED!"
- ☐ Message: "The displayed data does not match the blockchain hash. Someone has tampered with the database!"
- ☐ Tax field turns red with red border
- ☐ Tax field has pulsing animation
- ☐ Warning text below tax: "⚠️ This value has been altered!"
- ☐ Property card background changes to red tint
- ☐ "TAMPERED" badge appears next to "Property Information" header

**Visual Verification:**
- ☐ Original blockchain hash still displayed (unchanged)
- ☐ All other fields remain correct (only tax is tampered)
- ☐ Audit trail still shows original value (LKR 399,600)

4. Click "🔄 Restore Original Data" button

**Expected Results:**
- ☐ Tax returns to LKR 399,600
- ☐ ✅ Green "INTEGRITY VERIFIED" banner returns
- ☐ ⚠️ Red warning disappears
- ☐ All red highlights return to green/normal
- ☐ "TAMPERED" badge disappears

**✅ PASS:** All corruption detection features work  
**❌ FAIL:** This is your main demo - must debug immediately!

---

### ☐ Test 3.4: Audit Trail Verification

1. Still viewing Property 101
2. Scroll to "📜 Immutable Audit Trail" section

**Expected Results:**
- ☐ Header shows: "Immutable Audit Trail"
- ☐ Badge shows: "1 Record" (or more if you tested multiple times)
- ☐ First record has:
  - ☐ "⭐ CURRENT" badge
  - ☐ Block number displayed
  - ☐ Assessed Value: LKR 9,990,000
  - ☐ Tax Amount: LKR 399,600
  - ☐ Building Age: 10 years
  - ☐ Gradient background (indigo to purple)
- ☐ Bottom info box shows research significance explanation

**✅ PASS:** Audit trail displays correctly  
**❌ FAIL:** No records shown → Check blockchain events

---

### ☐ Test 3.5: Multiple Properties Test

Repeat Test 3.1 with different data:

**Property #102:**
- Property ID: `102`
- Zone: `B (Suburbs)`
- Square Footage: `1500`
- Building Age: `5`
- Owner Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Account #1)

**Expected Calculations:**
- Base Value: 1500 × 3000 = 4,500,000 LKR
- Depreciation: 5 × 1000 = 5,000 LKR
- Final Value: 4,495,000 LKR
- Tax: 179,800 LKR

**Verify:**
- ☐ Assessment succeeds
- ☐ Can verify Property 102 in Resident Portal
- ☐ Both Property 101 and 102 exist independently
- ☐ Switching between properties shows correct data

**✅ PASS:** Multiple properties work independently  
**❌ FAIL:** Data mixing → Check property ID handling

---

### ☐ Test 3.6: Edge Cases

**Test A: Zero Age Property**
- Property ID: `103`
- Building Age: `0`
- Expected: No depreciation, full base value

☐ PASS / ☐ FAIL

**Test B: Old Building (High Depreciation)**
- Property ID: `104`
- Square Footage: `1000`
- Zone: `C`
- Building Age: `100`
- Expected: 
  - Base: 1,000,000 LKR
  - Depreciation: 100,000 LKR
  - Final: 900,000 LKR
  - Tax: 36,000 LKR

☐ PASS / ☐ FAIL

**Test C: Depreciation Exceeds Value**
- Property ID: `105`
- Square Footage: `100`
- Zone: `C`
- Building Age: `200`
- Expected:
  - Base: 100,000 LKR
  - Depreciation: 200,000 LKR
  - Final: 0 LKR (minimum)
  - Tax: 0 LKR

☐ PASS / ☐ FAIL

---

## 🎬 Phase 4: Presentation Readiness (10 minutes)

### ☐ Step 4.1: Visual Quality Check

Open browser at http://localhost:5173/ and verify:

- ☐ No scrollbars on main view (fits standard screen)
- ☐ Text is readable from 2 meters away (for projector)
- ☐ Colors are distinct (✅ green vs ⚠️ red)
- ☐ Animations work smoothly (no lag)
- ☐ Emojis display correctly (🏰 🔴 ⚠️)
- ☐ No lorem ipsum or placeholder text
- ☐ All spelling correct

---

### ☐ Step 4.2: Terminal Cleanup

Prepare clean terminal views for demo:

**Terminal 1 (Blockchain):**
- ☐ Clear scrollback: Right-click → Clear Buffer
- ☐ Adjust font size for readability
- ☐ Position on left side of screen

**Terminal 3 (Backend):**
- ☐ Clear previous logs: Restart server
- ☐ Shows clean "Waiting for requests" message
- ☐ Position on right side of screen

**Terminal 4 (Frontend):**
- ☐ Can be minimized (not needed during demo)

---

### ☐ Step 4.3: Browser Setup

- ☐ Close all other tabs (only valuation system open)
- ☐ Exit full-screen mode (F11) for easier navigation
- ☐ Clear browser cache: Ctrl+Shift+Delete → Clear
- ☐ Disable browser notifications
- ☐ Set zoom to 100% (Ctrl+0)
- ☐ Open DevTools (F12) on separate monitor (if available)
  - ☐ Console tab clean (no errors)
  - ☐ Network tab ready to show requests

---

### ☐ Step 4.4: Demo Script Rehearsal

**Practice this exact sequence 3 times:**

1. **[30 seconds] Introduction**
   - "This is a blockchain-based property tax system..."
   - Point to three components on screen

2. **[2 minutes] Assessment Demo**
   - Switch to Council Dashboard
   - Fill form with Property 101 data
   - Explain algorithm while typing
   - Click submit
   - Show backend terminal processing
   - Show success message

3. **[2 minutes] Verification Demo**
   - Switch to Resident Portal
   - Enter Property ID 101
   - Show ✅ verification badge
   - Explain integrity hash concept

4. **[2 minutes] Corruption Detection Demo**
   - Click "🔴 Simulate Database Hack"
   - Wait for alert, explain corruption scenario
   - Point to ⚠️ detection
   - Explain hash mismatch
   - Click restore

5. **[1 minute] Audit Trail**
   - Scroll to audit trail
   - Explain immutability
   - Mention research significance

**Timing Checkboxes:**
- ☐ Full demo completes in under 8 minutes
- ☐ No fumbling with keyboard/mouse
- ☐ Can explain while clicking (no silent periods)
- ☐ Can answer "why" questions at any point

---

### ☐ Step 4.5: Backup Plan Preparation

**Create emergency backup:**

1. Take screenshots of each major view:
   - ☐ Council Dashboard (blank form)
   - ☐ Council Dashboard (success message)
   - ☐ Resident Portal (verified property)
   - ☐ Corruption detection (red warning)
   - ☐ Audit trail

2. Save to: `c:\Users\ACER\Desktop\valuation_blockchain\demo_screenshots\`

3. Test screen recording:
   - ☐ Record full demo (8 minutes)
   - ☐ Save to: `c:\Users\ACER\Desktop\valuation_blockchain\demo_video.mp4`
   - ☐ Test playback (audio clear, video smooth)

**If live demo fails:**
- ☐ Have screenshots ready
- ☐ Can narrate using recorded video
- ☐ Explain "this is what it looks like when working"

---

## 🔒 Phase 5: Final Security Checks (5 minutes)

### ☐ Step 5.1: Data Privacy

- ☐ No real personal data in demo (all test data)
- ☐ No sensitive API keys exposed in code
- ☐ Private keys are only test keys (never use real keys!)
- ☐ No production blockchain addresses

---

### ☐ Step 5.2: Academic Integrity

- ☐ All code is your own or properly attributed
- ☐ Documentation cites sources (RESEARCH_NOVELTIES.md)
- ☐ No plagiarized content in comments
- ☐ README.md has your name and thesis title

---

### ☐ Step 5.3: System Stability

**Run this stress test:**

```bash
# Assess 5 properties in rapid succession
# Property IDs: 201, 202, 203, 204, 205
```

- ☐ All 5 transactions succeed
- ☐ No "nonce too low" errors
- ☐ Backend doesn't crash
- ☐ Frontend doesn't freeze
- ☐ Blockchain logs all transactions

---

## 📋 Final Pre-Demo Checklist (1 hour before)

### Hardware & Environment:
- ☐ Laptop fully charged (or plugged in)
- ☐ Power adapter available
- ☐ HDMI/VGA adapter tested (if using projector)
- ☐ Backup laptop available (with system running)
- ☐ Internet connection not required (runs locally)
- ☐ Room lighting appropriate (screen visible)

### Software State:
- ☐ All 4 terminals open and positioned
- ☐ Terminal 1: Blockchain running
- ☐ Terminal 3: Backend running
- ☐ Terminal 4: Frontend running (minimized)
- ☐ Browser: System loaded at http://localhost:5173/
- ☐ No Windows updates pending
- ☐ Antivirus won't interrupt (whitelist Node.js)

### Documentation:
- ☐ RESEARCH_DOCUMENTATION.md open in editor
- ☐ RESEARCH_NOVELTIES.md printed (1 copy)
- ☐ QUICK_START.md available for panel
- ☐ Code printed (if required by panel)
- ☐ USB backup drive with full project

### Mental Preparation:
- ☐ Practiced demo 3+ times
- ☐ Can explain each novelty feature
- ☐ Know how to handle questions
- ☐ Backup plan ready if demo fails
- ☐ Confident in research contributions

---

## 🆘 Emergency Troubleshooting (During Demo)

### If blockchain crashes:
1. ☐ Don't panic - close Terminal 1
2. ☐ Restart: `npx hardhat node`
3. ☐ Terminal 2: Redeploy contract
4. ☐ Terminal 3: Restart backend
5. ☐ Browser: Refresh page
6. ☐ While system restarts, explain: "This is running on a local test blockchain. In production, this would be a distributed network that stays online 24/7."

### If frontend freezes:
1. ☐ Open backup browser tab
2. ☐ Navigate to http://localhost:5173/
3. ☐ Continue demo

### If nothing works:
1. ☐ Show recorded video
2. ☐ Walk through screenshots
3. ☐ Explain: "The system is fully functional - this is a technical difficulty with the presentation environment. I can demonstrate it working after the session."
4. ☐ Focus on explaining concepts using documentation

---

## ✅ FINAL SIGN-OFF

**I certify that:**

- ☐ All 5 phases of testing completed successfully
- ☐ Every test marked as PASS
- ☐ Demo rehearsed 3+ times
- ☐ Backup materials prepared
- ☐ System is stable and ready
- ☐ I understand all research contributions
- ☐ I can explain the code if asked
- ☐ I am confident in my presentation

**Date:** ________________  
**Time:** ________________  
**Signature:** ________________

---

## 🎯 Expected Questions & Answers

**Q: Why blockchain instead of a regular database?**  
A: Regular databases can be silently modified by administrators. Blockchain provides cryptographic proof of any tampering, creating accountability.

**Q: How does the hash detect corruption?**  
A: SHA-256 generates a unique fingerprint of the data. If even one digit changes, the entire hash changes, making tampering obvious.

**Q: What if the government doesn't want blockchain?**  
A: The same principles can be applied with digital signatures and audit logs. Blockchain is the most robust implementation, but the concepts transfer.

**Q: Is this scalable to millions of properties?**  
A: This prototype uses a local blockchain for demonstration. Production would use optimized solutions like Hyperledger or private Ethereum networks, proven to handle millions of transactions.

**Q: What's the cost to implement?**  
A: Initial setup: ~$50,000 (infrastructure). Ongoing: ~$10,000/year (hosting). Traditional system costs ~$100,000/year in staff salaries. ROI: 2 years.

---

**Good luck with your presentation! 🎓🚀**

*Remember: Your research solves a real problem. Be confident!*
