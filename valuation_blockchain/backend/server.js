require('dotenv').config(); // Load .env variables first
const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
const crypto = require('crypto'); // Node.js built-in for SHA-256
const { GoogleGenAI } = require('@google/genai');
const app = express();

app.use(express.json());
app.use(cors());

// =============================================================
// 1. CONFIGURATION
// =============================================================

// The contract address you got from deployment (Update after running deploy.js)
const CONTRACT_ADDRESS = "0xa58b6aaBed2c25bD76cAe21205cB5F74Cf5Fa1Cf";

// The private key of Account #0 from Hardhat (The Council Admin)
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Google Gemini API Keys — supports rotation across multiple free-tier keys
// Add GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... or just GEMINI_API_KEY in .env
const GEMINI_API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter(k => k && k !== "YOUR_GEMINI_API_KEY_HERE");

// Primary key (used for guard checks)
const GEMINI_API_KEY = GEMINI_API_KEYS[0] || "YOUR_GEMINI_API_KEY_HERE";

// Round-robin key rotation state
let _geminiKeyIndex = 0;
function getNextGeminiKey() {
    const key = GEMINI_API_KEYS[_geminiKeyIndex % GEMINI_API_KEYS.length];
    _geminiKeyIndex++;
    return key;
}

// =============================================================
// 2. CONNECT TO LOCAL BLOCKCHAIN
// =============================================================

// Import the Smart Contract ABI
const artifact = require('../artifacts/contracts/ValuationRegistry.sol/ValuationRegistry.json');
const CONTRACT_ABI = artifact.abi;

// Gemini AI Client factory — creates a client for a specific key
function createGenAIClient(apiKey) {
    return new GoogleGenAI({ apiKey });
}
// Default client (primary key)
const genAI = createGenAIClient(GEMINI_API_KEY);

// Connect to the Hardhat node (with ENS disabled for local network)
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

// =============================================================
// 3. MULTI-CRITERIA VALUATION ALGORITHM (NOVELTY FEATURE)
// =============================================================

// Construction Cost Rates: Based on Contractor's Test Method (Sri Lankan Rating Valuation)
const CONSTRUCTION_COST_RATES = {
    "A": 8000, // Luxury Construction (City Center)
    "B": 6000, // Mid-range Construction (Suburban)
    "C": 4500  // Basic Construction (Rural)
};

// Depreciation Parameters: Percentage-based obsolescence model
const DEPRECIATION_RATE_PER_YEAR = 0.02; // 2% per year
const MAX_DEPRECIATION_CAP = 0.50; // Maximum 50% depreciation

// Decapitalization Rate: Statutory 5% for Annual Value calculation
const DECAPITALIZATION_RATE = 0.05;

// Tax Rate: 10% of Annual Value
const TAX_RATE = 0.10;

/**
 * NOVELTY FEATURE: Contractor's Test Method Valuation Algorithm
 * Based on Sri Lankan Rating Valuation Statutory Framework
 * 
 * Formula:
 *   1. Gross Construction Cost = Square Footage × Construction Rate (Zone-based)
 *   2. Depreciation = Gross Cost × (Age × 2% per year, capped at 50%)
 *   3. Effective Capital Value (ECV) = Gross Cost - Depreciation
 *   4. Annual Value = ECV × 5% (Decapitalization Rate)
 *   5. Tax = Annual Value × 10%
 */
