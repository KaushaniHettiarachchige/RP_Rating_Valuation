const express = require('express');
const multer = require('multer');
const { ethers } = require('ethers');
const { upload } = require('../middleware/upload');
const { createContractWithSigner } = require('../services/blockchain');
const {
    CONSTRUCTION_COST_RATES,
    calculateValuation,
    generateIntegrityHash,
} = require('../services/valuation');
const { CONTRACT_ADDRESS } = require('../config');
const { provider } = require('../config');

const router = express.Router();

// =============================================================
// 4. API ENDPOINT: AUTOMATED ASSESSMENT & BLOCKCHAIN WRITE
// =============================================================

router.post(
    '/assess-property',
    upload.fields([
        { name: 'ownershipDocs', maxCount: 5 },
        { name: 'propertyImages', maxCount: 10 },
    ]),
    async (req, res) => {
        try {
            console.log('============================================');
            console.log('📥 NEW ASSESSMENT REQUEST RECEIVED');
            console.log('============================================');
            console.log(req.body);
            if (req.files) {
                console.log({
                    ownershipDocs: req.files.ownershipDocs?.length || 0,
                    propertyImages: req.files.propertyImages?.length || 0,
                });
            }

            const { propertyId, zone, sqFt, nic, buildingAge } = req.body;

            // Validate inputs
            if (!propertyId || !zone || !sqFt || !nic || buildingAge === undefined) {
                return res.status(400).json({
                    error: 'Missing required fields. Please provide: propertyId, zone, sqFt, nic, buildingAge',
                });
            }

            // --- STEP 0: Generate Custodial Wallet for Property Owner ---
            console.log('\n👤 GENERATING CUSTODIAL WALLET...');
            console.log(`   Citizen NIC: ${nic}`);
            const newWallet = ethers.Wallet.createRandom();
            const ownerAddress = newWallet.address;
            const privateKey = newWallet.privateKey;
            console.log(`    Generated Wallet Address: ${ownerAddress}`);
            console.log(`   Private Key: ${privateKey}`);
            console.log('   Purpose: Custodial wallet for citizen without crypto knowledge');

            // FRESH CONNECTION (Prevents nonce issues on server restarts)
            const { wallet, contract } = createContractWithSigner();

            // --- STEP 1: Run Multi-Criteria Valuation Algorithm (Contractor's Test Method) ---
            console.log("\n RUNNING CONTRACTOR'S TEST METHOD VALUATION...");
            const valuation = calculateValuation(sqFt, zone, buildingAge);
            const constructionRate = CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES.C;

            console.log(`   Zone: ${zone} (Construction Rate: ${constructionRate} LKR/sqft)`);
            console.log(`   Square Footage: ${sqFt}`);
            console.log(`   Building Age: ${buildingAge} years`);
            console.log('   ════════════════════════════════════════════════════');
            console.log(`    Gross Construction Cost: ${valuation.grossCost.toString()} LKR`);
            console.log(
                `   📉 Depreciation (${valuation.depreciationPercentage}% - ${buildingAge} yrs × 2%): -${valuation.depreciationAmount.toString()} LKR`
            );
            console.log('   ────────────────────────────────────────────────────');
            console.log(`    Effective Capital Value (ECV): ${valuation.effectiveCapitalValue.toString()} LKR`);
            console.log(`   Annual Value (ECV × 5%): ${valuation.annualValue.toString()} LKR`);
            console.log('   ════════════════════════════════════════════════════');
            console.log(`   Tax Amount (10% of Annual Value): ${valuation.taxAmount.toString()} LKR`);

            // --- STEP 2: Generate Integrity Hash (SHA-256) ---
            console.log('\n GENERATING INTEGRITY HASH...');
            const docHash = generateIntegrityHash(propertyId, valuation.effectiveCapitalValue, valuation.taxAmount);
            console.log(`   Hash: ${docHash}`);
            console.log('   Purpose: Prevent data tampering (corruption detection)');

            // --- STEP 3: Write to Blockchain with Manual Nonce Management ---
            console.log('\n WRITING TO BLOCKCHAIN...');

            // Check if Property is already registered
            let propertyData = await contract.properties(propertyId);
            let isRegistered = propertyData[6]; // isRegistered is at index 6

            let nextNonce;
            if (!isRegistered) {
                console.log(`   Property ${propertyId} not registered. Registering first...`);
                const registrationNonce = await provider.getTransactionCount(wallet.address, 'latest');
                console.log(`   Registration Nonce: ${registrationNonce}`);

                const tx1 = await contract.registerProperty(propertyId, ownerAddress, {
                    nonce: registrationNonce,
                    gasLimit: 300000,
                });
                console.log('    Waiting for registration transaction...');
                const registrationReceipt = await tx1.wait();
                console.log(`   Registration Complete. Block: ${registrationReceipt.blockNumber}`);

                // Verify registration
                propertyData = await contract.properties(propertyId);
                isRegistered = propertyData[6];
                if (!isRegistered) {
                    throw new Error('Registration failed verification');
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
                    gasLimit: 300000,
                }
            );
            console.log('   Waiting for valuation update transaction...');
            const receipt = await tx2.wait();
            console.log(`   Valuation Update Complete. Block: ${receipt.blockNumber}`);
            console.log(`   Transaction Hash: ${receipt.hash}`);

            console.log('\nSUCCESS! Property recorded on immutable ledger.');
            console.log('============================================\n');

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
                    constructionRate: CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES.C,
                    sqFt: sqFt,
                    buildingAge: buildingAge,
                    grossCost: valuation.grossCost.toString(),
                    depreciationPercentage: `${valuation.depreciationPercentage}%`,
                    depreciationAmount: valuation.depreciationAmount.toString(),
                    effectiveCapitalValue: valuation.effectiveCapitalValue.toString(),
                    decapitalizationRate: '5%',
                    annualValue: valuation.annualValue.toString(),
                    taxRate: '10%',
                },
            });
        } catch (error) {
            console.error('\n ERROR OCCURRED:');
            console.error(error.message);
            console.error('============================================\n');
            const isUploadError = error instanceof multer.MulterError;
            const statusCode = isUploadError || error.message?.includes('upload') ? 400 : 500;

            res.status(statusCode).json({
                error: error.message || 'Transaction Failed',
                details: error.reason || 'Unknown error',
            });
        }
    }
);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'running',
        message: 'Automation Engine is operational',
        contract: CONTRACT_ADDRESS,
    });
});

module.exports = router;
