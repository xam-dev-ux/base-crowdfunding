"use client";

import { useAccount } from "wagmi";
import {
  useUserCreatedCampaigns,
  useUserContributedCampaigns,
  useCampaign,
} from "@/hooks/useCampaigns";
import CampaignCard from "@/components/CampaignCard";
import { useState } from "react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"created" | "backed">("created");

  const { data: createdCampaignIds } = useUserCreatedCampaigns(address);
  const { data: backedCampaignIds } = useUserContributedCampaigns(address);

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="bg-white rounded-lg shadow-md p-12">
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-gray-600">
            Please connect your wallet to view your dashboard
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
        <p className="text-gray-600">
          Manage your campaigns and contributions
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("created")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "created"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Campaigns ({createdCampaignIds?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("backed")}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === "backed"
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Backed Campaigns ({backedCampaignIds?.length || 0})
          </button>
        </div>
      </div>

      {/* Created Campaigns */}
      {activeTab === "created" && (
        <div>
          {createdCampaignIds && createdCampaignIds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdCampaignIds.map((id) => (
                <CampaignItem key={id.toString()} campaignId={Number(id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
             <p className="text-gray-600 mb-4">
  You haven&apos;t created any campaigns yet
</p>
              <a
                href="/create"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Campaign
              </a>
            </div>
          )}
        </div>
      )}

      {/* Backed Campaigns */}
      {activeTab === "backed" && (
        <div>
          {backedCampaignIds && backedCampaignIds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {backedCampaignIds.map((id) => (
                <CampaignItem key={id.toString()} campaignId={Number(id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
             <p className="text-gray-600 mb-4">
  You haven&apos;t backed any campaigns yet
</p>

              <a
                href="/explore"
                className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Explore Campaigns
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CampaignItem({ campaignId }: { campaignId: number }) {
  const { data: campaign } = useCampaign(campaignId);

  if (!campaign) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return <CampaignCard campaign={campaign} />;
}
