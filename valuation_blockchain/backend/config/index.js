const { ethers } = require('ethers');

// The contract address you got from deployment (Update after running deploy.js)
const CONTRACT_ADDRESS = "0x8226df5B5F270568a3C741A5657a4FEb40ED8EA4";

// The private key of Account #0 from Hardhat (The Council Admin)
const PRIVATE_KEY = process.env.PRIVATE_KEY;

// Google Gemini API Keys - supports rotation across multiple free-tier keys
// Add GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... or just GEMINI_API_KEY in .env
const GEMINI_API_KEYS = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_1,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
].filter((key) => key && key !== "YOUR_GEMINI_API_KEY_HERE");

// Primary key (used for guard checks)
const GEMINI_API_KEY = GEMINI_API_KEYS[0] || "YOUR_GEMINI_API_KEY_HERE";

// Round-robin key rotation state
let geminiKeyIndex = 0;
function getNextGeminiKey() {
    const key = GEMINI_API_KEYS[geminiKeyIndex % GEMINI_API_KEYS.length];
    geminiKeyIndex += 1;
    return key;
}

// Import the Smart Contract ABI
const artifact = require('../../artifacts/contracts/ValuationRegistry.sol/ValuationRegistry.json');
const CONTRACT_ABI = artifact.abi;

// Connect to the Hardhat node (with ENS disabled for local network)
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

const TRANSFER_SCAN_START_BLOCK = Number(process.env.TRANSFER_SCAN_START_BLOCK || 0);
const TRANSFER_SCAN_BLOCK_RANGE = Number(process.env.TRANSFER_SCAN_BLOCK_RANGE || 50000);

module.exports = {
    CONTRACT_ADDRESS,
    PRIVATE_KEY,
    GEMINI_API_KEYS,
    GEMINI_API_KEY,
    getNextGeminiKey,
    CONTRACT_ABI,
    provider,
    TRANSFER_SCAN_START_BLOCK,
    TRANSFER_SCAN_BLOCK_RANGE,
};
