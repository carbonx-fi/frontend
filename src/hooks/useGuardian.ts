"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, GuardianTier } from "@/config/contracts";
import GuardianNFTAbi from "@/config/abis/GuardianNFT.json";

// Guardian paths
export enum GuardianPath {
  OCEAN = 0,
  FOREST = 1,
  ENERGY = 2,
  TECH = 3,
  COMMUNITY = 4,
  WILDLIFE = 5,
}

export const GUARDIAN_PATH_NAMES: Record<GuardianPath, string> = {
  [GuardianPath.OCEAN]: "Ocean",
  [GuardianPath.FOREST]: "Forest",
  [GuardianPath.ENERGY]: "Energy",
  [GuardianPath.TECH]: "Tech",
  [GuardianPath.COMMUNITY]: "Community",
  [GuardianPath.WILDLIFE]: "Wildlife",
};

export const GUARDIAN_TIER_NAMES: Record<GuardianTier, string> = {
  [GuardianTier.COMMON]: "Common",
  [GuardianTier.UNCOMMON]: "Uncommon",
  [GuardianTier.RARE]: "Rare",
  [GuardianTier.EPIC]: "Epic",
  [GuardianTier.LEGENDARY]: "Legendary",
};

export interface Guardian {
  totalRetired: bigint;
  tier: GuardianTier;
  path: GuardianPath;
  createdAt: bigint;
  lastUpdated: bigint;
  nickname: string;
  isTransferable: boolean;
}

export interface TierProgress {
  currentTier: GuardianTier;
  nextTier: GuardianTier;
  progress: bigint;
  amountToNext: bigint;
}

const guardianNFTConfig = {
  address: CONTRACTS.GUARDIAN_NFT,
  abi: GuardianNFTAbi,
} as const;

export function useGuardian() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Read user's guardian token ID
  const { data: guardianId, refetch: refetchGuardianId } = useReadContract({
    ...guardianNFTConfig,
    functionName: "guardianOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read guardian data if user has one
  const { data: guardianData, refetch: refetchGuardianData } = useReadContract({
    ...guardianNFTConfig,
    functionName: "getGuardian",
    args: guardianId ? [guardianId] : undefined,
    query: {
      enabled: !!guardianId && guardianId !== BigInt(0),
    },
  });

  // Read tier progress
  const { data: tierProgress, refetch: refetchTierProgress } = useReadContract({
    ...guardianNFTConfig,
    functionName: "getTierProgress",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!guardianId && guardianId !== BigInt(0),
    },
  });

  // Read fee reduction
  const { data: feeReduction } = useReadContract({
    ...guardianNFTConfig,
    functionName: "getFeeReduction",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!guardianId && guardianId !== BigInt(0),
    },
  });

  // Read discount
  const { data: discount } = useReadContract({
    ...guardianNFTConfig,
    functionName: "getDiscount",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!guardianId && guardianId !== BigInt(0),
    },
  });

  // Read unlock fee
  const { data: unlockFee } = useReadContract({
    ...guardianNFTConfig,
    functionName: "getUnlockFee",
    args: guardianId ? [guardianId] : undefined,
    query: {
      enabled: !!guardianId && guardianId !== BigInt(0),
    },
  });

  // Parse guardian data
  const guardian: Guardian | null = guardianData
    ? {
        totalRetired: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[0],
        tier: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[1] as GuardianTier,
        path: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[2] as GuardianPath,
        createdAt: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[3],
        lastUpdated: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[4],
        nickname: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[5],
        isTransferable: (guardianData as [bigint, number, number, bigint, bigint, string, boolean])[6],
      }
    : null;

  // Parse tier progress
  const parsedTierProgress: TierProgress | null = tierProgress
    ? {
        currentTier: (tierProgress as [number, number, bigint, bigint])[0] as GuardianTier,
        nextTier: (tierProgress as [number, number, bigint, bigint])[1] as GuardianTier,
        progress: (tierProgress as [number, number, bigint, bigint])[2],
        amountToNext: (tierProgress as [number, number, bigint, bigint])[3],
      }
    : null;

  // Mint guardian
  const mintGuardian = async (path: GuardianPath) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...guardianNFTConfig,
      functionName: "mint",
      args: [path],
    });
  };

  // Unlock transfer
  const unlockTransfer = async () => {
    if (!isConnected) throw new Error("Wallet not connected");
    if (!unlockFee) throw new Error("Could not get unlock fee");

    writeContract({
      ...guardianNFTConfig,
      functionName: "unlockTransfer",
      value: unlockFee as bigint,
    });
  };

  // Set nickname
  const setNickname = async (nickname: string) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...guardianNFTConfig,
      functionName: "setNickname",
      args: [nickname],
    });
  };

  // Refetch all data
  const refetch = () => {
    refetchGuardianId();
    refetchGuardianData();
    refetchTierProgress();
  };

  return {
    // Data
    guardianId: guardianId as bigint | undefined,
    guardian,
    tierProgress: parsedTierProgress,
    feeReduction: feeReduction as number | undefined,
    discount: discount as number | undefined,
    unlockFee: unlockFee as bigint | undefined,
    hasGuardian: !!guardianId && guardianId !== BigInt(0),

    // Actions
    mintGuardian,
    unlockTransfer,
    setNickname,
    refetch,

    // Transaction state
    hash,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
