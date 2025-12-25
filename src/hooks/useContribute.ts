import { useContract } from "./useContract";
import { CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI } from "@/lib/contract";
import { parseEther } from "@/lib/utils";
import toast from "react-hot-toast";

export function useContribute() {
  const { writeContract, isPending, isConfirming, isSuccess, error } = useContract();

  const contribute = async (campaignId: number, amount: string) => {
    try {
      const amountWei = parseEther(amount);

      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "contribute",
        args: [BigInt(campaignId)],
        value: amountWei,
      });
    } catch (err) {
      console.error("Contribute error:", err);
      toast.error("Failed to contribute");
    }
  };

  return {
    contribute,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useCreateCampaign() {
  const { writeContract, isPending, isConfirming, isSuccess, hash } = useContract();

  const createCampaign = async (
    title: string,
    description: string,
    metadataURI: string,
    fundingGoal: string,
    durationInDays: number,
    minContribution: string = "0",
    maxContribution: string = "0"
  ) => {
    try {
      // Parse funding goal
      const goalWei = parseEther(fundingGoal);

      // Parse min contribution - handle empty strings
      let minWei = 0n;
      if (minContribution && minContribution.trim() !== "" && minContribution !== "0") {
        const minValue = parseFloat(minContribution);
        if (!isNaN(minValue) && minValue > 0) {
          minWei = parseEther(minContribution);
        }
      }

      // Parse max contribution - handle empty strings
      let maxWei = 0n;
      if (maxContribution && maxContribution.trim() !== "" && maxContribution !== "0") {
        const maxValue = parseFloat(maxContribution);
        if (!isNaN(maxValue) && maxValue > 0) {
          maxWei = parseEther(maxContribution);
        }
      }

      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "createCampaign",
        args: [
          title,
          description,
          metadataURI,
          goalWei,
          BigInt(durationInDays),
          minWei,
          maxWei,
        ],
      });
    } catch (err) {
      console.error("Create campaign error:", err);
      toast.error("Failed to create campaign");
    }
  };

  return {
    createCampaign,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
}

export function useWithdrawFunds() {
  const { writeContract, isPending, isConfirming, isSuccess } = useContract();

  const withdrawFunds = async (campaignId: number, milestoneIndex: number = 0) => {
    try {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "withdrawFunds",
        args: [BigInt(campaignId), BigInt(milestoneIndex)],
      });
    } catch (err) {
      console.error("Withdraw error:", err);
      toast.error("Failed to withdraw funds");
    }
  };

  return {
    withdrawFunds,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useClaimRefund() {
  const { writeContract, isPending, isConfirming, isSuccess } = useContract();

  const claimRefund = async (campaignId: number) => {
    try {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "claimRefund",
        args: [BigInt(campaignId)],
      });
    } catch (err) {
      console.error("Refund error:", err);
      toast.error("Failed to claim refund");
    }
  };

  return {
    claimRefund,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useCancelCampaign() {
  const { writeContract, isPending, isConfirming, isSuccess } = useContract();

  const cancelCampaign = async (campaignId: number) => {
    try {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "cancelCampaign",
        args: [BigInt(campaignId)],
      });
    } catch (err) {
      console.error("Cancel error:", err);
      toast.error("Failed to cancel campaign");
    }
  };

  return {
    cancelCampaign,
    isPending,
    isConfirming,
    isSuccess,
  };
}

export function useFinalizeCampaign() {
  const { writeContract, isPending, isConfirming, isSuccess } = useContract();

  const finalizeCampaign = async (campaignId: number) => {
    try {
      writeContract({
        address: CROWDFUNDING_ADDRESS,
        abi: CROWDFUNDING_ABI,
        functionName: "finalizeCampaign",
        args: [BigInt(campaignId)],
      });
    } catch (err) {
      console.error("Finalize error:", err);
      toast.error("Failed to finalize campaign");
    }
  };

  return {
    finalizeCampaign,
    isPending,
    isConfirming,
    isSuccess,
  };
}
