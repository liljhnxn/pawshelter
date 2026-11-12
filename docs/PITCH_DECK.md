# 🐾 PawShelter: Pitch Deck
### *"Every Paw Deserves a Home."*
**Decentralized Pet Adoption Registry on Botchain**

---

## Slide 1: Cover & Vision
* **Title**: PawShelter
* **Tagline**: Every Paw Deserves a Home.
* **Mission**: Rebuilding animal rescue infrastructure on trustless, verifiable public ledgers.
* **Network**: Botchain Mainnet (Chain ID `677`, Native Token: `BOT`)
* **Contract**: [`0xBF87827AF27574Bc6594D18450E1e9b20523B2D6`](https://scan.botchain.ai/address/0xBF87827AF27574Bc6594D18450E1e9b20523B2D6#code)
* **Website / Repo**: [github.com/liljhnxn/pawshelter](https://github.com/liljhnxn/pawshelter)

---

## Slide 2: The Problem
### The Animal Rescue Crisis Meets Broken Web2 Tech
1. **Opaque Intermediaries**: Centralized adoption portals charge hidden fees and sell user data while shelters struggle for funding.
2. **Fraud & "Pet-Flipping"**: No verifiable history connects breeders, rescuers, and adopters. Millions of dollars are lost to online puppy deposit scams.
3. **Web3's Flawed Approach**: Previous crypto pet projects focused on speculative NFTs, virtual breeding, and yield farming, failing real-world rescue animals.

---

## Slide 3: The Solution
### PawShelter: A Trustless, On-Chain Adoption Registry
* **Zero Backend**: All adoption listings and statuses exist permanently on-chain.
* **Direct Connections**: Adopters connect straight to pet rescuers with verifiable applications.
* **Tamper-Proof Statuses**: A deterministic state machine (`Available` → `Pending` → `Adopted`) verifiable by anyone, anywhere.
* **Zero Token Speculation**: Pure utility and philanthropic transparency.

---

## Slide 4: Market Opportunity
### A Massive, Underserved Market
* **6.3M+** companion animals enter US shelters each year; tens of millions globally.
* **$147 Billion** total pet industry expenditure (US, 2023).
* **$3.5 Billion+** donated annually to animal welfare charities.
* **Target Audience**:
  * Independent animal rescuers and municipal shelters.
  * Web3 native pet lovers seeking transparent adoption verification.
  * Donors demanding auditable proof of adoption outcomes.

---

## Slide 5: Product Walkthrough
### Built for Real People, Powered by Web3
* **One-Click Discovery**: Fast, responsive grid with category filters (Dogs 🐕, Cats 🐈, Birds 🦜, Rabbits 🐇, Others 🐾).
* **Transparent Application Flow**:
  1. Rescuer lists pet with photo, age, location, and story.
  2. Adopter submits interest with verified contact handle.
  3. Rescuer reviews applicant and grants single-party approval.
  4. Either party finalizes the adoption milestone on-chain.
* **Mobile-First Experience**: Soft cream, forest green, warm brown, and subtle terracotta aesthetic with custom paw branding.

---

## Slide 6: System Architecture
### Minimalist, Robust, Production-Grade
* **Smart Contract**: Exactly one Solidity contract ([`PawShelter.sol`](contracts/PawShelter.sol)) compiled with Solidity `0.8.20`.
* **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS.
* **Web3 Integration**: `wagmi` v2 + `viem` + MetaMask / Injected Provider.
* **Network**: Botchain Testnet (`rpc.bohr.life`, Chain ID: 968).
* **Audited Rigor**: 17 automated tests passing with 100% success.
* **Block Explorer Verified**: Fully verified code on [scan.bohr.life](https://scan.bohr.life/address/0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb#code).

---

## Slide 7: Competitive Advantage

| Feature | Centralized Sites (Petfinder, Craigslist) | Typical Web3 Pet Projects | PawShelter |
| :--- | :--- | :--- | :--- |
| **Data Ownership** | Corporate Silos | Centralized metadata | 100% On-Chain |
| **Audit Trail** | None / Easily deleted | Often just static NFTs | Immutable Lifecycle Events |
| **Speculation** | High Ad Clutter | Token Dump Risks | Zero Tokens, Pure Impact |
| **Direct Peer-to-Peer** | Walled Garden | Discord Chaos | Smart Contract Handshake |
| **Transaction Cost** | High Commissions | Heavy gas fees | Micro-gas on Botchain |

---

## Slide 8: Business & Sustainability Model
### How PawShelter Remains Free & Self-Sustaining
1. **Public Good Infrastructure**: Core listing and adoption remain permanently free.
2. **Voluntary Rescuer Tips**: Optional on-chain micro-tips to support local foster homes upon adoption finalization.
3. **Shelter Verification Grants**: Partnerships with animal welfare DAOs and municipal animal shelters.
4. **Corporate Social Responsibility (CSR)**: Web3 sponsors funding pet medical sponsorships verified through adoption milestones.

---

## Slide 9: Roadmap
* **Q1 2026 (Completed)**:
  * Deploy & verify `PawShelter.sol` on Botchain Testnet.
  * Launch single-page Web3 App with full listing, application, and approval flow.
  * Comprehensive 17-test suite & automated deployment pipeline.
* **Q2 2026**:
  * Decentralized IPFS storage for medical records and vaccination passports.
  * Verified Shelter Badges via on-chain attestations.
* **Q3 2026**:
  * Direct foster micro-donations in BOHR.
  * Mobile progressive web app (PWA) with push notifications for new rescue listings.

---

## Slide 10: The Team & Call to Action
* **Tagline**: *"Find a Friend. Give Them a Home."*
* **Live Demo**: [http://localhost:3000](http://localhost:3000)
* **GitHub Repository**: [https://github.com/liljhnxn/pawshelter](https://github.com/liljhnxn/pawshelter)
* **Contract on Explorer**: [https://scan.bohr.life/address/0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb](https://scan.bohr.life/address/0x4Dc528244A916a8ed887D2F5d22a0500237aA7cb)

**Join us in revolutionizing pet rescue on Botchain.**

