const express = require('express');
const { ethers } = require('ethers');
const { createContractWithSigner } = require('../services/blockchain');
const { provider, TRANSFER_SCAN_START_BLOCK } = require('../config');
const { queryFilterPaginated } = require('../utils/queryFilterPaginated');

const router = express.Router();

// =============================================================
// 7. PROPERTY TRANSFER ENDPOINT
// =============================================================

router.post('/transfer-property', async (req, res) => {
    try {
        console.log('\n============================================');
        console.log('🔄 PROPERTY TRANSFER REQUEST RECEIVED');
        console.log('============================================');
        console.log(req.body);

        const { propertyId, newOwnerNIC, newOwnerAddress } = req.body;

        if (!propertyId || (!newOwnerNIC && !newOwnerAddress)) {
            return res.status(400).json({
                error: 'Missing required fields: propertyId and (newOwnerNIC or newOwnerAddress)',
            });
        }

        let proposedNewOwner = newOwnerAddress;
        let generatedWallet = null;

        if (!proposedNewOwner && newOwnerNIC) {
            // Generate new custodial wallet for new owner
            console.log('\n👤 GENERATING CUSTODIAL WALLET FOR NEW OWNER...');
            console.log(`   New Owner NIC: ${newOwnerNIC}`);
            const newWallet = ethers.Wallet.createRandom();
            proposedNewOwner = newWallet.address;
            generatedWallet = {
                address: newWallet.address,
                privateKey: newWallet.privateKey,
                nic: newOwnerNIC,
            };
            console.log(`   ✅ Generated Wallet Address: ${newWallet.address}`);
            console.log(`   🔑 Private Key: ${newWallet.privateKey}`);
        }

        if (!proposedNewOwner || !ethers.isAddress(proposedNewOwner)) {
            return res.status(400).json({
                error: 'Invalid new owner address',
            });
        }

        // Connect to contract
        const { wallet, contract } = createContractWithSigner();

        // Check if property exists and payment status
        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const isPaid = propertyData[7];
        const hasBankLoan = propertyData[8];
        const hasPendingTransfer = propertyData[9];
        const currentOwner = propertyData[4];

        if (!isRegistered) {
            return res.status(404).json({
                error: 'Property not found',
            });
        }

        console.log('\n🔍 CHECKING TAX PAYMENT STATUS...');
        console.log(`   Property ID: ${propertyId}`);
        console.log(`   Current Owner: ${currentOwner}`);
        console.log(`   Payment Status: ${isPaid ? 'PAID ✅' : 'UNPAID ❌'}`);

        if (!isPaid) {
            return res.status(400).json({
                error: 'Transfer Blocked: Outstanding Tax!',
                details: 'Property tax must be paid before ownership can be transferred',
                requiresPayment: true,
            });
        }

        if (hasBankLoan) {
            return res.status(400).json({
                error: 'Transfer Blocked: Property is mortgaged.',
                details: 'Encumbrance must be cleared before ownership can be transferred',
            });
        }

        if (hasPendingTransfer) {
            return res.status(400).json({
                error: 'Transfer already pending council approval.',
                details: 'A transfer request is already in the council queue',
            });
        }

        // Request transfer (two-step approval)
        console.log('\n⛓️  SUBMITTING TRANSFER REQUEST...');
        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.requestTransfer(propertyId, proposedNewOwner, {
            nonce: nonce,
            gasLimit: 300000,
        });

        console.log('   ⏳ Waiting for transaction confirmation...');
        const receipt = await tx.wait();
        console.log('   ✅ Transfer Request Submitted!');
        console.log(`   Block: ${receipt.blockNumber}`);
        console.log(`   Transaction Hash: ${receipt.hash}`);
        console.log(`   Previous Owner: ${currentOwner}`);
        console.log(`   Proposed New Owner: ${proposedNewOwner}`);
        console.log('============================================\n');

        res.json({
            success: true,
            message: 'Transfer request submitted and pending council approval',
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
            currentOwner: currentOwner,
            proposedNewOwner: proposedNewOwner,
            newOwnerWallet: generatedWallet,
        });
    } catch (error) {
        console.error('\n❌ TRANSFER ERROR:');
        console.error(error.message);

        // Check if error is due to unpaid tax
        if (error.message.includes('Transfer Blocked: Outstanding Tax')) {
            console.error('   REASON: Tax payment is required before transfer');
            console.error('============================================\n');

            return res.status(400).json({
                error: 'Transfer Blocked: Outstanding Tax Payment Required!',
                details: 'Property tax must be paid before ownership can be transferred',
                requiresPayment: true,
            });
        }

        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Transfer failed',
            details: error.reason || 'Unknown error',
        });
    }
});

// =============================================================
// 7A. PENDING TRANSFERS QUEUE
// =============================================================

