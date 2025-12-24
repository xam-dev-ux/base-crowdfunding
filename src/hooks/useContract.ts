import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CROWDFUNDING_ADDRESS, CROWDFUNDING_ABI } from "@/lib/contract";

export function useContract() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return {
    writeContract,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function usePlatformStats() {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getPlatformStats",
  });
}

export function useTotalCampaigns() {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "getTotalCampaigns",
  });
}

export function usePlatformFee() {
  return useReadContract({
    address: CROWDFUNDING_ADDRESS,
    abi: CROWDFUNDING_ABI,
    functionName: "platformFeePercentage",
  });
}
