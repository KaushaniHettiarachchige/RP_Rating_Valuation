const express = require("express");
const multer = require("multer");
const { ethers } = require("ethers");
const { upload } = require("../middleware/upload");
const { createContractWithSigner } = require("../services/blockchain");
const {
  CONSTRUCTION_COST_RATES,
  calculateValuation,
  generateIntegrityHash,
} = require("../services/valuation");
const { CONTRACT_ADDRESS } = require("../config");
const { provider } = require("../config");

const router = express.Router();

// =============================================================
// API: AUTOMATED ASSESSMENT & BLOCKCHAIN WRITE (NO MONGODB)
// =============================================================

router.post(
  "/assess-property",
  upload.fields([
    { name: "ownershipDocs", maxCount: 5 },
    { name: "propertyImages", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      console.log("============================================");
      console.log("📥 NEW ASSESSMENT REQUEST RECEIVED");
      console.log("============================================");
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
          error:
            "Missing required fields. Provide: propertyId, zone, sqFt, nic, buildingAge",
        });
      }

      // --- STEP 0: Generate Custodial Wallet ---
      console.log("\n👤 GENERATING WALLET...");
      const newWallet = ethers.Wallet.createRandom();
      const ownerAddress = newWallet.address;
      const privateKey = newWallet.privateKey;

      const { wallet, contract } = createContractWithSigner();

      // --- STEP 1: Valuation ---
      console.log("\n RUNNING VALUATION...");
      const valuation = calculateValuation(sqFt, zone, buildingAge);

      // --- STEP 2: Hash ---
      console.log("\n GENERATING HASH...");
      const docHash = generateIntegrityHash(
        propertyId,
        valuation.effectiveCapitalValue,
        valuation.taxAmount,
      );

      // --- STEP 3: Blockchain Write ---
      console.log("\n WRITING TO BLOCKCHAIN...");

      let propertyData = await contract.properties(propertyId);
      let isRegistered = propertyData[6];

      let nextNonce;

      if (!isRegistered) {
        const registrationNonce = await provider.getTransactionCount(
          wallet.address,
          "latest",
        );

        const tx1 = await contract.registerProperty(propertyId, ownerAddress, {
          nonce: registrationNonce,
          gasLimit: 300000,
        });

        await tx1.wait();

        nextNonce = registrationNonce + 1;
      } else {
        nextNonce = await provider.getTransactionCount(
          wallet.address,
          "latest",
        );
      }

      const tx2 = await contract.updateValuation(
        propertyId,
        valuation.effectiveCapitalValue,
        valuation.taxAmount,
        buildingAge,
        docHash,
        {
          nonce: nextNonce,
          gasLimit: 300000,
        },
      );

      const receipt = await tx2.wait();

      console.log("SUCCESS: Stored on blockchain");

      // --- RESPONSE ---
      res.json({
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        valuation: valuation.effectiveCapitalValue.toString(),
        annualValue: valuation.annualValue.toString(),
        tax: valuation.taxAmount.toString(),
        integrityHash: docHash,
        walletAddress: ownerAddress,
        privateKey: privateKey,
        methodology: "Contractor's Test Method",
      });
    } catch (error) {
      console.error(error);

      const isUploadError = error instanceof multer.MulterError;
      const statusCode = isUploadError ? 400 : 500;

      res.status(statusCode).json({
        error: error.message || "Transaction Failed",
      });
    }
  },
);

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "running",
    contract: CONTRACT_ADDRESS,
  });
});

module.exports = router;
