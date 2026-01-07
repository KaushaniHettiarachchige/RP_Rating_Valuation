// =======================================================
// CONFIGURATION
// =======================================================
export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const BACKEND_URL = "http://localhost:3001/assess-property";

// =======================================================
// CONTRACT ABI (Updated with buildingAge parameter)
// =======================================================
export const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "PropertyRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "propertyId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tax",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "buildingAge",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "docHash",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ValuationUpdated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getPropertyDetails",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "municipalCouncil",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "properties",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "assessedValue",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "taxAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "buildingAge",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "ownerAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "documentHash",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isRegistered",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "registerProperty",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_tax",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_buildingAge",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_docHash",
                "type": "string"
            }
        ],
        "name": "updateValuation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
