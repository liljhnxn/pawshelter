"use client";

import React, { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  PAWSHELTER_CONTRACT_ADDRESS,
  PAWSHELTER_ABI,
  PetData,
  PetStatus,
  AdoptionInterestData,
} from "@/lib/contract";
import {
  X,
  Heart,
  MapPin,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  AlertTriangle,
  Loader2,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface PetDetailsModalProps {
  pet: PetData | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenExpressModal: (pet: PetData) => void;
  onSuccess: (txHash: string, actionType: string) => void;
}

export function PetDetailsModal({
  pet,
  isOpen,
  onClose,
  onOpenExpressModal,
  onSuccess,
}: PetDetailsModalProps) {
  const { address, isConnected } = useAccount();

  // Read applications if user is owner or viewing details
  const { data: applicantsData, refetch: refetchApplicants } = useReadContract({
    address: PAWSHELTER_CONTRACT_ADDRESS,
    abi: PAWSHELTER_ABI,
    functionName: "getAllAdoptionInterests",
    args: pet ? [pet.id] : undefined,
    query: {
      enabled: isOpen && !!pet,
    },
  });

  const { data: hasInterestData, refetch: refetchHasInterest } = useReadContract({
    address: PAWSHELTER_CONTRACT_ADDRESS,
    abi: PAWSHELTER_ABI,
    functionName: "hasExpressedInterest",
    args: pet && address ? [pet.id, address] : undefined,
    query: {
      enabled: isOpen && !!pet && !!address,
    },
  });

  const [currentAction, setCurrentAction] = useState<string>("");

  const {
    data: hash,
    isPending: isWritePending,
    error: writeError,
    writeContract,
    reset: resetWrite,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  useEffect(() => {
    if (isConfirmed && hash) {
      refetchApplicants();
      refetchHasInterest();
      onSuccess(hash, currentAction);
      resetWrite();
    }
  }, [isConfirmed, hash]);

  if (!isOpen || !pet) return null;

  const isOwner =
    address && pet.owner.toLowerCase() === address.toLowerCase();

  const isApprovedAdopter =
    address && pet.approvedAdopter.toLowerCase() === address.toLowerCase();

  const hasExpressedInterest = Boolean(hasInterestData);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatDate = (ts: bigint) => {
    if (!ts || Number(ts) === 0) return "Recently";
    return new Date(Number(ts) * 1000).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = (adopterAddress: `0x${string}`) => {
    setCurrentAction("Approved adopter");
    writeContract({
      address: PAWSHELTER_CONTRACT_ADDRESS,
      abi: PAWSHELTER_ABI,
      functionName: "approveAdopter",
      args: [pet.id, adopterAddress],
    });
  };

  const handleMarkAdopted = () => {
    setCurrentAction("Finalized adoption");
    writeContract({
      address: PAWSHELTER_CONTRACT_ADDRESS,
      abi: PAWSHELTER_ABI,
      functionName: "markAsAdopted",
      args: [pet.id],
    });
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to withdraw this listing from adoption?")) {
      setCurrentAction("Cancelled listing");
      writeContract({
        address: PAWSHELTER_CONTRACT_ADDRESS,
        abi: PAWSHELTER_ABI,
        functionName: "cancelListing",
        args: [pet.id],
      });
    }
  };

  const applicants = (applicantsData || []) as AdoptionInterestData[];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-cream-50 rounded-3xl border border-warmBrown-200/80 shadow-modal max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-warmBrown-100">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-forest-950">{pet.name}</h2>
            <span className="text-sm px-2.5 py-0.5 rounded-lg bg-warmBrown-100 text-warmBrown-800 font-bold">
              {pet.animalType}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-warmBrown-400 hover:text-warmBrown-800 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Write Error Notice */}
        {writeError && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span className="break-all">{writeError.message}</span>
          </div>
        )}

        {/* Transaction in progress banner */}
        {(isWritePending || isConfirming) && (
          <div className="mt-4 p-3.5 rounded-2xl bg-forest-50 border border-forest-200 text-forest-900 text-xs flex items-center gap-2.5 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-forest-700" />
            <span>
              {isWritePending
                ? "Please sign the transaction in your wallet..."
                : "Transaction confirming on Botchain..."}
            </span>
          </div>
        )}

        {/* Main Details */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Photo */}
          <div className="h-64 rounded-2xl bg-cream-200 overflow-hidden flex items-center justify-center border border-warmBrown-100">
            {pet.imageUri && pet.imageUri.startsWith("http") ? (
              <img
                src={pet.imageUri}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <span className="text-7xl select-none" role="img" aria-label="Pet">🐾</span>
                <p className="text-xs font-semibold text-warmBrown-600 mt-2">
                  No image provided
                </p>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-warmBrown-700">
                <MapPin className="w-4 h-4 text-terracotta-500" />
                <span className="font-semibold">{pet.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warmBrown-700">
                <Calendar className="w-4 h-4 text-warmBrown-500" />
                <span>Age: {Number(pet.age)} {Number(pet.age) === 1 ? "year" : "years"} old</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warmBrown-700">
                <Clock className="w-4 h-4 text-warmBrown-500" />
                <span>Listed on {formatDate(pet.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-warmBrown-700">
                <User className="w-4 h-4 text-warmBrown-500" />
                <span>Owner: </span>
                <a
                  href={`https://scan.botchain.ai/address/${pet.owner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-terracotta-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  {formatAddress(pet.owner)}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Status box */}
            <div className="p-3.5 rounded-2xl bg-cream-100 border border-warmBrown-100">
              <div className="text-xs font-semibold text-warmBrown-600">Current Status</div>
              <div className="text-sm font-extrabold text-forest-950 mt-0.5 flex items-center gap-1.5">
                {pet.status === PetStatus.Available && "Available for Adoption"}
                {pet.status === PetStatus.Pending && "Pending Adoption Finalization"}
                {pet.status === PetStatus.Adopted && "Adopted to Forever Home 🏡"}
                {pet.status === PetStatus.Cancelled && "Listing Cancelled"}
              </div>
              {pet.approvedAdopter !== "0x0000000000000000000000000000000000000000" && (
                <div className="text-xs text-forest-700 font-medium mt-1">
                  Approved Adopter: {formatAddress(pet.approvedAdopter)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-1.5">
            Story & Temperament
          </h4>
          <p className="text-sm text-warmBrown-800 leading-relaxed bg-cream-100/60 p-4 rounded-2xl border border-warmBrown-100/80">
            {pet.description || "The owner has not provided additional story notes for this pet."}
          </p>
        </div>

        {/* Owner Management Section: Review Applicants */}
        {isOwner && (
          <div className="mt-6 pt-6 border-t border-warmBrown-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-extrabold text-forest-950 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-terracotta-500 fill-current" />
                <span>Adoption Applications ({applicants.length})</span>
              </h4>
              {pet.status === PetStatus.Pending && (
                <button
                  onClick={handleMarkAdopted}
                  disabled={isWritePending || isConfirming}
                  className="px-3.5 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Mark as Adopted</span>
                </button>
              )}
            </div>

            {applicants.length === 0 ? (
              <p className="text-xs text-warmBrown-600 italic bg-cream-100 p-4 rounded-2xl text-center">
                No applications submitted yet. Interested adopters will appear here.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {applicants.map((app) => {
                  const isThisApproved =
                    pet.approvedAdopter.toLowerCase() === app.adopter.toLowerCase();

                  return (
                    <div
                      key={app.adopter}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isThisApproved
                          ? "bg-forest-50/80 border-forest-300"
                          : "bg-cream-100 border-warmBrown-200/80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-forest-900">
                              {formatAddress(app.adopter)}
                            </span>
                            {isThisApproved && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-200 text-forest-800">
                                <CheckCircle className="w-3 h-3" />
                                Approved Adopter
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-warmBrown-700 mt-1">
                            <span className="font-semibold">Contact:</span> {app.contactInfo}
                          </p>
                          <p className="text-xs text-warmBrown-800 mt-1 italic">
                            "{app.message}"
                          </p>
                          <span className="text-[10px] text-warmBrown-500 mt-1 block">
                            Submitted {formatDate(app.timestamp)}
                          </span>
                        </div>

                        {/* Owner action for this applicant */}
                        {pet.status === PetStatus.Available && !isThisApproved && (
                          <button
                            onClick={() => handleApprove(app.adopter)}
                            disabled={isWritePending || isConfirming}
                            className="px-3 py-1.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-cream-50 text-xs font-bold shadow-sm transition-all"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cancel Listing Button for Owner */}
            {pet.status !== PetStatus.Adopted && pet.status !== PetStatus.Cancelled && (
              <div className="mt-4 pt-4 border-t border-warmBrown-100 flex justify-end">
                <button
                  onClick={handleCancel}
                  disabled={isWritePending || isConfirming}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-900 font-semibold p-2 rounded-xl hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Withdraw / Cancel Listing</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Approved Adopter Banner & Action */}
        {isApprovedAdopter && pet.status === PetStatus.Pending && (
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <h5 className="font-bold text-sm text-emerald-950">
                  Congratulations! You've been approved!
                </h5>
                <p className="text-xs text-emerald-800">
                  You can now finalize and confirm adoption on-chain.
                </p>
              </div>
            </div>
            <button
              onClick={handleMarkAdopted}
              disabled={isWritePending || isConfirming}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              Complete Adoption 🎉
            </button>
          </div>
        )}

        {/* Guest / Non-Owner Action */}
        {!isOwner && !isApprovedAdopter && (
          <div className="mt-6 pt-4 border-t border-warmBrown-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-warmBrown-700 font-semibold text-xs hover:bg-cream-200 transition-colors"
            >
              Close
            </button>

            {pet.status === PetStatus.Available && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenExpressModal(pet);
                }}
                disabled={hasExpressedInterest}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-card ${
                  hasExpressedInterest
                    ? "bg-forest-100 text-forest-800 cursor-default"
                    : "bg-terracotta-500 hover:bg-terracotta-600 text-white active:scale-95"
                }`}
              >
                <Heart className={`w-4 h-4 ${hasExpressedInterest ? "fill-forest-600 text-forest-600" : ""}`} />
                <span>
                  {hasExpressedInterest ? "Application Submitted" : "Express Adoption Interest"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

