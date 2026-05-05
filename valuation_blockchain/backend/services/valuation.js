const { ethers } = require('ethers');

// Construction Cost Rates: Based on Contractor's Test Method (Sri Lankan Rating Valuation)
const CONSTRUCTION_COST_RATES = {
    A: 8000, // Luxury Construction (City Center)
    B: 6000, // Mid-range Construction (Suburban)
    C: 4500, // Basic Construction (Rural)
};

// Depreciation Parameters: Percentage-based obsolescence model
const DEPRECIATION_RATE_PER_YEAR = 0.02; // 2% per year
const MAX_DEPRECIATION_CAP = 0.5; // Maximum 50% depreciation

// Decapitalization Rate: Statutory 5% for Annual Value calculation
const DECAPITALIZATION_RATE = 0.05;

// Tax Rate: 10% of Annual Value
const TAX_RATE = 0.1;

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
    const constructionRate = CONSTRUCTION_COST_RATES[zone] || CONSTRUCTION_COST_RATES.C;
    const grossCost = BigInt(sqFt) * BigInt(constructionRate);

    // Step 2: Calculate Depreciation (Percentage-based with cap)
    const age = parseInt(buildingAge) || 0;
    let depreciationPercentage = age * DEPRECIATION_RATE_PER_YEAR;

    // Apply 50% depreciation cap
    if (depreciationPercentage > MAX_DEPRECIATION_CAP) {
        depreciationPercentage = MAX_DEPRECIATION_CAP;
    }

    // Convert percentage to integer calculation (multiply by 100 to avoid floating point)
    const depreciationAmount =
        (grossCost * BigInt(Math.floor(depreciationPercentage * 100))) / 100n;

    // Step 3: Calculate Effective Capital Value (ECV)
    let effectiveCapitalValue = grossCost - depreciationAmount;
    if (effectiveCapitalValue < 0n) effectiveCapitalValue = 0n;

    // Step 4: Calculate Annual Value (Statutory Decapitalization)
    const annualValue =
        (effectiveCapitalValue * BigInt(Math.floor(DECAPITALIZATION_RATE * 100))) / 100n;

    // Step 5: Calculate Tax (10% of Annual Value)
    const taxAmount = (annualValue * BigInt(Math.floor(TAX_RATE * 100))) / 100n;

    return {
        grossCost,
        depreciationPercentage: Math.floor(depreciationPercentage * 100), // Return as percentage (e.g., 20 for 20%)
        depreciationAmount,
        effectiveCapitalValue,
        annualValue,
        taxAmount,
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

module.exports = {
    CONSTRUCTION_COST_RATES,
    DEPRECIATION_RATE_PER_YEAR,
    MAX_DEPRECIATION_CAP,
    DECAPITALIZATION_RATE,
    TAX_RATE,
    calculateValuation,
    generateIntegrityHash,
};
