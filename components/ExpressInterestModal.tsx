"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAWSHELTER_CONTRACT_ADDRESS, PAWSHELTER_ABI, PetData } from "@/lib/contract";
import { X, Heart, AlertCircle, Loader2, MapPin } from "lucide-react";

interface ExpressInterestModalProps {
  pet: PetData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

export function ExpressInterestModal({
  pet,
  isOpen,
  onClose,
  onSuccess,
}: ExpressInterestModalProps) {
  const { isConnected, address } = useAccount();

  const [contactInfo, setContactInfo] = useState("");
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

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
      onSuccess(hash);
      handleClose();
    }
  }, [isConfirmed, hash]);

  if (!isOpen || !pet) return null;

  const handleClose = () => {
    setContactInfo("");
    setMessage("");
    setFormError("");
    resetWrite();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isConnected) {
      setFormError("Please connect your wallet first.");
      return;
    }

    if (address && pet.owner.toLowerCase() === address.toLowerCase()) {
      setFormError("You cannot express adoption interest in your own listing.");
      return;
    }

    if (!contactInfo.trim()) {
      setFormError("Contact information is required so the owner can reach you.");
      return;
    }

    if (!message.trim()) {
      setFormError("Please write a short introduction to the owner.");
      return;
    }

    writeContract({
      address: PAWSHELTER_CONTRACT_ADDRESS,
      abi: PAWSHELTER_ABI,
      functionName: "expressInterest",
      args: [pet.id, contactInfo.trim(), message.trim()],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-cream-50 rounded-3xl border border-warmBrown-200/80 shadow-modal max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-warmBrown-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-current text-terracotta-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-forest-950">
                Express Interest in {pet.name}
              </h2>
              <p className="text-xs text-warmBrown-600">
                Submit an on-chain adoption application
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-warmBrown-400 hover:text-warmBrown-800 hover:bg-cream-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pet preview snippet */}
        <div className="mt-4 p-3 rounded-2xl bg-cream-100 border border-warmBrown-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cream-200 overflow-hidden flex items-center justify-center flex-shrink-0 text-xl">
            {pet.imageUri && pet.imageUri.startsWith("http") ? (
              <img src={pet.imageUri} alt={pet.name} className="w-full h-full object-cover" />
            ) : (
              "🐾"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-sm text-forest-950">{pet.name}</h4>
            <div className="flex items-center gap-2 text-xs text-warmBrown-600">
              <span>{pet.animalType}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-terracotta-500" />
                {pet.location}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {formError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {writeError && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span className="break-all">{writeError.message}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Your Contact Information *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Email (sarah@example.com) or Telegram (@sarah)"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
            <p className="text-[11px] text-warmBrown-500 mt-1">
              The pet owner will use this to coordinate visits and adoption details.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Motivation Message *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe your household, prior pet experience, and why you'd love to adopt this pet..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="pt-4 border-t border-warmBrown-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl text-warmBrown-700 font-semibold text-xs hover:bg-cream-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isWritePending || isConfirming}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 disabled:opacity-50 text-white font-bold text-sm shadow-card transition-all active:scale-95"
            >
              {isWritePending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in MetaMask...</span>
                </>
              ) : isConfirming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting on Botchain...</span>
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

