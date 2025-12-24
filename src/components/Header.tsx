"use client";

import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/lib/utils";
import { Menu, X, Wallet } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const getConnectorIcon = (connectorName: string) => {
    if (connectorName.toLowerCase().includes("metamask") || connectorName.toLowerCase().includes("injected")) {
      return "🦊";
    }
    if (connectorName.toLowerCase().includes("walletconnect")) {
      return "🔗";
    }
    if (connectorName.toLowerCase().includes("coinbase")) {
      return "🔵";
    }
    return "💼";
  };

  const getConnectorName = (connector: any) => {
    if (connector.name.toLowerCase().includes("injected")) {
      return "MetaMask / Browser Wallet";
    }
    return connector.name;
  };

  const handleConnect = (connector: any) => {
    connect({ connector });
    setWalletModalOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Base Crowdfund</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/explore"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              Create Campaign
            </Link>
            {isConnected && (
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:block px-4 py-2 bg-gray-100 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">
                    {shortenAddress(address!)}
                  </span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setWalletModalOpen(true)}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors flex items-center gap-2"
              >
                <Wallet size={18} />
                Connect Wallet
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link
              href="/explore"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/create"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Campaign
            </Link>
            {isConnected && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Wallet Selection Modal */}
      {walletModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setWalletModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-2">Connect Wallet</h2>
            <p className="text-gray-600 mb-6">
              Choose your preferred wallet to connect to Base Crowdfunding
            </p>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => handleConnect(connector)}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all"
                >
                  <span className="text-3xl">{getConnectorIcon(connector.name)}</span>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-gray-900">
                      {getConnectorName(connector)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {connector.name.toLowerCase().includes("walletconnect")
                        ? "Scan with WalletConnect"
                        : connector.name.toLowerCase().includes("coinbase")
                        ? "Connect with Coinbase"
                        : "Connect with browser extension"}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              Make sure you are connected to Base network (Chain ID: 8453)
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
