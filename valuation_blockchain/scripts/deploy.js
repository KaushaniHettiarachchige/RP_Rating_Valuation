const hre = require("hardhat");

async function main() {
    // 1. Get the Contract Factory
    const ValuationRegistry = await hre.ethers.getContractFactory("ValuationRegistry");

    // 2. Deploy the Contract
    console.log("Deploying ValuationRegistry contract...");
    const valuationRegistry = await ValuationRegistry.deploy();

    // 3. Wait for deployment to finish
    await valuationRegistry.waitForDeployment();

    // 4. Get the address
    const address = await valuationRegistry.getAddress();

    console.log("----------------------------------------------------");
    console.log("✅ Contract deployed successfully!");
    console.log("📍 Contract Address:", address);
    console.log("----------------------------------------------------");
    console.log("⚠️  SAVE THIS ADDRESS! You need it for the Backend & Frontend.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});