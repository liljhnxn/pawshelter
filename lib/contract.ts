import { defineChain } from "viem";

export const BOTCHAIN_CHAIN_ID = 968;

export const botchainTestnet = defineChain({
  id: BOTCHAIN_CHAIN_ID,
  name: "Botchain Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Botchain",
    symbol: "BOHR",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bohr.life"],
    },
    public: {
      http: ["https://rpc.bohr.life"],
    },
  },
  blockExplorers: {
    default: {
      name: "Botchain Explorer",
      url: "https://scan.bohr.life",
    },
  },
  testnet: true,
});

export const PAWSHELTER_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as `0x${string}`;

export const PAWSHELTER_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "petId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "approvedAdopter", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "AdopterApproved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "petId", type: "uint256" },
      { indexed: true, internalType: "address", name: "adopter", type: "address" },
      { indexed: false, internalType: "string", name: "contactInfo", type: "string" },
      { indexed: false, internalType: "string", name: "message", type: "string" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "AdoptionInterestExpressed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "petId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "ListingCancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "petId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "adopter", type: "address" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
    ],
    name: "PetAdopted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "petId", type: "uint256" },
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "string", name: "animalType", type: "string" },
      { indexed: false, internalType: "uint256", name: "age", type: "uint256" },
      { indexed: false, internalType: "string", name: "location", type: "string" },
      { indexed: false, internalType: "string", name: "imageUri", type: "string" },
      { indexed: false, internalType: "uint256", name: "createdAt", type: "uint256" },
    ],
    name: "PetListed",
    type: "event",
  },
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "address", name: "adopter", type: "address" },
    ],
    name: "approveAdopter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "petId", type: "uint256" }],
    name: "cancelListing",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "string", name: "contactInfo", type: "string" },
      { internalType: "string", name: "message", type: "string" },
    ],
    name: "expressInterest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "address", name: "adopter", type: "address" },
    ],
    name: "getAdoptionInterest",
    outputs: [
      {
        components: [
          { internalType: "address", name: "adopter", type: "address" },
          { internalType: "string", name: "contactInfo", type: "string" },
          { internalType: "string", name: "message", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct PawShelter.AdoptionInterest",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "petId", type: "uint256" }],
    name: "getAllAdoptionInterests",
    outputs: [
      {
        components: [
          { internalType: "address", name: "adopter", type: "address" },
          { internalType: "string", name: "contactInfo", type: "string" },
          { internalType: "string", name: "message", type: "string" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        internalType: "struct PawShelter.AdoptionInterest[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllPets",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "animalType", type: "string" },
          { internalType: "uint256", name: "age", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "imageUri", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "address", name: "approvedAdopter", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "adoptedAt", type: "uint256" },
        ],
        internalType: "struct PawShelter.Pet[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "petId", type: "uint256" }],
    name: "getInterestedAdopters",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "petId", type: "uint256" }],
    name: "getPet",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "animalType", type: "string" },
          { internalType: "uint256", name: "age", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "string", name: "location", type: "string" },
          { internalType: "string", name: "imageUri", type: "string" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "address", name: "approvedAdopter", type: "address" },
          { internalType: "uint256", name: "createdAt", type: "uint256" },
          { internalType: "uint256", name: "adoptedAt", type: "uint256" },
        ],
        internalType: "struct PawShelter.Pet",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getPlatformStats",
    outputs: [
      { internalType: "uint256", name: "totalListed", type: "uint256" },
      { internalType: "uint256", name: "totalAdopted", type: "uint256" },
      { internalType: "uint256", name: "totalAvailable", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "petId", type: "uint256" },
      { internalType: "address", name: "adopter", type: "address" },
    ],
    name: "hasExpressedInterest",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "animalType", type: "string" },
      { internalType: "uint256", name: "age", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "string", name: "location", type: "string" },
      { internalType: "string", name: "imageUri", type: "string" },
    ],
    name: "listPet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "petId", type: "uint256" }],
    name: "markAsAdopted",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPetsAdopted",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPetsListed",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export enum PetStatus {
  Available = 0,
  Pending = 1,
  Adopted = 2,
  Cancelled = 3,
}

export interface PetData {
  id: bigint;
  owner: `0x${string}`;
  name: string;
  animalType: string;
  age: bigint;
  description: string;
  location: string;
  imageUri: string;
  status: PetStatus;
  approvedAdopter: `0x${string}`;
  createdAt: bigint;
  adoptedAt: bigint;
}

export interface AdoptionInterestData {
  adopter: `0x${string}`;
  contactInfo: string;
  message: string;
  timestamp: bigint;
}
