"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { PAWSHELTER_CONTRACT_ADDRESS, PAWSHELTER_ABI } from "@/lib/contract";
import { X, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
}

const PRESET_AVATARS = [
  { label: "Golden Retriever", url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80" },
  { label: "Ginger Cat", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80" },
  { label: "Beagle Pup", url: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80" },
  { label: "Bunny", url: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=800&q=80" },
  { label: "Canary Bird", url: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=800&q=80" },
  { label: "Husky", url: "https://images.unsplash.com/photo-1547407139-3c921a66005c?auto=format&fit=crop&w=800&q=80" },
];

export function AddPetModal({ isOpen, onClose, onSuccess }: AddPetModalProps) {
  const { isConnected } = useAccount();

  const [name, setName] = useState("");
  const [animalType, setAnimalType] = useState("Dog");
  const [age, setAge] = useState("2");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState("");
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

  if (!isOpen) return null;

  const handleClose = () => {
    setName("");
    setAnimalType("Dog");
    setAge("2");
    setLocation("");
    setDescription("");
    setImageUri("");
    setFormError("");
    resetWrite();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!isConnected) {
      setFormError("Please connect your MetaMask wallet first.");
      return;
    }
    if (!name.trim()) {
      setFormError("Pet name is required.");
      return;
    }
    if (!animalType.trim()) {
      setFormError("Animal type is required.");
      return;
    }
    if (!location.trim()) {
      setFormError("Location is required.");
      return;
    }

    const parsedAge = parseInt(age, 10);
    if (isNaN(parsedAge) || parsedAge < 0) {
      setFormError("Please enter a valid age.");
      return;
    }

    writeContract({
      address: PAWSHELTER_CONTRACT_ADDRESS,
      abi: PAWSHELTER_ABI,
      functionName: "listPet",
      args: [
        name.trim(),
        animalType.trim(),
        BigInt(parsedAge),
        description.trim(),
        location.trim(),
        imageUri.trim(),
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-cream-50 rounded-3xl border border-warmBrown-200/80 shadow-modal max-w-xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-warmBrown-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-bold text-lg">
              🐾
            </div>
            <div>
              <h2 className="text-xl font-black text-forest-950">
                List a Pet for Adoption
              </h2>
              <p className="text-xs text-warmBrown-600">
                Save an animal to the Botchain ledger
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Pet Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Barnaby"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Animal Type *
              </label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              >
                <option value="Dog">Dog 🐕</option>
                <option value="Cat">Cat 🐈</option>
                <option value="Bird">Bird 🦜</option>
                <option value="Rabbit">Rabbit 🐇</option>
                <option value="Other">Other 🐾</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Age (years) *
              </label>
              <input
                type="number"
                min="0"
                max="30"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Location (City, Country) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Austin, TX"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Photo URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.com/pet.jpg"
              value={imageUri}
              onChange={(e) => setImageUri(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-warmBrown-200 bg-cream-100 text-forest-900 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
            {/* Quick Presets */}
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-warmBrown-600">
                Or pick a preset avatar:
              </span>
              {PRESET_AVATARS.map((p) => (
                <button
                  type="button"
                  key={p.label}
                  onClick={() => setImageUri(p.url)}
                  className="text-[11px] px-2 py-0.5 rounded-lg bg-cream-200 hover:bg-cream-300 text-forest-800 font-medium transition-colors"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Pet Story & Details
            </label>
            <textarea
              rows={3}
              placeholder="Tell adopters about this pet's background, personality, and ideal home..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
                  <span>Publishing on Botchain...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Publish Listing</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

