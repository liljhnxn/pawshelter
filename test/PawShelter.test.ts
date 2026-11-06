import { expect } from "chai";
import hre from "hardhat";
const { ethers } = hre;
import { PawShelter } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("PawShelter Smart Contract", function () {
  let pawShelter: PawShelter;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let charlie: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob, charlie] = await ethers.getSigners();

    const PawShelterFactory = await ethers.getContractFactory("PawShelter");
    pawShelter = (await PawShelterFactory.deploy()) as unknown as PawShelter;
    await pawShelter.waitForDeployment();
  });

  describe("Pet Listing", function () {
    it("should allow a user to list a pet and emit PetListed event", async function () {
      const tx = await pawShelter.connect(owner).listPet(
        "Barnaby",
        "Dog",
        3,
        "A friendly Golden Retriever who loves belly rubs and outdoor fetch.",
        "Seattle, WA",
        "https://images.unsplash.com/photo-1552053831-71594a27632d"
      );

      await expect(tx)
        .to.emit(pawShelter, "PetListed")
        .withArgs(
          1,
          owner.address,
          "Barnaby",
          "Dog",
          3,
          "Seattle, WA",
          "https://images.unsplash.com/photo-1552053831-71594a27632d",
          await (await ethers.provider.getBlock("latest"))!.timestamp
        );

      const total = await pawShelter.totalPetsListed();
      expect(total).to.equal(1);

      const pet = await pawShelter.getPet(1);
      expect(pet.id).to.equal(1);
      expect(pet.name).to.equal("Barnaby");
      expect(pet.animalType).to.equal("Dog");
      expect(pet.age).to.equal(3);
      expect(pet.location).to.equal("Seattle, WA");
      expect(pet.owner).to.equal(owner.address);
      expect(pet.status).to.equal(0); // Available
    });

    it("should revert if required fields are empty", async function () {
      await expect(
        pawShelter.connect(owner).listPet("", "Dog", 2, "Friendly", "New York", "")
      ).to.be.revertedWith("PawShelter: Name cannot be empty");

      await expect(
        pawShelter.connect(owner).listPet("Milo", "", 2, "Friendly", "New York", "")
      ).to.be.revertedWith("PawShelter: Animal type required");

      await expect(
        pawShelter.connect(owner).listPet("Milo", "Cat", 2, "Friendly", "", "")
      ).to.be.revertedWith("PawShelter: Location required");
    });
  });

  describe("Expressing Adoption Interest", function () {
    beforeEach(async function () {
      await pawShelter.connect(owner).listPet(
        "Luna",
        "Cat",
        2,
        "Gentle domestic shorthair seeking a cozy window sill.",
        "Portland, OR",
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba"
      );
    });

    it("should allow an interested user to express interest and emit event", async function () {
      const tx = await pawShelter.connect(alice).expressInterest(
        1,
        "alice@example.com",
        "I have a quiet home with no other pets and lots of love to give!"
      );

      await expect(tx)
        .to.emit(pawShelter, "AdoptionInterestExpressed")
        .withArgs(
          1,
          alice.address,
          "alice@example.com",
          "I have a quiet home with no other pets and lots of love to give!",
          await (await ethers.provider.getBlock("latest"))!.timestamp
        );

      expect(await pawShelter.hasExpressedInterest(1, alice.address)).to.be.true;

      const adopters = await pawShelter.getInterestedAdopters(1);
      expect(adopters.length).to.equal(1);
      expect(adopters[0]).to.equal(alice.address);

      const interest = await pawShelter.getAdoptionInterest(1, alice.address);
      expect(interest.adopter).to.equal(alice.address);
      expect(interest.contactInfo).to.equal("alice@example.com");
    });

    it("should prevent the pet owner from expressing interest in their own listing", async function () {
      await expect(
        pawShelter.connect(owner).expressInterest(1, "owner@example.com", "I want to adopt my own pet")
      ).to.be.revertedWith("PawShelter: Cannot adopt your own pet listing");
    });

    it("should prevent a user from expressing interest more than once", async function () {
      await pawShelter.connect(alice).expressInterest(1, "alice@example.com", "First request");

      await expect(
        pawShelter.connect(alice).expressInterest(1, "alice@example.com", "Second request")
      ).to.be.revertedWith("PawShelter: You have already expressed interest");
    });

    it("should allow multiple different users to express interest", async function () {
      await pawShelter.connect(alice).expressInterest(1, "alice@example.com", "Alice request");
      await pawShelter.connect(bob).expressInterest(1, "bob@example.com", "Bob request");

      const adopters = await pawShelter.getInterestedAdopters(1);
      expect(adopters.length).to.equal(2);
      expect(adopters[0]).to.equal(alice.address);
      expect(adopters[1]).to.equal(bob.address);
    });
  });

  describe("Adopter Approval & Adoption Completion", function () {
    beforeEach(async function () {
      await pawShelter.connect(owner).listPet(
        "Copper",
        "Dog",
        1,
        "Energetic beagle puppy looking for active family.",
        "Denver, CO",
        ""
      );
      await pawShelter.connect(alice).expressInterest(1, "alice@example.com", "Ready for puppy training!");
      await pawShelter.connect(bob).expressInterest(1, "bob@example.com", "Have huge backyard!");
    });

    it("should allow owner to approve an interested adopter", async function () {
      const tx = await pawShelter.connect(owner).approveAdopter(1, alice.address);

      await expect(tx)
        .to.emit(pawShelter, "AdopterApproved")
        .withArgs(
          1,
          owner.address,
          alice.address,
          await (await ethers.provider.getBlock("latest"))!.timestamp
        );

      const pet = await pawShelter.getPet(1);
      expect(pet.approvedAdopter).to.equal(alice.address);
      expect(pet.status).to.equal(1); // Pending
    });

    it("should prevent non-owners from approving an adopter", async function () {
      await expect(
        pawShelter.connect(bob).approveAdopter(1, alice.address)
      ).to.be.revertedWith("PawShelter: Only pet owner can approve adopter");
    });

    it("should prevent approving someone who did not express interest", async function () {
      await expect(
        pawShelter.connect(owner).approveAdopter(1, charlie.address)
      ).to.be.revertedWith("PawShelter: Applicant has not expressed interest");
    });

    it("should prevent multiple approvals for the same pet", async function () {
      await pawShelter.connect(owner).approveAdopter(1, alice.address);

      await expect(
        pawShelter.connect(owner).approveAdopter(1, bob.address)
      ).to.be.revertedWith("PawShelter: Pet is not available for new approval");
    });

    it("should allow marking the pet as adopted by owner or approved adopter", async function () {
      await pawShelter.connect(owner).approveAdopter(1, alice.address);

      // Approved adopter marks as adopted
      const tx = await pawShelter.connect(alice).markAsAdopted(1);

      await expect(tx)
        .to.emit(pawShelter, "PetAdopted")
        .withArgs(
          1,
          owner.address,
          alice.address,
          await (await ethers.provider.getBlock("latest"))!.timestamp
        );

      const pet = await pawShelter.getPet(1);
      expect(pet.status).to.equal(2); // Adopted
      expect(await pawShelter.totalPetsAdopted()).to.equal(1);
    });

    it("should reject marking as adopted if not owner or approved adopter", async function () {
      await pawShelter.connect(owner).approveAdopter(1, alice.address);

      await expect(
        pawShelter.connect(charlie).markAsAdopted(1)
      ).to.be.revertedWith("PawShelter: Only owner or approved adopter can mark as adopted");
    });

    it("should reject expressing interest on a pending or adopted pet", async function () {
      await pawShelter.connect(owner).approveAdopter(1, alice.address);

      await expect(
        pawShelter.connect(charlie).expressInterest(1, "charlie@mail.com", "Too late?")
      ).to.be.revertedWith("PawShelter: Pet is not available for adoption");
    });
  });

  describe("Listing Cancellation", function () {
    beforeEach(async function () {
      await pawShelter.connect(owner).listPet("Pip", "Bird", 1, "Singing canary", "Austin, TX", "");
    });

    it("should allow the owner to cancel their listing", async function () {
      const tx = await pawShelter.connect(owner).cancelListing(1);

      await expect(tx)
        .to.emit(pawShelter, "ListingCancelled")
        .withArgs(1, owner.address, await (await ethers.provider.getBlock("latest"))!.timestamp);

      const pet = await pawShelter.getPet(1);
      expect(pet.status).to.equal(3); // Cancelled
    });

    it("should prevent non-owners from cancelling", async function () {
      await expect(
        pawShelter.connect(alice).cancelListing(1)
      ).to.be.revertedWith("PawShelter: Only owner can cancel listing");
    });

    it("should prevent cancelling an already adopted pet", async function () {
      await pawShelter.connect(alice).expressInterest(1, "alice@mail.com", "Hi");
      await pawShelter.connect(owner).approveAdopter(1, alice.address);
      await pawShelter.connect(owner).markAsAdopted(1);

      await expect(
        pawShelter.connect(owner).cancelListing(1)
      ).to.be.revertedWith("PawShelter: Cannot cancel already adopted pet");
    });
  });

  describe("Batch Views and Stats", function () {
    it("should return correct platform statistics and all pets array", async function () {
      await pawShelter.connect(owner).listPet("Max", "Dog", 4, "Loyal", "Chicago", "");
      await pawShelter.connect(alice).listPet("Mochi", "Cat", 1, "Sweet", "Miami", "");

      // Express interest & adopt first pet
      await pawShelter.connect(bob).expressInterest(1, "bob@mail.com", "I want Max");
      await pawShelter.connect(owner).approveAdopter(1, bob.address);
      await pawShelter.connect(owner).markAsAdopted(1);

      const allPets = await pawShelter.getAllPets();
      expect(allPets.length).to.equal(2);
      expect(allPets[0].name).to.equal("Max");
      expect(allPets[1].name).to.equal("Mochi");

      const stats = await pawShelter.getPlatformStats();
      expect(stats.totalListed).to.equal(2);
      expect(stats.totalAdopted).to.equal(1);
      expect(stats.totalAvailable).to.equal(1); // Mochi is still available
    });
  });
});
