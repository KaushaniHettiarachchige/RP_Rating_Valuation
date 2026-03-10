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
        bool isPaid; // Tax payment status
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
    event TaxPaid(
        uint256 indexed propertyId,
        address indexed payer,
        uint256 amount,
        uint256 timestamp
    );
    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed oldOwner,
        address indexed newOwner,
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

        // Initialize with zero value/tax/age and isPaid set to false
        properties[_id] = Property(_id, 0, 0, 0, _owner, "", true, false);

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
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            string memory,
            bool
        )
    {
        require(properties[_id].isRegistered, "Property not found.");
        Property memory p = properties[_id];
        return (
            p.id,
            p.assessedValue,
            p.taxAmount,
            p.buildingAge,
            p.ownerAddress,
            p.documentHash,
            p.isPaid
        );
    }

    // 7. Tax Payment Function
    function payTax(uint256 _id) public onlyCouncil {
        require(
            properties[_id].isRegistered,
            "Error: Property not registered."
        );
        require(
            !properties[_id].isPaid,
            "Error: Tax already paid for this property."
        );

        properties[_id].isPaid = true;

        emit TaxPaid(
            _id,
            msg.sender,
            properties[_id].taxAmount,
            block.timestamp
        );
    }

    // 8. Transfer Ownership Function (with Tax Payment Check)
    // PP2 FEATURE: Land Transfer with Integrity Lock & Audit Trail
    function transferOwnership(
        uint256 _propertyId,
        address _newOwner
    ) public onlyCouncil {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );
        // INTEGRITY LOCK: Block transfer if taxes are unpaid
        require(
            properties[_propertyId].isPaid == true,
            "Transfer Blocked: Outstanding Tax!"
        );
        require(_newOwner != address(0), "Error: Invalid new owner address.");

        address oldOwner = properties[_propertyId].ownerAddress;
        properties[_propertyId].ownerAddress = _newOwner;
        // STATUS RESET: New owner starts with fresh tax liability
        properties[_propertyId].isPaid = false;

        // AUDIT TRAIL: Immutable record of every ownership change
        emit OwnershipTransferred(
            _propertyId,
            oldOwner,
            _newOwner,
            block.timestamp
        );
    }
}
