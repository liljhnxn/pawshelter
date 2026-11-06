// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PawShelter
 * @notice Decentralized Pet Adoption Platform
 * @dev "Every Paw Deserves a Home."
 * Allows pet owners to list pets for adoption, interested adopters to express interest,
 * owners to approve adopters, and finalize adoptions on-chain without intermediaries.
 */
contract PawShelter {
    enum PetStatus {
        Available,
        Pending,
        Adopted,
        Cancelled
    }

    struct Pet {
        uint256 id;
        address owner;
        string name;
        string animalType; // Dog, Cat, Bird, Rabbit, etc.
        uint256 age;        // Age in months or years
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

    uint256 private _petIdCounter;
    uint256 public totalPetsAdopted;

    // petId => Pet details
    mapping(uint256 => Pet) private _pets;

    // petId => list of interested adopter addresses
    mapping(uint256 => address[]) private _petInterestedAdopters;

    // petId => adopter address => has expressed interest boolean
    mapping(uint256 => mapping(address => bool)) public hasExpressedInterest;

    // petId => adopter address => AdoptionInterest details
    mapping(uint256 => mapping(address => AdoptionInterest)) public adoptionInterests;

    // Events
    event PetListed(
        uint256 indexed petId,
        address indexed owner,
        string name,
        string animalType,
        uint256 age,
        string location,
        string imageUri,
        uint256 createdAt
    );

    event AdoptionInterestExpressed(
        uint256 indexed petId,
        address indexed adopter,
        string contactInfo,
        string message,
        uint256 timestamp
    );

    event AdopterApproved(
        uint256 indexed petId,
        address indexed owner,
        address indexed approvedAdopter,
        uint256 timestamp
    );

    event PetAdopted(
        uint256 indexed petId,
        address indexed owner,
        address indexed adopter,
        uint256 timestamp
    );

    event ListingCancelled(
        uint256 indexed petId,
        address indexed owner,
        uint256 timestamp
    );

    modifier petExists(uint256 petId) {
        require(petId > 0 && petId <= _petIdCounter, "PawShelter: Pet does not exist");
        _;
    }

    /**
     * @notice Publish a new pet listing
     * @param name Name of the pet
     * @param animalType Dog, Cat, Bird, Rabbit, etc.
     * @param age Age of the pet
     * @param description Brief backstory, temperament, health
     * @param location City / Region
     * @param imageUri Image URL or placeholder key
     */
    function listPet(
        string calldata name,
        string calldata animalType,
        uint256 age,
        string calldata description,
        string calldata location,
        string calldata imageUri
    ) external returns (uint256) {
        require(bytes(name).length > 0, "PawShelter: Name cannot be empty");
        require(bytes(animalType).length > 0, "PawShelter: Animal type required");
        require(bytes(location).length > 0, "PawShelter: Location required");

        _petIdCounter++;
        uint256 newPetId = _petIdCounter;

        _pets[newPetId] = Pet({
            id: newPetId,
            owner: msg.sender,
            name: name,
            animalType: animalType,
            age: age,
            description: description,
            location: location,
            imageUri: imageUri,
            status: PetStatus.Available,
            approvedAdopter: address(0),
            createdAt: block.timestamp,
            adoptedAt: 0
        });

        emit PetListed(
            newPetId,
            msg.sender,
            name,
            animalType,
            age,
            location,
            imageUri,
            block.timestamp
        );

        return newPetId;
    }

    /**
     * @notice Express adoption interest in an available pet
     * @param petId ID of the pet
     * @param contactInfo Optional email/telegram/phone
     * @param message Motivation or introduction from adopter
     */
    function expressInterest(
        uint256 petId,
        string calldata contactInfo,
        string calldata message
    ) external petExists(petId) {
        Pet storage pet = _pets[petId];

        require(pet.owner != msg.sender, "PawShelter: Cannot adopt your own pet listing");
        require(pet.status == PetStatus.Available, "PawShelter: Pet is not available for adoption");
        require(!hasExpressedInterest[petId][msg.sender], "PawShelter: You have already expressed interest");

        hasExpressedInterest[petId][msg.sender] = true;
        _petInterestedAdopters[petId].push(msg.sender);

        adoptionInterests[petId][msg.sender] = AdoptionInterest({
            adopter: msg.sender,
            contactInfo: contactInfo,
            message: message,
            timestamp: block.timestamp
        });

        emit AdoptionInterestExpressed(
            petId,
            msg.sender,
            contactInfo,
            message,
            block.timestamp
        );
    }

    /**
     * @notice Original listing owner approves an interested applicant
     * @dev Prevents multiple approvals and ensures applicant expressed interest
     * @param petId ID of the pet
     * @param adopter Address of the applicant
     */
    function approveAdopter(uint256 petId, address adopter) external petExists(petId) {
        Pet storage pet = _pets[petId];

        require(msg.sender == pet.owner, "PawShelter: Only pet owner can approve adopter");
        require(pet.status == PetStatus.Available, "PawShelter: Pet is not available for new approval");
        require(pet.approvedAdopter == address(0), "PawShelter: An adopter has already been approved");
        require(hasExpressedInterest[petId][adopter], "PawShelter: Applicant has not expressed interest");

        pet.approvedAdopter = adopter;
        pet.status = PetStatus.Pending;

        emit AdopterApproved(petId, msg.sender, adopter, block.timestamp);
    }

    /**
     * @notice Finalize and mark pet as adopted
     * @dev Can be executed by the listing owner or the approved adopter once approved
     * @param petId ID of the pet
     */
    function markAsAdopted(uint256 petId) external petExists(petId) {
        Pet storage pet = _pets[petId];

        require(
            msg.sender == pet.owner || msg.sender == pet.approvedAdopter,
            "PawShelter: Only owner or approved adopter can mark as adopted"
        );
        require(pet.status == PetStatus.Pending, "PawShelter: Pet must be pending approval to finalize");
        require(pet.approvedAdopter != address(0), "PawShelter: No approved adopter assigned");

        pet.status = PetStatus.Adopted;
        pet.adoptedAt = block.timestamp;
        totalPetsAdopted++;

        emit PetAdopted(petId, pet.owner, pet.approvedAdopter, block.timestamp);
    }

    /**
     * @notice Remove or cancel an active listing
     * @param petId ID of the pet
     */
    function cancelListing(uint256 petId) external petExists(petId) {
        Pet storage pet = _pets[petId];

        require(msg.sender == pet.owner, "PawShelter: Only owner can cancel listing");
        require(pet.status != PetStatus.Adopted, "PawShelter: Cannot cancel already adopted pet");
        require(pet.status != PetStatus.Cancelled, "PawShelter: Listing already cancelled");

        pet.status = PetStatus.Cancelled;

        emit ListingCancelled(petId, msg.sender, block.timestamp);
    }

    // --- View Functions ---

    /**
     * @notice Total number of pets ever listed
     */
    function totalPetsListed() external view returns (uint256) {
        return _petIdCounter;
    }

    /**
     * @notice Retrieve details for a single pet
     */
    function getPet(uint256 petId) external view petExists(petId) returns (Pet memory) {
        return _pets[petId];
    }

    /**
     * @notice Retrieve all pets in a single batch
     */
    function getAllPets() external view returns (Pet[] memory) {
        Pet[] memory allPets = new Pet[](_petIdCounter);
        for (uint256 i = 1; i <= _petIdCounter; i++) {
            allPets[i - 1] = _pets[i];
        }
        return allPets;
    }

    /**
     * @notice Retrieve list of interested adopter addresses for a pet
     */
    function getInterestedAdopters(uint256 petId) external view petExists(petId) returns (address[] memory) {
        return _petInterestedAdopters[petId];
    }

    /**
     * @notice Retrieve adoption interest details submitted by a specific adopter
     */
    function getAdoptionInterest(uint256 petId, address adopter) external view petExists(petId) returns (AdoptionInterest memory) {
        return adoptionInterests[petId][adopter];
    }

    /**
     * @notice Retrieve all adoption interest applications for a pet
     */
    function getAllAdoptionInterests(uint256 petId) external view petExists(petId) returns (AdoptionInterest[] memory) {
        address[] memory applicants = _petInterestedAdopters[petId];
        AdoptionInterest[] memory details = new AdoptionInterest[](applicants.length);
        for (uint256 i = 0; i < applicants.length; i++) {
            details[i] = adoptionInterests[petId][applicants[i]];
        }
        return details;
    }

    /**
     * @notice Platform overview statistics
     */
    function getPlatformStats() external view returns (
        uint256 totalListed,
        uint256 totalAdopted,
        uint256 totalAvailable
    ) {
        totalListed = _petIdCounter;
        totalAdopted = totalPetsAdopted;
        uint256 availableCount = 0;
        for (uint256 i = 1; i <= _petIdCounter; i++) {
            if (_pets[i].status == PetStatus.Available) {
                availableCount++;
            }
        }
        totalAvailable = availableCount;
    }
}
