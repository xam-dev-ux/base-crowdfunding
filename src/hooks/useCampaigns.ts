import { useReadContract, useAccount } from "wagmi";
import { CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI } from "@/lib/contract";
import { useEffect, useState } from "react";

export interface Campaign {
  id: bigint;
  creator: string;
  title: string;
  description: string;
  metadataURI: string;
  fundingGoal: bigint;
  deadline: bigint;
  totalRaised: bigint;
  minContribution: bigint;
  maxContribution: bigint;
  status: number;
  createdAt: bigint;
  hasMilestones: boolean;
  fundsWithdrawn: bigint;
}

export interface Milestone {
  description: string;
  percentage: bigint;
  released: boolean;
}

export function useCampaign(campaignId: number) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getCampaign",
    args: [BigInt(campaignId)],
  });
}

export function useCampaignMilestones(campaignId: number) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getCampaignMilestones",
    args: [BigInt(campaignId)],
  });
}

export function useCampaignContributors(campaignId: number) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getCampaignContributors",
    args: [BigInt(campaignId)],
  });
}

export function useUserContribution(campaignId: number, userAddress?: string) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getContribution",
    args: userAddress ? [BigInt(campaignId), userAddress as `0x${string}`] : undefined,
  });
}

export function useUserCreatedCampaigns(userAddress?: string) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getUserCreatedCampaigns",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  });
}

export function useUserContributedCampaigns(userAddress?: string) {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getUserContributions",
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
  });
}

export function useAllCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: totalCampaigns } = useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getTotalCampaigns",
  });

  useEffect(() => {
    async function fetchCampaigns() {
      if (!totalCampaigns) {
        setIsLoading(false);
        return;
      }

      const total = Number(totalCampaigns);
      const campaignPromises = [];

      for (let i = 0; i < total; i++) {
        campaignPromises.push(
          fetch(`/api/campaign/${i}`).then((res) => res.json())
        );
      }

      try {
        const results = await Promise.all(campaignPromises);
        setCampaigns(results.filter((c) => c !== null));
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, [totalCampaigns]);

  return { campaigns, isLoading };
}
