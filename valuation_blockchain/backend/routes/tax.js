const express = require('express');
const { createContractWithSigner } = require('../services/blockchain');
const { provider } = require('../config');

const router = express.Router();

// =============================================================
// 6. TAX PAYMENT ENDPOINT
// =============================================================

router.post('/pay-tax', async (req, res) => {
    try {
        console.log('\n============================================');
        console.log('💳 TAX PAYMENT REQUEST RECEIVED');
        console.log('============================================');
        console.log(req.body);

        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                error: 'Missing propertyId',
            });
        }

        // Connect to contract
        const { wallet, contract } = createContractWithSigner();

        // Check if property exists and get current status
        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const isPaid = propertyData[7];

        if (!isRegistered) {
            return res.status(404).json({
                error: 'Property not found',
            });
        }

        if (isPaid) {
            return res.status(400).json({
                error: 'Tax already paid for this property',
            });
        }

        console.log(`   Processing payment for Property ID: ${propertyId}`);

        // Call payTax function
        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.payTax(propertyId, {
            nonce: nonce,
            gasLimit: 300000,
        });

        console.log('    Waiting for transaction confirmation...');
        const receipt = await tx.wait();
        console.log(`    Payment Recorded! Block: ${receipt.blockNumber}`);
        console.log(`   Transaction Hash: ${receipt.hash}`);
        console.log('============================================\n');

        res.json({
            success: true,
            message: 'Tax payment recorded on blockchain',
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
        });
    } catch (error) {
        console.error('\n PAYMENT ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Payment failed',
            details: error.reason || 'Unknown error',
        });
    }
});

module.exports = router;
