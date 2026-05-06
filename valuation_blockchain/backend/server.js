const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config(); // Load .env variables first
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require("./routes");
const { CONTRACT_ADDRESS } = require("./config");

const app = express();

app.use(express.json());
app.use(cors());

app.use(routes);

// =============================================================
// 5. START SERVER
// =============================================================

const PORT = 3001;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("MongoDB connected");
    } catch (error) {
      console.error("MongoDB connection failed:", error.message);
      process.exit(1);
    }
  } else {
    console.warn("MONGODB_URI is not set. MongoDB features are disabled.");
  }

  app.listen(PORT, () => {
    console.log("\n╔═══════════════════════════════════════════════════╗");
    console.log("║   BLOCKCHAIN AUTOMATION ENGINE STARTED        ║");
    console.log("╚═══════════════════════════════════════════════════╝");
    console.log(`\nAPI Server: http://localhost:${PORT}`);
    console.log(`Contract Address: ${CONTRACT_ADDRESS}`);
    console.log("Blockchain Network: Hardhat Local (http://127.0.0.1:8545)");
    console.log("\n Features:");
    console.log(
      "   • Contractor's Test Method Valuation (Sri Lankan Framework)",
    );
    console.log("   • Percentage-based Depreciation with 50% Cap");
    console.log("   • Statutory Decapitalization Rate (5%)");
    console.log("   • SHA-256 Integrity Hash Generation");
    console.log("   • Manual Nonce Management");
    console.log("\n Waiting for assessment requests...\n");
  });
}

startServer();
