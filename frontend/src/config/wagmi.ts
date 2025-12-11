import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Lucky Table",
  projectId: "3a8170812b534d0ff9d794f19a901d64", // Public testing ID
  chains: [sepolia],
  ssr: true,
});

export const CONTRACT_ADDRESS = "0xfc3eDC004CEDe01Ca91314753669E5eE8ada64e7" as const;

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "externalEuint8", name: "encChoice", type: "bytes32" },
      { internalType: "bytes", name: "inputProof", type: "bytes" },
    ],
    name: "draw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getResultHandle",
    outputs: [{ internalType: "bytes32", name: "handle", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "player", type: "address" }],
    name: "hasResult",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "clearResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalDraws",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "DrawStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "player", type: "address" },
      { indexed: false, internalType: "uint256", name: "drawId", type: "uint256" },
    ],
    name: "DrawCompleted",
    type: "event",
  },
] as const;

