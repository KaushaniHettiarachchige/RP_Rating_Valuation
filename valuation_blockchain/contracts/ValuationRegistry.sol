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
        bool hasBankLoan; // Encumbrance flag: true when mortgaged
        bool hasPendingTransfer; // Two-step transfer pending council approval
        address pendingNewOwner; // Proposed new owner awaiting approval
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
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp
    );
    event TransferRequested(
        uint256 indexed propertyId,
        address indexed requestedBy,
        address indexed proposedNewOwner,
        uint256 timestamp
    );
    event TransferRejected(
        uint256 indexed propertyId,
        address indexed rejectedBy,
        uint256 timestamp
    );
    event TransferWithdrawn(
        uint256 indexed propertyId,
        address indexed withdrawnBy,
        uint256 timestamp
    );
    event EncumbranceUpdated(
        uint256 indexed propertyId,
        bool hasBankLoan,
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

        // Initialize with zero value/tax/age and all transfer guards disabled
        properties[_id] = Property(
            _id,
            0,
            0,
            0,
            _owner,
            "",
            true,
            false,
            false,
            false,
            address(0)
        );

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
            bool,
            bool,
            bool,
            address
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
            p.isPaid,
            p.hasBankLoan,
            p.hasPendingTransfer,
            p.pendingNewOwner
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

    // 8. Council-controlled encumbrance update (loan/mortgage status)
    function setEncumbranceStatus(
        uint256 _propertyId,
        bool _hasBankLoan
    ) public onlyCouncil {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );

        properties[_propertyId].hasBankLoan = _hasBankLoan;

        emit EncumbranceUpdated(_propertyId, _hasBankLoan, block.timestamp);
    }

    // 9. Two-step transfer: Step 1 request transfer (owner/council)
    function requestTransfer(uint256 _propertyId, address _newOwner) public {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );
        require(
            msg.sender == municipalCouncil ||
                msg.sender == properties[_propertyId].ownerAddress,
            "Access Denied: Only owner or council can request transfer."
        );
        require(
            properties[_propertyId].isPaid == true,
            "Transfer Blocked: Outstanding Tax!"
        );
        require(
            !properties[_propertyId].hasBankLoan,
            "Transfer Blocked: Property is mortgaged."
        );
        require(
            !properties[_propertyId].hasPendingTransfer,
            "Transfer already pending council approval."
        );
        require(_newOwner != address(0), "Error: Invalid new owner address.");
        require(
            _newOwner != properties[_propertyId].ownerAddress,
            "Error: New owner must be different from current owner."
        );

        properties[_propertyId].hasPendingTransfer = true;
        properties[_propertyId].pendingNewOwner = _newOwner;

        emit TransferRequested(
            _propertyId,
            msg.sender,
            _newOwner,
            block.timestamp
        );
    }

    // 10. Two-step transfer: Step 2 council approval finalizes transfer
    function approveTransfer(uint256 _propertyId) public onlyCouncil {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );
        require(
            properties[_propertyId].hasPendingTransfer,
            "Error: No pending transfer request."
        );

        address previousOwner = properties[_propertyId].ownerAddress;
        address newOwner = properties[_propertyId].pendingNewOwner;

        properties[_propertyId].ownerAddress = newOwner;
        properties[_propertyId].hasPendingTransfer = false;
        properties[_propertyId].pendingNewOwner = address(0);
        // STATUS RESET: New owner starts with fresh tax liability
        properties[_propertyId].isPaid = false;

        // AUDIT TRAIL: Immutable record of every ownership change
        emit OwnershipTransferred(
            _propertyId,
            previousOwner,
            newOwner,
            block.timestamp
        );
    }

    // 11. Council can reject a pending transfer request
    function rejectTransfer(uint256 _propertyId) public onlyCouncil {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );
        require(
            properties[_propertyId].hasPendingTransfer,
            "Error: No pending transfer request."
        );

        properties[_propertyId].hasPendingTransfer = false;
        properties[_propertyId].pendingNewOwner = address(0);

        emit TransferRejected(_propertyId, msg.sender, block.timestamp);
    }

    // 12. Owner (or council) can withdraw a pending transfer request
    function withdrawTransfer(uint256 _propertyId) public {
        require(
            properties[_propertyId].isRegistered,
            "Error: Property not registered."
        );
        require(
            properties[_propertyId].hasPendingTransfer,
            "Error: No pending transfer request."
        );
        require(
            msg.sender == municipalCouncil ||
                msg.sender == properties[_propertyId].ownerAddress,
            "Access Denied: Only owner or council can withdraw transfer."
        );

        properties[_propertyId].hasPendingTransfer = false;
        properties[_propertyId].pendingNewOwner = address(0);

        emit TransferWithdrawn(_propertyId, msg.sender, block.timestamp);
    }
}
