"use client";

import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, useBalance } from "wagmi";
import { botchainMainnet } from "@/lib/contract";
import { Heart, Plus, Wallet, LogOut, ChevronDown, Check, AlertTriangle, ExternalLink } from "lucide-react";

interface NavbarProps {
  onOpenAddModal: () => void;
  activeTab: "browse" | "my-listings" | "my-requests";
  setActiveTab: (tab: "browse" | "my-listings" | "my-requests") => void;
  myListingsCount: number;
  myRequestsCount: number;
}

export function Navbar({
  onOpenAddModal,
  activeTab,
  setActiveTab,
  myListingsCount,
  myRequestsCount,
}: NavbarProps) {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [walletMenuOpen, setWalletMenuOpen] = useState(false);

  const { data: balanceData } = useBalance({
    address,
    chainId: botchainMainnet.id,
  });

  const isWrongNetwork = isConnected && chainId !== botchainMainnet.id;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = () => {
    // Prefer MetaMask / injected
    const metaMaskConnector = connectors.find((c) => c.id === "metaMask") || connectors[0];
    if (metaMaskConnector) {
      connect({ connector: metaMaskConnector });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-warmBrown-100/60 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("browse")}
              className="flex items-center gap-3 group text-left"
            >
              <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-50 shadow-md group-hover:bg-forest-600 transition-all duration-300 transform group-hover:scale-105">
                <span className="text-2xl" role="img" aria-label="Paw">🐾</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl text-forest-900 tracking-tight">
                    Paw<span className="text-terracotta-500">Shelter</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-forest-100 text-forest-800 border border-forest-200">
                    <img src="/botchain-logo.png" alt="BOT Chain" className="w-3 h-3 rounded-sm object-cover inline-block" />
                    <span>BOT Chain Mainnet (677)</span>
                  </span>
                </div>
                <p className="text-xs font-medium text-warmBrown-600 tracking-wide">
                  Every Paw Deserves a Home.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-cream-100 p-1.5 rounded-2xl border border-warmBrown-100">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "browse"
                  ? "bg-forest-700 text-cream-50 shadow-sm"
                  : "text-forest-800 hover:text-forest-950 hover:bg-cream-200/60"
              }`}
            >
              Browse Pets
            </button>
            <button
              onClick={() => setActiveTab("my-listings")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "my-listings"
                  ? "bg-forest-700 text-cream-50 shadow-sm"
                  : "text-forest-800 hover:text-forest-950 hover:bg-cream-200/60"
              }`}
            >
              <span>My Listings</span>
              {myListingsCount > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === "my-listings"
                      ? "bg-terracotta-500 text-white"
                      : "bg-forest-200 text-forest-800"
                  }`}
                >
                  {myListingsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("my-requests")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "my-requests"
                  ? "bg-forest-700 text-cream-50 shadow-sm"
                  : "text-forest-800 hover:text-forest-950 hover:bg-cream-200/60"
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current opacity-80" />
              <span>My Requests</span>
              {myRequestsCount > 0 && (
                <span
                  className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === "my-requests"
                      ? "bg-terracotta-500 text-white"
                      : "bg-forest-200 text-forest-800"
                  }`}
                >
                  {myRequestsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons: Add Pet & Connect Wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-terracotta-500 text-white font-semibold text-sm hover:bg-terracotta-600 active:scale-95 transition-all duration-200 shadow-sm shadow-terracotta-500/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Add Pet</span>
            </button>

            {/* Network or Wallet Connector */}
            {isWrongNetwork ? (
              <button
                onClick={() => switchChain({ chainId: botchainMainnet.id })}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all shadow-sm animate-pulse"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Switch to Mainnet</span>
              </button>
            ) : isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setWalletMenuOpen(!walletMenuOpen)}
                  className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-cream-100 hover:bg-cream-200/80 border border-warmBrown-200/80 text-forest-900 transition-all text-sm font-medium"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                  <span className="font-semibold text-forest-900">
                    {truncateAddress(address)}
                  </span>
                  <ChevronDown className="w-4 h-4 text-warmBrown-500" />
                </button>

                {walletMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-cream-50 border border-warmBrown-200 shadow-modal p-3 z-50 animate-in fade-in zoom-in-95">
                    <div className="p-2 border-b border-warmBrown-100 mb-2">
                      <p className="text-xs text-warmBrown-600 font-medium">Connected to Botchain Mainnet</p>
                      <p className="text-sm font-bold text-forest-900 truncate mt-0.5">
                        {address}
                      </p>
                      {balanceData && (
                        <p className="text-xs font-semibold text-forest-700 mt-1">
                          {parseFloat(balanceData.formatted).toFixed(4)} {balanceData.symbol}
                        </p>
                      )}
                    </div>
                    <a
                      href="https://botchain.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-forest-800 hover:bg-cream-100 rounded-xl transition-colors mb-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <img src="/botchain-logo.png" alt="BOT Chain" className="w-3.5 h-3.5 rounded-sm object-cover" />
                        <span>BOT Chain Website</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-warmBrown-500" />
                    </a>
                    <a
                      href={`https://scan.botchain.ai/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-forest-800 hover:bg-cream-100 rounded-xl transition-colors mb-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <img src="/botchain-logo.png" alt="BOT Chain" className="w-3.5 h-3.5 rounded-sm object-cover" />
                        <span>BOT Chain Explorer</span>
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-warmBrown-500" />
                    </a>
                    <button
                      onClick={() => {
                        setWalletMenuOpen(false);
                        disconnect();
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-forest-700 text-cream-50 font-semibold text-sm hover:bg-forest-600 active:scale-95 transition-all duration-200 shadow-sm"
              >
                <Wallet className="w-4 h-4" />
                <span>{isPending ? "Connecting..." : "Connect MetaMask"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-warmBrown-100">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              activeTab === "browse"
                ? "bg-forest-700 text-cream-50"
                : "text-forest-800"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab("my-listings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              activeTab === "my-listings"
                ? "bg-forest-700 text-cream-50"
                : "text-forest-800"
            }`}
          >
            <span>My Listings</span>
            {myListingsCount > 0 && (
              <span className="text-[10px] px-1 bg-terracotta-500 text-white rounded-full">
                {myListingsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("my-requests")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 ${
              activeTab === "my-requests"
                ? "bg-forest-700 text-cream-50"
                : "text-forest-800"
            }`}
          >
            <span>My Requests</span>
            {myRequestsCount > 0 && (
              <span className="text-[10px] px-1 bg-terracotta-500 text-white rounded-full">
                {myRequestsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

