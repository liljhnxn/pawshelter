"use client";

import React from "react";
import { Sparkles, ShieldCheck, HeartHandshake, Home, Plus, Search } from "lucide-react";

interface HeroProps {
  totalListed: number;
  totalAdopted: number;
  totalAvailable: number;
  onOpenAddModal: () => void;
  onBrowseClick: () => void;
}

export function Hero({
  totalListed,
  totalAdopted,
  totalAvailable,
  onOpenAddModal,
  onBrowseClick,
}: HeroProps) {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-cream-100/70 via-cream-50 to-transparent">
      {/* Decorative background blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-12 -left-12 w-72 h-72 rounded-full bg-terracotta-200/40 blur-3xl" />
        <div className="absolute top-20 right-10 w-80 h-80 rounded-full bg-forest-200/30 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/80 border border-forest-200/80 text-forest-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Decentralized Pet Adoption on BOT Chain</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-forest-950 tracking-tight leading-[1.15]">
            Find a Friend. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forest-700 via-forest-600 to-terracotta-500">
              Give Them a Home.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-warmBrown-700 max-w-2xl mx-auto leading-relaxed font-normal">
            Every paw deserves love and safety. Connect directly with pet owners and rescuers
            on-chain — transparent, trustless, and zero middlemen.
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onBrowseClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-cream-50 font-bold text-sm sm:text-base shadow-card transition-all duration-200 active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Browse Available Pets</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cream-100 hover:bg-cream-200/90 text-forest-900 border border-warmBrown-200 font-bold text-sm sm:text-base transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 text-terracotta-500 stroke-[2.5]" />
              <span>List a Pet for Adoption</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-warmBrown-600 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-forest-600" />
              <span>100% On-Chain Records</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-terracotta-500" />
              <span>Verified Adoptions</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-warmBrown-500" />
              <span>Zero Intermediaries</span>
            </div>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {/* Total Listed */}
          <div className="bg-cream-100/90 border border-warmBrown-200/80 rounded-3xl p-6 text-center shadow-soft hover:shadow-card transition-shadow">
            <div className="inline-flex p-3 rounded-2xl bg-cream-200 text-forest-800 mb-3">
              <span className="text-2xl" role="img" aria-label="Pet listings">📋</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-900">
              {totalListed}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-warmBrown-700 mt-1">
              Total Pets Listed
            </div>
            <p className="text-[11px] text-warmBrown-500 mt-1">
              Registered on Botchain
            </p>
          </div>

          {/* Available for Adoption */}
          <div className="bg-forest-700 text-cream-50 rounded-3xl p-6 text-center shadow-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-forest-600/40 rounded-full blur-2xl pointer-events-none" />
            <div className="inline-flex p-3 rounded-2xl bg-forest-600 text-cream-50 mb-3">
              <span className="text-2xl" role="img" aria-label="Available pets">🐶</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-cream-50">
              {totalAvailable}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-forest-100 mt-1">
              Looking for Homes
            </div>
            <p className="text-[11px] text-forest-200/80 mt-1">
              Ready for immediate adoption
            </p>
          </div>

          {/* Pets Adopted */}
          <div className="bg-cream-100/90 border border-warmBrown-200/80 rounded-3xl p-6 text-center shadow-soft hover:shadow-card transition-shadow">
            <div className="inline-flex p-3 rounded-2xl bg-terracotta-100 text-terracotta-700 mb-3">
              <span className="text-2xl" role="img" aria-label="Adopted pets">🏡</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-forest-900">
              {totalAdopted}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-warmBrown-700 mt-1">
              Happy Forever Homes
            </div>
            <p className="text-[11px] text-warmBrown-500 mt-1">
              Successful adoptions finalized
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

