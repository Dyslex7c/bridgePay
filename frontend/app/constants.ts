export const contractAddress = "0x03D8487343D7e5e8E8bB81039083EF9652B4c2ba";

export const batchContractAddress = "0xD987E37667b7DD9FAEE3274Cd96272205ea1Db9E";

export const destinationChains = [
    { id: 11155111, name: "Ethereum", selector: "16015286601757825753" },
    { id: 421614, name: "Arbitrum", selector: "3478487238524512106" },
    { id: 11155420, name: "Optimism", selector: "5224473277236331295" },
    { id: 43113, name: "Avalanche", selector: "14767482510784806043" },
    { id: 84532, name: "Base", selector: "10344971235874465080" },
];

export const chainSelectorMapping: Record<string, { name: string; logo: string }> = {
  "16015286601757825753": { name: "Ethereum", logo: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  "3478487238524512106": {
    name: "Arbitrum",
    logo: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png",
  },
  "5224473277236331295": { name: "Optimism", logo: "https://assets.coingecko.com/coins/images/25244/small/Optimism.png" },
  "14767482510784806043": {
    name: "Avalanche",
    logo: "https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png",
  },
  "10344971235874465080": {
    name: "Base",
    logo: "https://raw.githubusercontent.com/base/brand-kit/main/logo/symbol/Base_Symbol_Blue.png",
  },
}

export const batcherAbi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_usdcBridge",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_usdc",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_link",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "batchSendUSDC",
    "inputs": [
      {
        "name": "transfers",
        "type": "tuple[]",
        "internalType": "struct USDCBridgeBatcher.TransferRequest[]",
        "components": [
          {
            "name": "destinationChainSelector",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "receiver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "messageIds",
        "type": "bytes32[]",
        "internalType": "bytes32[]"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getBatchFees",
    "inputs": [
      {
        "name": "transfers",
        "type": "tuple[]",
        "internalType": "struct USDCBridgeBatcher.TransferRequest[]",
        "components": [
          {
            "name": "destinationChainSelector",
            "type": "uint64",
            "internalType": "uint64"
          },
          {
            "name": "receiver",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "amount",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      }
    ],
    "outputs": [
      {
        "name": "totalFees",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "individualFees",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "i_linkToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "i_usdcBridge",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract USDCBridge"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "i_usdcToken",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IERC20"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "BatchTransferCompleted",
    "inputs": [
      {
        "name": "sender",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "totalTransfers",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "messageIds",
        "type": "bytes32[]",
        "indexed": false,
        "internalType": "bytes32[]"
      },
      {
        "name": "totalFees",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "USDCBridgeBatcher__NoTransfersSpecified",
    "inputs": []
  }
];

export const usdcBridgeAbi = [
  {
    type: "constructor",
    inputs: [
      { name: "_router", type: "address", internalType: "address" },
      { name: "_usdc", type: "address", internalType: "address" },
      { name: "_linkToken", type: "address", internalType: "address" }
    ],
    stateMutability: "nonpayable"
  },
  {
    type: "receive",
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "acceptOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "allowlistDestinationChain",
    inputs: [
      { name: "_destinationChainSelector", type: "uint64", internalType: "uint64" },
      { name: "allowed", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "allowlistSender",
    inputs: [
      { name: "_sender", type: "address", internalType: "address" },
      { name: "allowed", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "allowlistSourceChain",
    inputs: [
      { name: "_sourceChainSelector", type: "uint64", internalType: "uint64" },
      { name: "allowed", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "allowlistedDestinationChains",
    inputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowlistedSenders",
    inputs: [{ name: "", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowlistedSourceChains",
    inputs: [{ name: "", type: "uint64", internalType: "uint64" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "ccipReceive",
    inputs: [
      {
        name: "message",
        type: "tuple",
        internalType: "struct Client.Any2EVMMessage",
        components: [
          { name: "messageId", type: "bytes32", internalType: "bytes32" },
          { name: "sourceChainSelector", type: "uint64", internalType: "uint64" },
          { name: "sender", type: "bytes", internalType: "bytes" },
          { name: "data", type: "bytes", internalType: "bytes" },
          {
            name: "destTokenAmounts",
            type: "tuple[]",
            internalType: "struct Client.EVMTokenAmount[]",
            components: [
              { name: "token", type: "address", internalType: "address" },
              { name: "amount", type: "uint256", internalType: "uint256" }
            ]
          }
        ]
      }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getFee",
    inputs: [
      { name: "_destinationChainSelector", type: "uint64", internalType: "uint64" },
      { name: "_receiver", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_feeToken", type: "address", internalType: "address" }
    ],
    outputs: [{ name: "fee", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getRouter",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "i_linkToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "i_usdcToken",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract IERC20" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "sendUSDCPayLINK",
    inputs: [
      { name: "_destinationChainSelector", type: "uint64", internalType: "uint64" },
      { name: "_receiver", type: "address", internalType: "address" },
      { name: "_amount", type: "uint256", internalType: "uint256" }
    ],
    outputs: [{ name: "messageId", type: "bytes32", internalType: "bytes32" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "supportsInterface",
    inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "to", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "withdrawToken",
    inputs: [
      { name: "_beneficiary", type: "address", internalType: "address" },
      { name: "_token", type: "address", internalType: "address" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "event",
    name: "MessageReceived",
    inputs: [
      { name: "messageId", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "sourceChainSelector", type: "uint64", indexed: true, internalType: "uint64" },
      { name: "sender", type: "address", indexed: false, internalType: "address" },
      { name: "recipient", type: "address", indexed: false, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "MessageSent",
    inputs: [
      { name: "messageId", type: "bytes32", indexed: true, internalType: "bytes32" },
      { name: "destinationChainSelector", type: "uint64", indexed: true, internalType: "uint64" },
      { name: "receiver", type: "address", indexed: false, internalType: "address" },
      { name: "amount", type: "uint256", indexed: false, internalType: "uint256" },
      { name: "fees", type: "uint256", indexed: false, internalType: "uint256" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferRequested",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      { name: "from", type: "address", indexed: true, internalType: "address" },
      { name: "to", type: "address", indexed: true, internalType: "address" }
    ],
    anonymous: false
  },
  {
    type: "error",
    name: "InvalidRouter",
    inputs: [{ name: "router", type: "address", internalType: "address" }]
  },
  {
    type: "error",
    name: "USDCBridge__DestinationChainNotAllowed",
    inputs: [{ name: "destinationChainSelector", type: "uint64", internalType: "uint64" }]
  },
  {
    type: "error",
    name: "USDCBridge__InvalidReceiverAddress",
    inputs: []
  },
  {
    type: "error",
    name: "USDCBridge__NotEnoughBalance",
    inputs: [
      { name: "currentBalance", type: "uint256", internalType: "uint256" },
      { name: "calculatedFees", type: "uint256", internalType: "uint256" }
    ]
  },
  {
    type: "error",
    name: "USDCBridge__NothingToWithdraw",
    inputs: []
  },
  {
    type: "error",
    name: "USDCBridge__SenderNotAllowed",
    inputs: [{ name: "sender", type: "address", internalType: "address" }]
  },
  {
    type: "error",
    name: "USDCBridge__SourceChainNotAllowed",
    inputs: [{ name: "sourceChainSelector", type: "uint64", internalType: "uint64" }]
  }
];