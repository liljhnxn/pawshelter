# 🐾 PawShelter: Decentralized Pet Adoption Registry
## Technical Whitepaper v1.0
**"Every Paw Deserves a Home."**

* **Network**: Botchain Testnet (Chain ID: `968`)
* **Smart Contract Address**: [`0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb`](https://scan.bohr.life/address/0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb#code)
* **Open Source Repository**: [https://github.com/liljhnxn/pawshelter](https://github.com/liljhnxn/pawshelter)

---

## 1. Executive Summary

Every year, an estimated 6.3 million companion animals enter animal shelters in the United States alone, and tens of millions more experience displacement globally. Traditional pet adoption platforms suffer from heavy centralization, opaque administrative fees, fragmented databases, and fraudulent "pet-flipping" scams.

**PawShelter** is a trustless, decentralized pet adoption registry built on the Botchain Testnet. By anchoring every pet listing, adoption expression of interest, owner approval, and finalized adoption on-chain, PawShelter eliminates intermediaries, removes unnecessary platform commissions, and provides an immutable public record of every rescue animal’s journey to a forever home.

PawShelter intentionally rejects speculative tokenomics and NFT financialization. It uses blockchain technology for its core purpose: **tamper-proof transparency, public verifiability, and permanent data availability**.

---

## 2. Problem Statement

### 2.1 Centralized Gatekeepers & Data Silos
Traditional rescue directories operate as walled gardens. Rescuers and shelters must maintain duplicate profiles across disparate proprietary platforms. When listings go stale or platforms change policies, pets lose visibility.

### 2.2 Lack of Accountability & Fake Listings
Classified websites and centralized pet forums are plagued by adoption scams, bait-and-switch puppy mills, and fraudulent re-homing fees. There is no verifiable audit trail connecting the rescuer to the adopter.

### 2.3 Over-Financialization in Web3
Many "Web3 pet" projects turn rescue animals into speculative trading cards, dynamic NFTs, or yield-farming tokens. This introduces speculative volatility and perverse incentives that detract from the primary mission: animal welfare.

---

## 3. The PawShelter Solution

PawShelter provides a minimalist, tamper-resistant, public good infrastructure for pet adoption:

```
[Pet Owner / Shelter] 
         │  1. listPet()
         ▼
 ┌──────────────────────────────────────────────┐
 │             PawShelter.sol                   │
 │   State: Available                           │
 └──────────────────────────────────────────────┘
         │
         │  2. expressInterest()
         ▼
[Prospective Adopter] (Contact & motivation recorded on-chain)
         │
         │  3. approveAdopter() (Owner verifies applicant)
         ▼
 ┌──────────────────────────────────────────────┐
 │   State: Pending (Adopter Locked)            │
 └──────────────────────────────────────────────┘
         │
         │  4. markAsAdopted() (Owner or Adopter finalizes)
         ▼
 ┌──────────────────────────────────────────────┐
 │   State: Adopted 🎉 (Permanent On-Chain Log) │
 └──────────────────────────────────────────────┘
```

1. **Decentralized Publishing**: Anyone can list a pet with metadata (name, animal category, age, description, geographic location, and media URI) stored directly on-chain.
2. **Transparent Interest**: Prospective adopters submit adoption applications (contact handle and household qualifications) on-chain.
3. **Anti-Collusion & Anti-Self Adoption**: The smart contract prevents listing owners from expressing interest in their own listings and enforces a single-approval mechanism.
4. **Permanent Adoption Verification**: Once approved, either the shelter or the adopter can finalize the transaction, transitioning the pet to `Adopted` and permanently recording the milestone.

---

## 4. Technical Architecture

### 4.1 System Overview
PawShelter is designed with strict architectural constraints:
* **Single Webpage Frontend**: Built with Next.js 14 App Router, TypeScript, and Tailwind CSS.
* **Single Smart Contract**: [`PawShelter.sol`](contracts/PawShelter.sol) deployed on Botchain Testnet.
* **Zero Centralized Backend / Database**: No servers, no Firebase, no PostgreSQL. All state is queried directly from RPC nodes via `viem` and `wagmi`.

### 4.2 Smart Contract Architecture (`PawShelter.sol`)
* **Solidity Version**: `^0.8.20`
* **EVM Target**: `paris`
* **Optimizer**: Enabled (200 runs)

#### Core Data Structures
```solidity
enum PetStatus { Available, Pending, Adopted, Cancelled }

struct Pet {
    uint256 id;
    address owner;
    string name;
    string animalType;
    uint256 age;
    string description;
    string location;
    string imageUri;
    PetStatus status;
    address approvedAdopter;
    uint256 createdAt;
    uint256 adoptedAt;
}

struct AdoptionInterest {
    address adopter;
    string contactInfo;
    string message;
    uint256 timestamp;
}
```

#### Key Methods & Modifiers
| Function | Access | Description |
| :--- | :--- | :--- |
| `listPet(...)` | Public | Mints a new pet adoption listing and emits `PetListed`. |
| `expressInterest(...)` | Public | Submits contact info and motivation. Reverts if caller is owner or has already applied. |
| `approveAdopter(...)` | Owner Only | Approves a specific applicant. Locks pet into `Pending` status. |
| `markAsAdopted(...)` | Owner / Adopter | Finalizes adoption and increments `totalPetsAdopted`. |
| `cancelListing(...)` | Owner Only | Withdraws listing from adoption. Cannot cancel adopted pets. |
| `getAllPets()` | View | Batched on-chain array retrieval for frontend rendering. |
| `getPlatformStats()` | View | Returns total listed, total adopted, and currently available counts. |

### 4.3 On-Chain Events
* `PetListed(uint256 indexed petId, address indexed owner, string name, string animalType, ...)`
* `AdoptionInterestExpressed(uint256 indexed petId, address indexed adopter, string contactInfo, ...)`
* `AdopterApproved(uint256 indexed petId, address indexed owner, address indexed approvedAdopter, ...)`
* `PetAdopted(uint256 indexed petId, address indexed owner, address indexed adopter, ...)`
* `ListingCancelled(uint256 indexed petId, address indexed owner, uint256 timestamp)`

---

## 5. Security & Verification

* **Reentrancy Immunity**: All state modifications follow the Checks-Effects-Interactions (CEI) pattern. The contract holds zero native currency or tokens, making value-drain attacks impossible.
* **Access Control**: Strictly verified via `msg.sender == pet.owner` and `msg.sender == pet.approvedAdopter`.
* **Testing Rigor**: 17 automated tests run through Hardhat covering boundary limits, permission violations, duplicate prevention, and edge cases.
* **Contract Verification**: Source code is verified and auditable on [Botchain Explorer](https://scan.bohr.life/address/0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb#code).

---

## 6. UI/UX Design Philosophy

* **Palette**: Warm Cream (`#FAF7F2`), Forest Green (`#1E3A2B`), Warm Earth Brown (`#8B5E3C`), and Subtle Terracotta (`#E07A5F`).
* **Accessibility**: Clean rounded cards, high-contrast type, intuitive modal flows, and responsive mobile-first grid.
* **Web3 Friction Reduction**: Automatic Botchain network detection, prompt chain-switching, native BOHR balance display, and real-time transaction status toasts.

---

## 7. Roadmap

* **Phase 1 (Completed)**: Core smart contract deployment, test suite, and one-page Web3 application on Botchain Testnet.
* **Phase 2**: Decentralized media storage via IPFS/Filecoin for high-resolution veterinary and vaccination documents.
* **Phase 3**: Soulbound Attestation Tokens (EAS / SBT) for verified shelters and repeat foster homes.
* **Phase 4**: Direct BOHR micro-donations directly to listing owners upon verified adoption completion.

---

## 8. Conclusion

PawShelter demonstrates that decentralized ledgers can provide immediate, practical value beyond financial speculation. By treating companion animal welfare as a transparent public registry, PawShelter gives rescue pets the permanence, visibility, and dignity they deserve.

**Every Paw Deserves a Home.**