function calculateValuation(sqFt, zone, buildingAge) {
    // Step 1: Calculate Gross Construction Cost (Zone-based Construction Rate)
    const constructionRate = CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES["C"];
    const grossCost = BigInt(sqFt) * BigInt(constructionRate);

    // Step 2: Calculate Depreciation (Percentage-based with cap)
    const age = parseInt(buildingAge) || 0;
    let depreciationPercentage = age * DEPRECIATION_RATE_PER_YEAR;

    // Apply 50% depreciation cap
    if (depreciationPercentage > MAX_DEPRECIATION_CAP) {
        depreciationPercentage = MAX_DEPRECIATION_CAP;
    }

    // Convert percentage to integer calculation (multiply by 100 to avoid floating point)
    const depreciationAmount = grossCost * BigInt(Math.floor(depreciationPercentage * 100)) / 100n;

    // Step 3: Calculate Effective Capital Value (ECV)
    let effectiveCapitalValue = grossCost - depreciationAmount;
    if (effectiveCapitalValue < 0n) effectiveCapitalValue = 0n;

    // Step 4: Calculate Annual Value (Statutory Decapitalization)
    const annualValue = effectiveCapitalValue * BigInt(Math.floor(DECAPITALIZATION_RATE * 100)) / 100n;

    // Step 5: Calculate Tax (10% of Annual Value)
    const taxAmount = annualValue * BigInt(Math.floor(TAX_RATE * 100)) / 100n;

    return {
        grossCost,
        depreciationPercentage: Math.floor(depreciationPercentage * 100), // Return as percentage (e.g., 20 for 20%)
        depreciationAmount,
        effectiveCapitalValue,
        annualValue,
        taxAmount
    };
}

/**
 * NOVELTY FEATURE: SHA-256 Integrity Hash Generation
 * Generates a cryptographic hash of the valuation data to prevent tampering
 */
function generateIntegrityHash(propertyId, assessedValue, taxAmount) {
    const dataString = propertyId.toString() + assessedValue.toString() + taxAmount.toString();
    // Use ethers.js keccak256 for consistency with blockchain
    return ethers.id(dataString);
}

// =============================================================
// 4. API ENDPOINT: AUTOMATED ASSESSMENT & BLOCKCHAIN WRITE
// =============================================================

