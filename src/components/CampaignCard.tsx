"use client";

import Link from "next/link";
import { Campaign } from "@/hooks/useCampaigns";
import {
  formatEther,
  calculateProgress,
  formatDeadline,
  getCampaignStatus,
  getCampaignStatusColor,
  shortenAddress,
} from "@/lib/utils";
import ProgressBar from "./ProgressBar";

interface CampaignCardProps {
  campaign: Campaign;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const progress = calculateProgress(campaign.totalRaised, campaign.fundingGoal);
  const status = getCampaignStatus(
    campaign.status,
    Number(campaign.deadline),
    campaign.totalRaised,
    campaign.fundingGoal
  );
  const statusColor = getCampaignStatusColor(status);

  return (
    <Link href={`/campaign/${campaign.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer border border-gray-200">
        {/* Image placeholder */}
        <div className="h-48 bg-gradient-to-br from-primary-400 to-primary-600 relative">
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
              {status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold line-clamp-2">{campaign.title}</h3>
          </div>
        </div>

        {/* Card content */}
        <div className="p-5">
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {campaign.description}
          </p>

          <div className="mb-4">
            <ProgressBar progress={progress} />
          </div>

          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatEther(campaign.totalRaised)} ETH
              </p>
              <p className="text-sm text-gray-500">
                of {formatEther(campaign.fundingGoal)} ETH goal
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">
                {progress.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500">funded</p>
            </div>
          </div>

          <div className="border-t pt-3 flex justify-between items-center text-sm">
            <div className="text-gray-600">
              <span className="font-medium">Creator:</span>{" "}
              <span className="text-primary-600">{shortenAddress(campaign.creator)}</span>
            </div>
            <div className="text-gray-600">
              {status === "Active" ? (
                <span className="font-medium">{formatDeadline(Number(campaign.deadline))}</span>
              ) : (
                <span className="font-medium">{status}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
