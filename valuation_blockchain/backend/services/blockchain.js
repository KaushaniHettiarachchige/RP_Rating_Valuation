const { ethers } = require('ethers');
const { PRIVATE_KEY, CONTRACT_ADDRESS, CONTRACT_ABI, provider } = require('../config');

function createSigner() {
    return new ethers.Wallet(PRIVATE_KEY, provider);
}

function createContractWithSigner() {
    const wallet = createSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    return { wallet, contract };
}

module.exports = {
    createSigner,
    createContractWithSigner,
};
