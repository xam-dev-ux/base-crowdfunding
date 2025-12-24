"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import {
  useCampaign,
  useCampaignMilestones,
  useCampaignContributors,
  useUserContribution,
} from "@/hooks/useCampaigns";
import {
  useClaimRefund,
  useWithdrawFunds,
  useFinalizeCampaign,
} from "@/hooks/useContribute";
import ContributeModal from "@/components/ContributeModal";
import ProgressBar from "@/components/ProgressBar";
import MilestoneTimeline from "@/components/MilestoneTimeline";
import {
  formatEther,
  calculateProgress,
  formatDeadline,
  formatDate,
  getCampaignStatus,
  getCampaignStatusColor,
  shortenAddress,
  calculateDaysLeft,
} from "@/lib/utils";
import { Calendar, Target, Users, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = parseInt(params.id as string);
  const { address } = useAccount();
  const [showContributeModal, setShowContributeModal] = useState(false);

  const { data: campaign, isLoading, refetch } = useCampaign(campaignId);
  const { data: milestones } = useCampaignMilestones(campaignId);
  const { data: contributors } = useCampaignContributors(campaignId);
  const { data: userContribution } = useUserContribution(campaignId, address);

  const { claimRefund, isPending: isRefunding } = useClaimRefund();
  const { withdrawFunds, isPending: isWithdrawing } = useWithdrawFunds();
  const { finalizeCampaign, isPending: isFinalizing } = useFinalizeCampaign();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
        <p className="mt-4 text-gray-600">Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600 text-lg">Campaign not found</p>
      </div>
    );
  }

  const progress = calculateProgress(campaign.totalRaised, campaign.fundingGoal);
  const status = getCampaignStatus(
    campaign.status,
    Number(campaign.deadline),
    campaign.totalRaised,
    campaign.fundingGoal
  );
  const statusColor = getCampaignStatusColor(status);
  const isCreator = address?.toLowerCase() === campaign.creator.toLowerCase();
  const daysLeft = calculateDaysLeft(Number(campaign.deadline));
  const isActive = status === "Active";
  const canFinalize = isActive && Date.now() / 1000 >= Number(campaign.deadline);

  const handleRefund = async () => {
    await claimRefund(campaignId);
    toast.success("Refund claimed successfully!");
    refetch();
  };

  const handleWithdraw = async () => {
    await withdrawFunds(campaignId, 0);
    toast.success("Funds withdrawn successfully!");
    refetch();
  };

  const handleFinalize = async () => {
    await finalizeCampaign(campaignId);
    toast.success("Campaign finalized!");
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}>
                {status}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Users size={16} className="mr-1" />
                <span>Created by {shortenAddress(campaign.creator)}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(Number(campaign.createdAt))}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">About This Campaign</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{campaign.description}</p>
          </div>

          {/* Milestones */}
          {milestones && milestones.length > 0 && (
            <MilestoneTimeline milestones={milestones} />
          )}

          {/* Contributors */}
          {contributors && contributors.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold mb-4">
                Recent Backers ({contributors.length})
              </h3>
              <div className="space-y-2">
                {contributors.slice(0, 10).map((contributor, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-b-0"
                  >
                    <span className="text-gray-700">
                      {shortenAddress(contributor)}
                    </span>
                  </div>
                ))}
                {contributors.length > 10 && (
                  <p className="text-sm text-gray-500 pt-2">
                    And {contributors.length - 10} more backers
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Funding Progress */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatEther(campaign.totalRaised)} ETH
              </div>
              <div className="text-gray-600">
                of {formatEther(campaign.fundingGoal)} ETH goal
              </div>
            </div>

            <ProgressBar progress={progress} className="mb-6" />

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <div className="text-gray-500">Progress</div>
                <div className="font-semibold text-lg">{progress.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-gray-500">Backers</div>
                <div className="font-semibold text-lg">{contributors?.length || 0}</div>
              </div>
              {isActive && (
                <div className="col-span-2">
                  <div className="flex items-center text-gray-500">
                    <Clock size={16} className="mr-1" />
                    <span>Days Left</span>
                  </div>
                  <div className="font-semibold text-lg">{daysLeft}</div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {isActive && !isCreator && (
                <button
                  onClick={() => setShowContributeModal(true)}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  Back This Campaign
                </button>
              )}

              {canFinalize && (
                <button
                  onClick={handleFinalize}
                  disabled={isFinalizing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                >
                  {isFinalizing ? "Finalizing..." : "Finalize Campaign"}
                </button>
              )}

              {isCreator && status === "Successful" && (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300"
                >
                  {isWithdrawing ? "Withdrawing..." : "Withdraw Funds"}
                </button>
              )}

              {!isCreator &&
                (status === "Failed" || status === "Cancelled") &&
                userContribution &&
                userContribution > 0n && (
                  <button
                    onClick={handleRefund}
                    disabled={isRefunding}
                    className="w-full bg-yellow-600 text-white py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors disabled:bg-gray-300"
                  >
                    {isRefunding ? "Processing..." : "Claim Refund"}
                  </button>
                )}

              {userContribution && userContribution > 0n && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Contribution</p>
                  <p className="text-xl font-bold text-primary-600">
                    {formatEther(userContribution)} ETH
                  </p>
                </div>
              )}
            </div>

            {/* Campaign Info */}
            <div className="mt-6 pt-6 border-t space-y-3 text-sm">
              {campaign.minContribution > 0n && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Contribution</span>
                  <span className="font-medium">
                    {formatEther(campaign.minContribution)} ETH
                  </span>
                </div>
              )}
              {campaign.maxContribution > 0n && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Contribution</span>
                  <span className="font-medium">
                    {formatEther(campaign.maxContribution)} ETH
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Deadline</span>
                <span className="font-medium">
                  {formatDate(Number(campaign.deadline))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribute Modal */}
      {campaign && (
        <ContributeModal
          campaign={campaign}
          isOpen={showContributeModal}
          onClose={() => setShowContributeModal(false)}
        />
      )}
    </div>
  );
}
