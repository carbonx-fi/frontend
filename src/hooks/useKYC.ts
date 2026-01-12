"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, KYCLevel } from "@/config/contracts";

// Minimal ABI for KYC operations
const KYCServiceManagerAbi = [
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "requiredLevel", type: "uint8" }
    ],
    name: "createTask",
    outputs: [{ name: "", type: "uint32" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "user", type: "address" },
      { name: "requiredLevel", type: "uint8" }
    ],
    name: "hasValidKYC",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ name: "user", type: "address" }],
    name: "getKYCLevel",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "latestTaskNum",
    outputs: [{ name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function"
  }
] as const;

const kycConfig = {
  address: CONTRACTS.KYC_SERVICE_MANAGER,
  abi: KYCServiceManagerAbi,
} as const;

export function useKYC() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Check if user has valid KYC at a given level
  const { data: hasBasicKYC, refetch: refetchBasicKYC } = useReadContract({
    ...kycConfig,
    functionName: "hasValidKYC",
    args: address ? [address, KYCLevel.BASIC] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get user's current KYC level
  const { data: kycLevel, refetch: refetchKYCLevel } = useReadContract({
    ...kycConfig,
    functionName: "getKYCLevel",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Get latest task number
  const { data: latestTaskNum } = useReadContract({
    ...kycConfig,
    functionName: "latestTaskNum",
  });

  // Request KYC verification
  const requestKYC = async (level: KYCLevel = KYCLevel.BASIC) => {
    if (!isConnected || !address) throw new Error("Wallet not connected");

    writeContract({
      ...kycConfig,
      functionName: "createTask",
      args: [address, level],
    });
  };

  // Refetch all KYC data
  const refetch = () => {
    refetchBasicKYC();
    refetchKYCLevel();
  };

  // Get KYC level label
  const getKYCLevelLabel = (level: number): string => {
    const labels: Record<number, string> = {
      [KYCLevel.NONE]: "None",
      [KYCLevel.BASIC]: "Basic",
      [KYCLevel.INTERMEDIATE]: "Intermediate",
      [KYCLevel.ADVANCED]: "Advanced",
      [KYCLevel.ACCREDITED]: "Accredited",
    };
    return labels[level] || "Unknown";
  };

  return {
    // Data
    hasBasicKYC: hasBasicKYC as boolean | undefined,
    kycLevel: kycLevel as number | undefined,
    latestTaskNum: latestTaskNum as number | undefined,

    // Actions
    requestKYC,
    refetch,

    // Utilities
    getKYCLevelLabel,

    // Transaction state
    hash,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
