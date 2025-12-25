import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEther(value: bigint): string {
  return (Number(value) / 1e18).toFixed(4);
}

export function parseEther(value: string): bigint {
  if (!value || value.trim() === "") {
    throw new Error("Cannot parse empty value to ether");
  }
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    throw new Error(`Cannot parse "${value}" to ether: not a valid number`);
  }
  return BigInt(Math.floor(numValue * 1e18));
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDeadline(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const now = new Date();

  if (date < now) {
    return "Expired";
  }

  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatDate(timestamp: number): string {
  return format(new Date(timestamp * 1000), "MMM dd, yyyy");
}

export function calculateProgress(raised: bigint, goal: bigint): number {
  if (goal === 0n) return 0;
  const progress = (Number(raised) * 100) / Number(goal);
  return Math.min(progress, 100);
}

export function calculateDaysLeft(deadline: number): number {
  const now = Math.floor(Date.now() / 1000);
  const secondsLeft = deadline - now;
  return Math.max(0, Math.ceil(secondsLeft / 86400));
}

export function getCampaignStatus(
  status: number,
  deadline: number,
  totalRaised: bigint,
  fundingGoal: bigint
): string {
  const statusMap = ["Active", "Successful", "Failed", "Cancelled"];

  if (status === 0) { // Active
    const now = Math.floor(Date.now() / 1000);
    if (now >= deadline) {
      return totalRaised >= fundingGoal ? "Successful" : "Failed";
    }
  }

  return statusMap[status] || "Unknown";
}

export function getCampaignStatusColor(status: string): string {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-800",
    Successful: "bg-blue-100 text-blue-800",
    Failed: "bg-red-100 text-red-800",
    Cancelled: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function calculatePlatformFee(amount: bigint, feePercentage: number = 250): bigint {
  return (amount * BigInt(feePercentage)) / 10000n;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function validateCampaignForm(data: {
  title: string;
  description: string;
  fundingGoal: string;
  duration: string;
}) {
  const errors: Record<string, string> = {};

  if (!data.title || data.title.trim().length === 0) {
    errors.title = "Title is required";
  } else if (data.title.length > 100) {
    errors.title = "Title must be less than 100 characters";
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = "Description is required";
  } else if (data.description.length < 50) {
    errors.description = "Description must be at least 50 characters";
  }

  const goal = parseFloat(data.fundingGoal);
  if (!data.fundingGoal || isNaN(goal) || goal <= 0) {
    errors.fundingGoal = "Funding goal must be greater than 0";
  }

  const duration = parseInt(data.duration);
  if (!data.duration || isNaN(duration) || duration < 1 || duration > 365) {
    errors.duration = "Duration must be between 1 and 365 days";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateContribution(
  amount: string,
  minContribution: bigint,
  maxContribution: bigint,
  userBalance: bigint
): { isValid: boolean; error?: string } {
  try {
    const amountWei = parseEther(amount);

    if (amountWei <= 0n) {
      return { isValid: false, error: "Amount must be greater than 0" };
    }

    if (minContribution > 0n && amountWei < minContribution) {
      return {
        isValid: false,
        error: `Minimum contribution is ${formatEther(minContribution)} ETH`,
      };
    }

    if (maxContribution > 0n && amountWei > maxContribution) {
      return {
        isValid: false,
        error: `Maximum contribution is ${formatEther(maxContribution)} ETH`,
      };
    }

    if (amountWei > userBalance) {
      return { isValid: false, error: "Insufficient balance" };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: "Invalid amount format" };
  }
}