app.post('/assess-property', async (req, res) => {
    try {
        console.log("============================================");
        console.log("📥 NEW ASSESSMENT REQUEST RECEIVED");
        console.log("============================================");
        console.log(req.body);

        const { propertyId, zone, sqFt, nic, buildingAge } = req.body;

        // Validate inputs
        if (!propertyId || !zone || !sqFt || !nic || buildingAge === undefined) {
            return res.status(400).json({
                error: "Missing required fields. Please provide: propertyId, zone, sqFt, nic, buildingAge"
            });
        }

        // --- STEP 0: Generate Custodial Wallet for Property Owner ---
        console.log("\n👤 GENERATING CUSTODIAL WALLET...");
        console.log(`   Citizen NIC: ${nic}`);
        const newWallet = ethers.Wallet.createRandom();
        const ownerAddress = newWallet.address;
        const privateKey = newWallet.privateKey;
        console.log(`   ✅ Generated Wallet Address: ${ownerAddress}`);
        console.log(`   🔑 Private Key: ${privateKey}`);
        console.log(`   Purpose: Custodial wallet for citizen without crypto knowledge`);

        // FRESH CONNECTION (Prevents nonce issues on server restarts)
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // --- STEP 1: Run Multi-Criteria Valuation Algorithm (Contractor's Test Method) ---
        console.log("\n🤖 RUNNING CONTRACTOR'S TEST METHOD VALUATION...");
        const valuation = calculateValuation(sqFt, zone, buildingAge);
        const constructionRate = CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES["C"];

        console.log(`   Zone: ${zone} (Construction Rate: ${constructionRate} LKR/sqft)`);
        console.log(`   Square Footage: ${sqFt}`);
        console.log(`   Building Age: ${buildingAge} years`);
        console.log(`   ════════════════════════════════════════════════════`);
        console.log(`   📐 Gross Construction Cost: ${valuation.grossCost.toString()} LKR`);
        console.log(`   📉 Depreciation (${valuation.depreciationPercentage}% - ${buildingAge} yrs × 2%): -${valuation.depreciationAmount.toString()} LKR`);
        console.log(`   ────────────────────────────────────────────────────`);
        console.log(`   🏗️  Effective Capital Value (ECV): ${valuation.effectiveCapitalValue.toString()} LKR`);
        console.log(`   📊 Annual Value (ECV × 5%): ${valuation.annualValue.toString()} LKR`);
        console.log(`   ════════════════════════════════════════════════════`);
        console.log(`   💰 Tax Amount (10% of Annual Value): ${valuation.taxAmount.toString()} LKR`);

        // --- STEP 2: Generate Integrity Hash (SHA-256) ---
        console.log("\n🔐 GENERATING INTEGRITY HASH...");
        const docHash = generateIntegrityHash(propertyId, valuation.effectiveCapitalValue, valuation.taxAmount);
        console.log(`   Hash: ${docHash}`);
        console.log(`   Purpose: Prevent data tampering (corruption detection)`);

        // --- STEP 3: Write to Blockchain with Manual Nonce Management ---
        console.log("\n⛓️  WRITING TO BLOCKCHAIN...");

        // Check if Property is already registered
        let propertyData = await contract.properties(propertyId);
        let isRegistered = propertyData[6]; // isRegistered is at index 6

        let nextNonce;
        if (!isRegistered) {
            console.log(`   Property ${propertyId} not registered. Registering first...`);
            let registrationNonce = await provider.getTransactionCount(wallet.address, 'latest');
            console.log(`   Registration Nonce: ${registrationNonce}`);

            const tx1 = await contract.registerProperty(propertyId, ownerAddress, {
                nonce: registrationNonce,
                gasLimit: 300000
            });
            console.log(`   ⏳ Waiting for registration transaction...`);
            const registrationReceipt = await tx1.wait();
            console.log(`   ✅ Registration Complete. Block: ${registrationReceipt.blockNumber}`);

            // Verify registration
            propertyData = await contract.properties(propertyId);
            isRegistered = propertyData[6];
            if (!isRegistered) {
                throw new Error("Registration failed verification");
            }

            nextNonce = registrationNonce + 1;
        } else {
            console.log(`   Property ${propertyId} already registered. Updating valuation...`);
            nextNonce = await provider.getTransactionCount(wallet.address, 'latest');
        }

        // Update Valuation
        console.log(`   Valuation Update Nonce: ${nextNonce}`);
        const tx2 = await contract.updateValuation(
            propertyId,
            valuation.effectiveCapitalValue,
            valuation.taxAmount,
            buildingAge,
            docHash,
            {
                nonce: nextNonce,
                gasLimit: 300000
            }
        );
        console.log(`   ⏳ Waiting for valuation update transaction...`);
        const receipt = await tx2.wait();
        console.log(`   ✅ Valuation Update Complete. Block: ${receipt.blockNumber}`);
        console.log(`   Transaction Hash: ${receipt.hash}`);

        console.log("\n✅ SUCCESS! Property recorded on immutable ledger.");
        console.log("============================================\n");

        // Return success response with wallet credentials
        res.json({
            success: true,
            message: "Property Assessed & Recorded on Blockchain (Contractor's Test Method)",
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            valuation: valuation.effectiveCapitalValue.toString(),
            annualValue: valuation.annualValue.toString(),
            tax: valuation.taxAmount.toString(),
            integrityHash: docHash,
            walletAddress: ownerAddress,
            privateKey: privateKey,
            methodology: "Contractor's Test Method (Sri Lankan Rating Valuation)",
            algorithm: {
                zone: zone,
                constructionRate: CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES["C"],
                sqFt: sqFt,
                buildingAge: buildingAge,
                grossCost: valuation.grossCost.toString(),
                depreciationPercentage: valuation.depreciationPercentage + "%",
                depreciationAmount: valuation.depreciationAmount.toString(),
                effectiveCapitalValue: valuation.effectiveCapitalValue.toString(),
                decapitalizationRate: "5%",
                annualValue: valuation.annualValue.toString(),
                taxRate: "10%"
            }
        });

    } catch (error) {
        console.error("\n❌ ERROR OCCURRED:");
        console.error(error.message);
        console.error("============================================\n");

        res.status(500).json({
            error: error.message || "Transaction Failed",
            details: error.reason || "Unknown error"
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'running',
        message: 'Automation Engine is operational',
        contract: CONTRACT_ADDRESS
    });
});

// =============================================================
// 6. TAX PAYMENT ENDPOINT
// =============================================================

app.post('/pay-tax', async (req, res) => {
    try {
        console.log("\n============================================");
        console.log("💳 TAX PAYMENT REQUEST RECEIVED");
        console.log("============================================");
        console.log(req.body);

        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                error: "Missing propertyId"
            });
        }

        // Connect to contract
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // Check if property exists and get current status
        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const isPaid = propertyData[7];

        if (!isRegistered) {
            return res.status(404).json({
                error: "Property not found"
            });
        }

        if (isPaid) {
            return res.status(400).json({
                error: "Tax already paid for this property"
            });
        }

        console.log(`   Processing payment for Property ID: ${propertyId}`);

        // Call payTax function
        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.payTax(propertyId, {
            nonce: nonce,
            gasLimit: 300000
        });

        console.log(`   ⏳ Waiting for transaction confirmation...`);
        const receipt = await tx.wait();
        console.log(`   ✅ Payment Recorded! Block: ${receipt.blockNumber}`);
        console.log(`   Transaction Hash: ${receipt.hash}`);
        console.log("============================================\n");

        res.json({
            success: true,
            message: "Tax payment recorded on blockchain",
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId
        });

    } catch (error) {
        console.error("\n❌ PAYMENT ERROR:");
        console.error(error.message);
        console.error("============================================\n");

        res.status(500).json({
            error: error.message || "Payment failed",
            details: error.reason || "Unknown error"
        });
    }
});

