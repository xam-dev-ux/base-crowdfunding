"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAccount, useBalance } from "wagmi";
import { useContribute } from "@/hooks/useContribute";
import { Campaign } from "@/hooks/useCampaigns";
import {
  formatEther,
  validateContribution,
  calculatePlatformFee,
  parseEther,
} from "@/lib/utils";
import toast from "react-hot-toast";

interface ContributeModalProps {
  campaign: Campaign;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContributeModal({
  campaign,
  isOpen,
  onClose,
}: ContributeModalProps) {
  const [amount, setAmount] = useState("");
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { contribute, isPending, isConfirming, isSuccess } = useContribute();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Contribution successful!");
      onClose();
      setAmount("");
    }
  }, [isSuccess, onClose]);

  const handleContribute = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    const validation = validateContribution(
      amount,
      campaign.minContribution,
      campaign.maxContribution,
      balance?.value || 0n
    );

    if (!validation.isValid) {
      toast.error(validation.error || "Invalid contribution");
      return;
    }

    await contribute(Number(campaign.id), amount);
  };

  if (!isOpen) return null;

  const platformFee = amount ? calculatePlatformFee(parseEther(amount)) : 0n;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Contribute to Campaign</h2>

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              Goal: <span className="font-medium">{formatEther(campaign.fundingGoal)} ETH</span>
            </p>
            <p>
              Raised: <span className="font-medium">{formatEther(campaign.totalRaised)} ETH</span>
            </p>
            {campaign.minContribution > 0n && (
              <p>
                Min: <span className="font-medium">{formatEther(campaign.minContribution)} ETH</span>
              </p>
            )}
            {campaign.maxContribution > 0n && (
              <p>
                Max: <span className="font-medium">{formatEther(campaign.maxContribution)} ETH</span>
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contribution Amount (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {balance && (
            <p className="text-sm text-gray-500 mt-1">
              Balance: {Number(balance.formatted).toFixed(4)} ETH
            </p>
          )}
        </div>

        {amount && parseFloat(amount) > 0 && (
          <div className="bg-blue-50 rounded-lg p-3 mb-4 text-sm">
            <p className="font-medium mb-1">Transaction Summary</p>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Your contribution:</span>
                <span className="font-medium">{amount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee (2.5%):</span>
                <span className="font-medium">{formatEther(platformFee)} ETH</span>
              </div>
              <div className="flex justify-between border-t pt-1 mt-1">
                <span>Creator receives:</span>
                <span className="font-medium text-green-600">
                  {formatEther(parseEther(amount) - platformFee)} ETH
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleContribute}
          disabled={!amount || parseFloat(amount) <= 0 || isPending || isConfirming}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isPending || isConfirming ? "Processing..." : "Contribute Now"}
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Your contribution will be securely processed on Base blockchain
        </p>
      </div>
    </div>
  );
}
