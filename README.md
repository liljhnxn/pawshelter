# 🐾 PawShelter

> **"Every Paw Deserves a Home."**

A decentralized pet adoption listing platform built on the **Botchain Testnet**. PawShelter connects rescue pet owners and prospective adopters directly on-chain with zero intermediaries, transparent listings, and tamper-proof adoption tracking.

---

## 🌟 Key Highlights

- **Exactly One Webpage**: Full-featured single-page application built with Next.js App Router, Tailwind CSS, wagmi, and viem.
- **Exactly One Smart Contract**: [`PawShelter.sol`](contracts/PawShelter.sol) handles all pet listings, expressions of interest, approvals, and adoption completions.
- **Zero Backend / Database**: All data is read and written directly to the Botchain blockchain.
- **No Tokens / NFTs**: Transparent record keeping focused purely on animal welfare and verified adoptions.
- **MetaMask Integration**: One-click wallet connection and automated network configuration for Botchain Mainnet.

---

## 🌐 Network Details (Botchain Mainnet)

| Parameter | Mainnet Value | Testnet Value |
| :--- | :--- | :--- |
| **Network Name** | **Botchain Mainnet** | Botchain Testnet |
| **Chain ID** | `677` | `968` |
| **Native Currency** | `BOT` (150M Total Supply) | `BOHR` |
| **RPC Endpoint** | `https://rpc.botchain.ai` | `https://rpc.bohr.life` |
| **Block Explorer** | [https://scan.botchain.ai](https://scan.botchain.ai) | [https://scan.bohr.life](https://scan.bohr.life) |
| **Deployed Contract** | [`0xBF87827AF27574Bc6594D18450E1e9b20523B2D6`](https://scan.botchain.ai/address/0xBF87827AF27574Bc6594D18450E1e9b20523B2D6#code) | `0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb` |

---

## 🏗️ Architecture & Features

### Smart Contract (`PawShelter.sol`)
1. **Publish a Pet Listing**: Records pet name, animal type (Dog, Cat, Bird, Rabbit, etc.), age, description, location, and optional photo URI.
2. **Browse Available Pets**: On-chain view functions for batched queries (`getAllPets`, `getPet`, `getPlatformStats`).
3. **Express Adoption Interest**: Allows prospective adopters to submit contact information and motivation messages. Prevents owners from adopting their own listings and blocks duplicate requests.
4. **Owner Approvals**: Pet owners review applicant stories and approve one applicant for adoption (preventing multiple concurrent approvals).
5. **Finalize Adoption**: Marks the pet as officially adopted once the owner or approved adopter confirms, locking in the adoption on-chain.
6. **Withdraw/Cancel**: Pet owners can withdraw available listings.
7. **Emits Events**: `PetListed`, `AdoptionInterestExpressed`, `AdopterApproved`, `PetAdopted`, `ListingCancelled`.

### Web3 Frontend
- **Hero Headline**: *"Find a Friend. Give Them a Home."*
- **Live On-Chain Counters**: Total pets listed, total pets adopted, and pets currently available.
- **Animal Category Filters**: All, Dogs, Cats, Birds, Rabbits, Others.
- **Interactive Modals**:
  - **Add Pet Modal**: Upload pet details directly onto Botchain.
  - **Express Interest Modal**: Submit an on-chain adoption application.
  - **Pet Details Modal**: Detailed view with story, owner info, applicant list, approval controls, and direct block explorer links.
- **My Listings Section**: Manage your listings and review prospective adopters.
- **My Adoption Requests**: Track your pending and approved adoption applications.
- **Toast Notifications**: Real-time feedback for transaction submission, mining, and confirmation.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ or v20+)
- MetaMask or any Web3 injected browser wallet
- Some testnet `BOHR` tokens on Botchain Testnet

### 2. Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your private key and RPC if deploying:
```env
PRIVATE_KEY=your_private_key_here
BOTCHAIN_RPC_URL=https://rpc.bohr.life
NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS=0x...
```

### 3. Compile & Test Smart Contract
```bash
# Compile Solidity contracts
npm run compile

# Run smart contract unit tests
npm run test
```

### 4. Deploy Smart Contract
Deploy `PawShelter.sol` to Botchain Testnet:
```bash
npm run deploy
```
Copy the printed contract address into your `.env` file under `NEXT_PUBLIC_PAWSHELTER_CONTRACT_ADDRESS`.

### 5. Run Frontend Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Smart Contract Tests

PawShelter includes a comprehensive test suite covering:
- Pet listing publication and input validations.
- Expressing adoption interest, preventing self-adoption, and duplicate requests.
- Owner approval workflows and preventing multiple approvals.
- Finalizing adoptions and updating global platform metrics.
- Owner listing cancellations and protection of already adopted pets.
- Platform statistics and batch view methods.

Run the tests with:
```bash
npx hardhat test
```

---

## 📄 License
MIT License. Created for the animal rescue and Web3 community.