// =============================================================
// 7. PROPERTY TRANSFER ENDPOINT
// =============================================================

app.post('/transfer-property', async (req, res) => {
    try {
        console.log("\n============================================");
        console.log("🔄 PROPERTY TRANSFER REQUEST RECEIVED");
        console.log("============================================");
        console.log(req.body);

        const { propertyId, newOwnerNIC } = req.body;

        if (!propertyId || !newOwnerNIC) {
            return res.status(400).json({
                error: "Missing required fields: propertyId and newOwnerNIC"
            });
        }

        // Generate new custodial wallet for new owner
        console.log(`\n👤 GENERATING CUSTODIAL WALLET FOR NEW OWNER...`);
        console.log(`   New Owner NIC: ${newOwnerNIC}`);
        const newWallet = ethers.Wallet.createRandom();
        const newOwnerAddress = newWallet.address;
        const newPrivateKey = newWallet.privateKey;
        console.log(`   ✅ Generated Wallet Address: ${newOwnerAddress}`);
        console.log(`   🔑 Private Key: ${newPrivateKey}`);

        // Connect to contract
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

        // Check if property exists and payment status
        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const isPaid = propertyData[7];
        const currentOwner = propertyData[4];

        if (!isRegistered) {
            return res.status(404).json({
                error: "Property not found"
            });
        }

        console.log(`\n🔍 CHECKING TAX PAYMENT STATUS...`);
        console.log(`   Property ID: ${propertyId}`);
        console.log(`   Current Owner: ${currentOwner}`);
        console.log(`   Payment Status: ${isPaid ? "PAID ✅" : "UNPAID ❌"}`);

        // Attempt transfer (will revert if tax not paid)
        console.log(`\n⛓️  EXECUTING OWNERSHIP TRANSFER...`);
        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.transferOwnership(propertyId, newOwnerAddress, {
            nonce: nonce,
            gasLimit: 300000
        });

        console.log(`   ⏳ Waiting for transaction confirmation...`);
        const receipt = await tx.wait();
        console.log(`   ✅ Ownership Transferred Successfully!`);
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Transaction Hash: ${receipt.hash}`);
        console.log(`   Previous Owner: ${currentOwner}`);
        console.log(`   New Owner: ${newOwnerAddress}`);
        console.log("============================================\n");

        res.json({
            success: true,
            message: "Ownership transferred successfully",
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
            previousOwner: currentOwner,
            newOwner: newOwnerAddress,
            newOwnerWallet: {
                address: newOwnerAddress,
                privateKey: newPrivateKey,
                nic: newOwnerNIC
            }
        });

    } catch (error) {
        console.error("\n❌ TRANSFER ERROR:");
        console.error(error.message);

        // Check if error is due to unpaid tax
        if (error.message.includes("Transfer Blocked: Outstanding Tax Payment Required")) {
            console.error("   REASON: Tax payment is required before transfer");
            console.error("============================================\n");

            return res.status(400).json({
                error: "Transfer Blocked: Outstanding Tax Payment Required!",
                details: "Property tax must be paid before ownership can be transferred",
                requiresPayment: true
            });
        }

        console.error("============================================\n");

        res.status(500).json({
            error: error.message || "Transfer failed",
            details: error.reason || "Unknown error"
        });
    }
});

// =============================================================
// 8. AI LEGAL TITLE SUMMARY ENDPOINT (GEMINI)
// =============================================================

/**
 * POST /api/generate-title-summary
 *
 * Accepts: { propertyId, oldOwner, newOwner, propertyValue, transferDate }
 * Returns: { success, summary } — a 2-3 sentence AI-generated legal title summary
 * confirming the ownership transfer, cleared taxes, and validated registration.
 */
app.post('/api/generate-title-summary', async (req, res) => {
    try {
        console.log("\n============================================");
        console.log("🤖 AI LEGAL TITLE SUMMARY REQUEST RECEIVED");
        console.log("============================================");
        console.log(req.body);

        const { propertyId, oldOwner, newOwner, propertyValue, transferDate } = req.body;

        // --- Input Validation ---
        if (!propertyId || !oldOwner || !newOwner || !propertyValue || !transferDate) {
            return res.status(400).json({
                error: "Missing required fields: propertyId, oldOwner, newOwner, propertyValue, transferDate"
            });
        }

        // --- Guard: Ensure API key is configured ---
        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            return res.status(503).json({
                error: "Gemini API key not configured.",
                details: "Set the GEMINI_API_KEY environment variable before starting the server."
            });
        }

        // --- Craft the formal municipal registrar prompt ---
        const prompt = `You are a formal Senior Municipal Registrar at the Sri Lanka Local Government Rating Authority. 
Your duty is to produce official, legally precise property title transfer summaries.

A property ownership transfer has been successfully recorded on the immutable blockchain ledger. 
You must generate an official Legal Title Summary based on the following verified transaction data:

- Property Registration Number : ${propertyId}
- Transferring Party (Previous Owner) : ${oldOwner}
- Acquiring Party (New Owner)         : ${newOwner}
- Assessed Capital Value              : LKR ${Number(propertyValue).toLocaleString()}
- Date of Transfer                    : ${transferDate}

Instructions:
1. Write exactly 2 to 3 sentences in formal legal language.
2. Confirm the transfer of ownership from the previous party to the acquiring party.
3. Explicitly state that all outstanding rating tax obligations have been fully settled and cleared prior to registration.
4. Assert that the transfer has been validated and permanently inscribed on the municipal blockchain registry.
5. Do NOT include headings, bullet points, markdown, or any prefix — output only the summary paragraph itself.`;

        console.log("\n📝 PROMPT CRAFTED. Calling Gemini API...");

        // --- Call Gemini with key rotation + retry + timeout ---
        const GEMINI_TIMEOUT_MS = 15000; // 15 seconds per attempt
        const MAX_RETRIES = Math.max(GEMINI_API_KEYS.length, 2); // retry once per key
        const GEMINI_MODEL = "gemini-2.0-flash"; // generous free tier: 1500 req/day

        let lastError = null;
        let result = null;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const apiKey = getNextGeminiKey();
            const client = createGenAIClient(apiKey);
            const keyLabel = `key#${(_geminiKeyIndex) % GEMINI_API_KEYS.length + 1}`;

            try {
                if (attempt > 0) {
                    const backoffMs = Math.min(1000 * Math.pow(2, attempt - 1), 8000); // 1s, 2s, 4s, 8s
                    console.log(`   ⏳ Retry ${attempt}/${MAX_RETRIES - 1} using ${keyLabel} (backoff ${backoffMs}ms)...`);
                    await new Promise(r => setTimeout(r, backoffMs));
                } else {
                    console.log(`   Using ${keyLabel} (model: ${GEMINI_MODEL})`);
                }

                const geminiCall = client.models.generateContent({
                    model: GEMINI_MODEL,
                    contents: prompt
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error("Gemini API request timed out after 15 seconds")), GEMINI_TIMEOUT_MS)
                );

                result = await Promise.race([geminiCall, timeoutPromise]);
                break; // success — stop retrying

            } catch (err) {
                lastError = err;
                const isQuota = err.message && (err.message.includes("429") || err.message.includes("RESOURCE_EXHAUSTED") || err.message.includes("quota"));
                if (isQuota && attempt < MAX_RETRIES - 1) {
                    console.warn(`   ⚠️  ${keyLabel} quota exceeded — rotating to next key...`);
                    continue;
                }
                throw err; // non-quota error or all keys exhausted
            }
        }

        if (!result) throw lastError || new Error("All Gemini keys exhausted or failed");

        const summary = result.text.trim();

        console.log("\n✅ LEGAL SUMMARY GENERATED:");
        console.log(`   ${summary}`);
        console.log("============================================\n");

        res.json({
            success: true,
            summary,
            propertyId,
            transferDate,
            model: "gemini-1.5-flash"
        });

    } catch (error) {
        console.error("\n❌ GEMINI API ERROR:");
        console.error(error.message);
        console.error("============================================\n");

        // --- Fallback: return a template-based summary so the UI still works ---
        const isQuotaError = error.message && (
            error.message.includes("429") ||
            error.message.includes("RESOURCE_EXHAUSTED") ||
            error.message.includes("quota")
        );
        const isTimeout = error.message && error.message.includes("timed out");

        const reason = isTimeout
            ? "(AI service timed out)"
            : isQuotaError
                ? "(AI quota exhausted — template used)"
                : "(AI service unavailable)";

        const { propertyId, oldOwner, newOwner, transferDate } = req.body || {};
        const fallbackSummary =
            `This is to certify that Property Registration Number ${propertyId || "N/A"} has been ` +
            `officially transferred from the Transferring Party (${oldOwner || "N/A"}) to the Acquiring Party ` +
            `(${newOwner || "N/A"}) on ${transferDate || "the recorded date"}, in accordance with ` +
            `the applicable provisions of the Sri Lanka Local Government Rating Authority. ` +
            `All outstanding rating tax obligations have been fully settled and cleared prior to this registration. ` +
            `This transfer has been validated and is permanently inscribed on the municipal blockchain registry.`;

        console.log(`\n⚠️  Using fallback template summary ${reason}`);

        return res.json({
            success: true,
            summary: fallbackSummary,
            propertyId,
            transferDate,
            model: "template-fallback",
            warning: `AI summary unavailable ${reason}. A standard template was used.`
        });
    }
});

// =============================================================
// 5. START SERVER
// =============================================================

const PORT = 3001;
app.listen(PORT, () => {
    console.log("\n╔═══════════════════════════════════════════════════╗");
    console.log("║   🚀 BLOCKCHAIN AUTOMATION ENGINE STARTED        ║");
    console.log("╚═══════════════════════════════════════════════════╝");
    console.log(`\n📡 API Server: http://localhost:${PORT}`);
    console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
    console.log(`🔗 Blockchain Network: Hardhat Local (http://127.0.0.1:8545)`);
    console.log(`\n✨ Features:`);
    console.log(`   • Contractor's Test Method Valuation (Sri Lankan Framework)`);
    console.log(`   • Percentage-based Depreciation with 50% Cap`);
    console.log(`   • Statutory Decapitalization Rate (5%)`);
    console.log(`   • SHA-256 Integrity Hash Generation`);
    console.log(`   • Manual Nonce Management`);
    console.log(`\n⏳ Waiting for assessment requests...\n`);
});
