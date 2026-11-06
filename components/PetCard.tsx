"use client";

import React, { useState } from "react";
import { PetData, PetStatus } from "@/lib/contract";
import { MapPin, Calendar, Heart, Eye, User, Sparkles } from "lucide-react";

interface PetCardProps {
  pet: PetData;
  currentUserAddress?: string;
  hasExpressedInterest?: boolean;
  onExpressInterest: (pet: PetData) => void;
  onViewDetails: (pet: PetData) => void;
}

export function PetCard({
  pet,
  currentUserAddress,
  hasExpressedInterest = false,
  onExpressInterest,
  onViewDetails,
}: PetCardProps) {
  const [imgError, setImgError] = useState(false);

  const isOwner =
    currentUserAddress &&
    pet.owner.toLowerCase() === currentUserAddress.toLowerCase();

  const isApprovedAdopter =
    currentUserAddress &&
    pet.approvedAdopter.toLowerCase() === currentUserAddress.toLowerCase();

  const formatAge = (age: bigint) => {
    const n = Number(age);
    if (n === 1) return "1 year old";
    return `${n} years old`;
  };

  const getAnimalEmoji = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("dog")) return "🐕";
    if (t.includes("cat")) return "🐈";
    if (t.includes("bird")) return "🦜";
    if (t.includes("rabbit") || t.includes("bunny")) return "🐇";
    return "🐾";
  };

  const getStatusBadge = () => {
    switch (pet.status) {
      case PetStatus.Available:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Available
          </span>
        );
      case PetStatus.Pending:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Adoption Pending
          </span>
        );
      case PetStatus.Adopted:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest-100 text-forest-800 border border-forest-200">
            <Sparkles className="w-3 h-3 text-terracotta-500" />
            Adopted
          </span>
        );
      case PetStatus.Cancelled:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Withdrawn
          </span>
        );
      default:
        return null;
    }
  };

  // Safe image or fallback SVG
  const hasValidImage = pet.imageUri && pet.imageUri.startsWith("http") && !imgError;

  return (
    <div className="group bg-cream-50 rounded-3xl border border-warmBrown-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Container */}
      <div className="relative h-56 w-full bg-cream-200 overflow-hidden flex items-center justify-center">
        {hasValidImage ? (
          <img
            src={pet.imageUri}
            alt={pet.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream-100 via-cream-200 to-warmBrown-100 p-6 text-center">
            <span className="text-6xl mb-2 select-none" role="img" aria-label={pet.animalType}>
              {getAnimalEmoji(pet.animalType)}
            </span>
            <span className="text-xs font-bold text-warmBrown-600 uppercase tracking-wider">
              {pet.animalType}
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">{getStatusBadge()}</div>

        {/* Owner Pill if current user */}
        {isOwner && (
          <div className="absolute top-3 right-3 bg-forest-800/90 backdrop-blur-sm text-cream-50 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Your Listing</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Type */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-xl text-forest-950 group-hover:text-forest-700 transition-colors">
                {pet.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-lg bg-warmBrown-100 text-warmBrown-800">
                  {getAnimalEmoji(pet.animalType)} {pet.animalType}
                </span>
                <span className="text-xs text-warmBrown-600 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {formatAge(pet.age)}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-warmBrown-700 mt-3 font-medium">
            <MapPin className="w-3.5 h-3.5 text-terracotta-500 flex-shrink-0" />
            <span className="truncate">{pet.location}</span>
          </div>

          {/* Description snippet */}
          <p className="mt-3 text-xs text-warmBrown-800 line-clamp-2 leading-relaxed">
            {pet.description || "Looking for a warm home with loving caregivers."}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-warmBrown-100/80 flex items-center gap-2">
          <button
            onClick={() => onViewDetails(pet)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200/90 text-forest-900 font-semibold text-xs border border-warmBrown-200/80 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-warmBrown-600" />
            <span>Details</span>
          </button>

          {pet.status === PetStatus.Available && !isOwner && (
            <button
              onClick={() => onExpressInterest(pet)}
              disabled={hasExpressedInterest}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                hasExpressedInterest
                  ? "bg-forest-100 text-forest-800 cursor-default"
                  : "bg-terracotta-500 hover:bg-terracotta-600 text-white active:scale-95 shadow-terracotta-500/20"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasExpressedInterest ? "fill-forest-600 text-forest-600" : ""}`} />
              <span>{hasExpressedInterest ? "Interested" : "Adopt Me"}</span>
            </button>
          )}

          {isApprovedAdopter && pet.status === PetStatus.Pending && (
            <button
              onClick={() => onViewDetails(pet)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
            >
              <span>Finalize 🎉</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

