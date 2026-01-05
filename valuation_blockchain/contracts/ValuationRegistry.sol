// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ValuationRegistry
 * @dev Immutable ledger for property tax records with audit trail
 * @notice Research Prototype for Sri Jayewardenepura Kotte Municipal Council
 * @author Final Year Software Engineering Research Project
 */
contract ValuationRegistry {
    // 1. Define the Property Structure
    struct Property {
        uint256 id;
        uint256 assessedValue; // The calculated value (e.g., 5,000,000 LKR)
        uint256 taxAmount; // The tax to pay (e.g., 200,000 LKR)
        uint256 buildingAge; // Age of the building in years (for depreciation)
        address ownerAddress; // Who owns it
        string documentHash; // Digital Signature (SHA-256 of the deed/report)
        bool isRegistered; // To check if property exists
    }

    // 2. Storage: Mapping Property ID to Property Details
    mapping(uint256 => Property) public properties;

    // Access Control: Store the Council's Wallet Address
    address public municipalCouncil;

    // Events: To log actions on the blockchain (useful for the frontend)
    // NOVELTY FEATURE: Comprehensive event logging for audit trail
    event PropertyRegistered(
        uint256 indexed propertyId,
        address owner,
        uint256 timestamp
    );
    event ValuationUpdated(
        uint256 indexed propertyId,
        uint256 value,
        uint256 tax,
        uint256 buildingAge,
        string docHash,
        uint256 timestamp
    );

    // Constructor: Sets the deployer (You) as the Municipal Council
    constructor() {
        municipalCouncil = msg.sender;
    }

    // 3. Modifier: Restrict access to only the Council
    modifier onlyCouncil() {
        require(
            msg.sender == municipalCouncil,
            "Access Denied: Only Kotte Municipal Council can perform this action."
        );
        _;
    }

    // 4. Core Function: Register a new Property
    function registerProperty(uint256 _id, address _owner) public onlyCouncil {
        require(
            !properties[_id].isRegistered,
            "Error: Property ID already exists."
        );

        // Initialize with zero value/tax/age
        properties[_id] = Property(_id, 0, 0, 0, _owner, "", true);

        emit PropertyRegistered(_id, _owner, block.timestamp);
    }

    // 5. Core Function: Update Valuation (The Automated Part)
    // NOVELTY FEATURE: Includes building age for depreciation algorithm
    function updateValuation(
        uint256 _id,
        uint256 _value,
        uint256 _tax,
        uint256 _buildingAge,
        string memory _docHash
    ) public onlyCouncil {
        require(
            properties[_id].isRegistered,
            "Error: Property not registered."
        );

        Property storage p = properties[_id];
        p.assessedValue = _value;
        p.taxAmount = _tax;
        p.buildingAge = _buildingAge;
        p.documentHash = _docHash;

        emit ValuationUpdated(
            _id,
            _value,
            _tax,
            _buildingAge,
            _docHash,
            block.timestamp
        );
    }

    // 6. Core Function: Get Details (Public Verification)
    function getPropertyDetails(
        uint256 _id
    )
        public
        view
        returns (uint256, uint256, uint256, uint256, address, string memory)
    {
        require(properties[_id].isRegistered, "Property not found.");
        Property memory p = properties[_id];
        return (
            p.id,
            p.assessedValue,
            p.taxAmount,
            p.buildingAge,
            p.ownerAddress,
            p.documentHash
        );
    }
}
