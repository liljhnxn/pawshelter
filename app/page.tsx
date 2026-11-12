"use client";

import React, { useState, useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import {
  PAWSHELTER_CONTRACT_ADDRESS,
  PAWSHELTER_ABI,
  PetData,
  PetStatus,
} from "@/lib/contract";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { PetCard } from "@/components/PetCard";
import { AddPetModal } from "@/components/AddPetModal";
import { ExpressInterestModal } from "@/components/ExpressInterestModal";
import { PetDetailsModal } from "@/components/PetDetailsModal";
import { ToastContainer, ToastMessage } from "@/components/Toast";
import {
  Search,
  Filter,
  Plus,
  Heart,
  Dog,
  Cat,
  Bird,
  Rabbit,
  PawPrint,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

const CATEGORIES = [
  { id: "all", label: "All Animals", icon: PawPrint },
  { id: "Dog", label: "Dogs", icon: Dog },
  { id: "Cat", label: "Cats", icon: Cat },
  { id: "Bird", label: "Birds", icon: Bird },
  { id: "Rabbit", label: "Rabbits", icon: Rabbit },
  { id: "Other", label: "Others", icon: PawPrint },
];

export default function Home() {
  const { address, isConnected } = useAccount();

  // Navigation / Tab state
  const [activeTab, setActiveTab] = useState<"browse" | "my-listings" | "my-requests">("browse");

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExpressModalOpen, setIsExpressModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: "success" | "error" | "info",
    title: string,
    message?: string,
    txHash?: string
  ) => {
    const newToast: ToastMessage = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
      txHash,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- On-Chain Reads ---
  const {
    data: allPetsData,
    isLoading: isPetsLoading,
    refetch: refetchPets,
    isRefetching,
  } = useReadContract({
    address: PAWSHELTER_CONTRACT_ADDRESS,
    abi: PAWSHELTER_ABI,
    functionName: "getAllPets",
  });

  const { data: statsData, refetch: refetchStats } = useReadContract({
    address: PAWSHELTER_CONTRACT_ADDRESS,
    abi: PAWSHELTER_ABI,
    functionName: "getPlatformStats",
  });

  const pets: PetData[] = useMemo(() => {
    if (!allPetsData) return [];
    return (allPetsData as PetData[]).map((p) => ({
      ...p,
      id: BigInt(p.id),
      age: BigInt(p.age),
      status: Number(p.status) as PetStatus,
      createdAt: BigInt(p.createdAt),
      adoptedAt: BigInt(p.adoptedAt),
    }));
  }, [allPetsData]);

  // Platform stats
  const totalListed = statsData ? Number(statsData[0]) : pets.length;
  const totalAdopted = statsData
    ? Number(statsData[1])
    : pets.filter((p) => p.status === PetStatus.Adopted).length;
  const totalAvailable = statsData
    ? Number(statsData[2])
    : pets.filter((p) => p.status === PetStatus.Available).length;

  // Filter for My Listings
  const myListings = useMemo(() => {
    if (!address) return [];
    return pets.filter((p) => p.owner.toLowerCase() === address.toLowerCase());
  }, [pets, address]);

  // Filter for Browse
  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      // Animal category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "Other") {
          const standard = ["dog", "cat", "bird", "rabbit"];
          if (standard.some((s) => pet.animalType.toLowerCase().includes(s))) {
            return false;
          }
        } else if (!pet.animalType.toLowerCase().includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== "all") {
        if (selectedStatus === "available" && pet.status !== PetStatus.Available) return false;
        if (selectedStatus === "pending" && pet.status !== PetStatus.Pending) return false;
        if (selectedStatus === "adopted" && pet.status !== PetStatus.Adopted) return false;
      }

      // Search query (name or location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = pet.name.toLowerCase().includes(q);
        const matchesLocation = pet.location.toLowerCase().includes(q);
        const matchesType = pet.animalType.toLowerCase().includes(q);
        if (!matchesName && !matchesLocation && !matchesType) return false;
      }

      return true;
    });
  }, [pets, selectedCategory, selectedStatus, searchQuery]);

  // Handlers for modal interactions
  const handleOpenExpressModal = (pet: PetData) => {
    setSelectedPet(pet);
    setIsExpressModalOpen(true);
  };

  const handleOpenDetailsModal = (pet: PetData) => {
    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  const handleTxSuccess = (txHash: string, actionName: string = "Transaction executed") => {
    addToast(
      "success",
      `${actionName} successfully!`,
      "Your transaction has been recorded on Botchain Testnet.",
      txHash
    );
    refetchPets();
    refetchStats();
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 text-forest-950 font-sans selection:bg-terracotta-200">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        myListingsCount={myListings.length}
        myRequestsCount={0}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          totalListed={totalListed}
          totalAdopted={totalAdopted}
          totalAvailable={totalAvailable}
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onBrowseClick={() => {
            setActiveTab("browse");
            document.getElementById("pets-section")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Contract Address Alert / Network Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
          <div className="p-3.5 rounded-2xl bg-cream-100 border border-warmBrown-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-bold text-forest-900">Botchain Mainnet (Chain ID 677)</span>
              <span className="text-warmBrown-500">•</span>
              <span className="text-warmBrown-700 hidden sm:inline">Contract:</span>
              <a
                href={`https://scan.botchain.ai/address/${PAWSHELTER_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-terracotta-600 hover:underline flex items-center gap-1 font-semibold"
              >
                {PAWSHELTER_CONTRACT_ADDRESS.slice(0, 10)}...{PAWSHELTER_CONTRACT_ADDRESS.slice(-8)}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={() => {
                refetchPets();
                refetchStats();
                addToast("info", "Syncing with Botchain", "Latest blockchain records refreshed.");
              }}
              disabled={isRefetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-forest-800 font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
              <span>{isRefetching ? "Syncing..." : "Refresh On-Chain"}</span>
            </button>
          </div>
        </div>

        {/* Section Container */}
        <section id="pets-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* TAB 1: BROWSE ALL PETS */}
          {activeTab === "browse" && (
            <div>
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-2 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-forest-700 text-cream-50 shadow-sm"
                          : "bg-cream-100 hover:bg-cream-200 text-forest-900 border border-warmBrown-200/70"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search & Status Filter Controls */}
              <div className="mt-4 p-4 rounded-3xl bg-cream-100 border border-warmBrown-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmBrown-500" />
                  <input
                    type="text"
                    placeholder="Search by pet name, city, breed..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cream-50 border border-warmBrown-200 text-forest-950 placeholder-warmBrown-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warmBrown-500 hover:text-warmBrown-800"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  <Filter className="w-4 h-4 text-warmBrown-600 hidden sm:block" />
                  <span className="text-xs font-bold text-warmBrown-700 hidden sm:block">Status:</span>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-3.5 py-2.5 rounded-2xl bg-cream-50 border border-warmBrown-200 text-forest-950 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available Only</option>
                    <option value="pending">Adoption Pending</option>
                    <option value="adopted">Adopted Pets</option>
                  </select>
                </div>
              </div>

              {/* Pets Grid */}
              <div className="mt-8">
                {isPetsLoading ? (
                  <div className="py-20 text-center">
                    <div className="inline-block w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-sm font-semibold text-warmBrown-700">
                      Querying Botchain for pet listings...
                    </p>
                  </div>
                ) : filteredPets.length === 0 ? (
                  <div className="py-16 px-4 text-center rounded-3xl bg-cream-100 border border-dashed border-warmBrown-300 max-w-xl mx-auto">
                    <span className="text-5xl select-none" role="img" aria-label="Puppy">🐶</span>
                    <h3 className="mt-4 text-lg font-extrabold text-forest-950">
                      No pets match your criteria
                    </h3>
                    <p className="mt-1.5 text-xs text-warmBrown-600 max-w-sm mx-auto">
                      {searchQuery || selectedCategory !== "all" || selectedStatus !== "all"
                        ? "Try adjusting your search terms or filter selections."
                        : "Be the first to give an animal a loving home by listing a pet!"}
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-card transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>List a Pet for Adoption</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredPets.map((pet) => (
                      <PetCard
                        key={pet.id.toString()}
                        pet={pet}
                        currentUserAddress={address}
                        onExpressInterest={handleOpenExpressModal}
                        onViewDetails={handleOpenDetailsModal}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MY LISTINGS */}
          {activeTab === "my-listings" && (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-warmBrown-200">
                <div>
                  <h2 className="text-2xl font-black text-forest-950">My Pet Listings</h2>
                  <p className="text-xs text-warmBrown-600 mt-1">
                    Manage adoption requests, review applicant stories, and finalize adoptions.
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-card transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>List Another Pet</span>
                </button>
              </div>

              {!isConnected ? (
                <div className="mt-12 py-16 text-center max-w-md mx-auto bg-cream-100 rounded-3xl border border-warmBrown-200 p-8">
                  <ShieldAlert className="w-10 h-10 text-warmBrown-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-forest-950">Connect Your Wallet</h3>
                  <p className="text-xs text-warmBrown-600 mt-1">
                    Please connect MetaMask to see and manage pets you have listed for adoption.
                  </p>
                </div>
              ) : myListings.length === 0 ? (
                <div className="mt-12 py-16 text-center max-w-md mx-auto bg-cream-100 rounded-3xl border border-dashed border-warmBrown-300 p-8">
                  <span className="text-5xl" role="img" aria-label="House">🏡</span>
                  <h3 className="mt-4 text-lg font-bold text-forest-950">No Listings Yet</h3>
                  <p className="text-xs text-warmBrown-600 mt-1">
                    You haven't listed any pets for adoption from this wallet address yet.
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 text-cream-50 font-bold text-xs shadow-sm hover:bg-forest-600 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Your First Listing</span>
                  </button>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {myListings.map((pet) => (
                    <PetCard
                      key={pet.id.toString()}
                      pet={pet}
                      currentUserAddress={address}
                      onExpressInterest={handleOpenExpressModal}
                      onViewDetails={handleOpenDetailsModal}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY ADOPTION REQUESTS */}
          {activeTab === "my-requests" && (
            <div>
              <div className="pb-6 border-b border-warmBrown-200">
                <h2 className="text-2xl font-black text-forest-950">My Adoption Requests</h2>
                <p className="text-xs text-warmBrown-600 mt-1">
                  Track pets you have applied to adopt and check approval milestones.
                </p>
              </div>

              {!isConnected ? (
                <div className="mt-12 py-16 text-center max-w-md mx-auto bg-cream-100 rounded-3xl border border-warmBrown-200 p-8">
                  <ShieldAlert className="w-10 h-10 text-warmBrown-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-forest-950">Connect Your Wallet</h3>
                  <p className="text-xs text-warmBrown-600 mt-1">
                    Connect your wallet to review your submitted adoption applications.
                  </p>
                </div>
              ) : (
                <div className="mt-8">
                  <div className="p-6 rounded-3xl bg-cream-100 border border-warmBrown-200/80 max-w-2xl mx-auto text-center">
                    <Heart className="w-8 h-8 text-terracotta-500 fill-current mx-auto mb-2" />
                    <h3 className="text-base font-bold text-forest-950">
                      Transparent On-Chain Applications
                    </h3>
                    <p className="text-xs text-warmBrown-700 mt-1 leading-relaxed">
                      Whenever you express interest in a pet, your interest record is minted directly
                      into the smart contract. Pet owners can inspect your contact notes and approve you
                      for adoption.
                    </p>
                    <button
                      onClick={() => setActiveTab("browse")}
                      className="mt-4 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-600 text-cream-50 font-bold text-xs shadow-sm transition-all"
                    >
                      Browse Pets to Adopt
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Ecosystem / Network Info Card */}
          <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-forest-800 via-forest-700 to-forest-900 text-cream-50 shadow-card border border-forest-600/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-600/60 border border-forest-500/40 text-xs font-bold text-cream-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>BOT Chain Ecosystem</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-cream-50 tracking-tight">
                  Powered by BOT Chain Mainnet
                </h3>
                <p className="text-xs sm:text-sm text-forest-100/90 max-w-xl leading-relaxed">
                  PawShelter is built on BOT Chain (Chain ID: 677). Every pet listing, adoption interest record, and verified handover is immutably stored on the BOT Chain ledger.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-cream-50 text-forest-900 hover:bg-cream-100 font-bold text-xs shadow-sm transition-all"
                >
                  <span>BOT Chain Website</span>
                  <ExternalLink className="w-3.5 h-3.5 text-forest-700" />
                </a>
                <a
                  href="https://scan.botchain.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-forest-600/70 hover:bg-forest-600 text-cream-50 border border-forest-500/50 font-bold text-xs shadow-sm transition-all"
                >
                  <span>BOT Chain Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cream-200" />
                </a>
                <a
                  href={`https://scan.botchain.ai/address/${PAWSHELTER_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs shadow-sm transition-all"
                >
                  <span>Verified Contract</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-warmBrown-200/80 bg-cream-100/95 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-warmBrown-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-forest-700 text-cream-50 flex items-center justify-center font-bold shadow-sm">
              🐾
            </div>
            <div>
              <div className="font-extrabold text-sm text-forest-950">PawShelter</div>
              <p className="text-[11px] text-warmBrown-600 italic">Every Paw Deserves a Home.</p>
            </div>
          </div>

          {/* BOT Chain official links */}
          <div className="flex flex-wrap items-center justify-center gap-6 font-semibold">
            <a
              href="https://botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-950 hover:underline transition-colors flex items-center gap-1.5"
            >
              <span>BOT Chain Website</span>
              <ExternalLink className="w-3 h-3 text-terracotta-500" />
            </a>
            <span>•</span>
            <a
              href="https://scan.botchain.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-forest-950 hover:underline transition-colors flex items-center gap-1.5"
            >
              <span>BOT Chain Explorer</span>
              <ExternalLink className="w-3 h-3 text-terracotta-500" />
            </a>
            <span>•</span>
            <a
              href={`https://scan.botchain.ai/address/${PAWSHELTER_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-terracotta-600 hover:underline flex items-center gap-1"
            >
              <span>Contract: {PAWSHELTER_CONTRACT_ADDRESS.slice(0, 6)}...{PAWSHELTER_CONTRACT_ADDRESS.slice(-4)}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-warmBrown-500">Chain ID: 677 (BOT)</span>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      <AddPetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(txHash) => handleTxSuccess(txHash, "Pet listed")}
      />

      <ExpressInterestModal
        pet={selectedPet}
        isOpen={isExpressModalOpen}
        onClose={() => {
          setIsExpressModalOpen(false);
          setSelectedPet(null);
        }}
        onSuccess={(txHash) => handleTxSuccess(txHash, "Adoption interest submitted")}
      />

      <PetDetailsModal
        pet={selectedPet}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPet(null);
        }}
        onOpenExpressModal={handleOpenExpressModal}
        onSuccess={(txHash, action) => handleTxSuccess(txHash, action)}
      />
    </div>
  );
}