router.get('/pending-transfers', async (req, res) => {
    try {
        const { contract } = createContractWithSigner();

        const transferEvents = await queryFilterPaginated(
            contract,
            contract.filters.TransferRequested(),
            TRANSFER_SCAN_START_BLOCK,
            'latest'
        );

        const uniqueIds = Array.from(new Set(transferEvents.map((event) => Number(event.args.propertyId))));
        const items = [];

        for (const propertyId of uniqueIds) {
            const propertyData = await contract.properties(propertyId);
            const isRegistered = propertyData[6];
            const hasPendingTransfer = propertyData[9];
            if (!isRegistered || !hasPendingTransfer) continue;

            const currentOwner = propertyData[4];
            const proposedNewOwner = propertyData[10];

            const lastRequest = transferEvents
                .filter((event) => Number(event.args.propertyId) === propertyId)
                .sort((a, b) => b.blockNumber - a.blockNumber)[0];

            items.push({
                propertyId,
                currentOwner,
                proposedNewOwner,
                requestedAt: lastRequest?.args?.timestamp
                    ? Number(lastRequest.args.timestamp) * 1000
                    : null,
                txHash: lastRequest?.transactionHash || null,
            });
        }

        res.json({
            success: true,
            items,
        });
    } catch (error) {
        console.error('\n❌ PENDING TRANSFERS ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Failed to load pending transfers',
            details: error.reason || 'Unknown error',
        });
    }
});

// =============================================================
// 7B. APPROVE TRANSFER (COUNCIL)
// =============================================================

router.post('/approve-transfer', async (req, res) => {
    try {
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                error: 'Missing required field: propertyId',
            });
        }

        const { wallet, contract } = createContractWithSigner();

        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const hasPendingTransfer = propertyData[9];
        const previousOwner = propertyData[4];
        const newOwner = propertyData[10];

        if (!isRegistered) {
            return res.status(404).json({
                error: 'Property not found',
            });
        }

        if (!hasPendingTransfer) {
            return res.status(400).json({
                error: 'No pending transfer request for this property',
            });
        }

        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.approveTransfer(propertyId, {
            nonce: nonce,
            gasLimit: 300000,
        });

        const receipt = await tx.wait();

        res.json({
            success: true,
            message: 'Transfer approved and finalized',
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
            previousOwner,
            newOwner,
        });
    } catch (error) {
        console.error('\n❌ APPROVAL ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Approval failed',
            details: error.reason || 'Unknown error',
        });
    }
});

// =============================================================
// 7C. REJECT TRANSFER (COUNCIL)
// =============================================================

router.post('/reject-transfer', async (req, res) => {
    try {
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                error: 'Missing required field: propertyId',
            });
        }

        const { wallet, contract } = createContractWithSigner();

        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const hasPendingTransfer = propertyData[9];

        if (!isRegistered) {
            return res.status(404).json({
                error: 'Property not found',
            });
        }

        if (!hasPendingTransfer) {
            return res.status(400).json({
                error: 'No pending transfer request for this property',
            });
        }

        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.rejectTransfer(propertyId, {
            nonce: nonce,
            gasLimit: 300000,
        });

        const receipt = await tx.wait();

        res.json({
            success: true,
            message: 'Transfer request rejected',
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
        });
    } catch (error) {
        console.error('\n❌ REJECTION ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Rejection failed',
            details: error.reason || 'Unknown error',
        });
    }
});

// =============================================================
// 7D. WITHDRAW TRANSFER (OWNER OR COUNCIL)
// =============================================================

router.post('/withdraw-transfer', async (req, res) => {
    try {
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({
                error: 'Missing required field: propertyId',
            });
        }

        const { wallet, contract } = createContractWithSigner();

        const propertyData = await contract.properties(propertyId);
        const isRegistered = propertyData[6];
        const hasPendingTransfer = propertyData[9];

        if (!isRegistered) {
            return res.status(404).json({
                error: 'Property not found',
            });
        }

        if (!hasPendingTransfer) {
            return res.status(400).json({
                error: 'No pending transfer request for this property',
            });
        }

        const nonce = await provider.getTransactionCount(wallet.address, 'latest');
        const tx = await contract.withdrawTransfer(propertyId, {
            nonce: nonce,
            gasLimit: 300000,
        });

        const receipt = await tx.wait();

        res.json({
            success: true,
            message: 'Transfer request withdrawn',
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            propertyId: propertyId,
        });
    } catch (error) {
        console.error('\n❌ WITHDRAW ERROR:');
        console.error(error.message);
        console.error('============================================\n');

        res.status(500).json({
            error: error.message || 'Withdraw failed',
            details: error.reason || 'Unknown error',
        });
    }
});

module.exports = router;
