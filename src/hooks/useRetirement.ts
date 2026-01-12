"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS, CarbonCategory } from "@/config/contracts";
import CarbonCreditTokenAbi from "@/config/abis/CarbonCreditToken.json";

const carbonTokenConfig = {
  address: CONTRACTS.CARBON_CREDIT_TOKEN,
  abi: CarbonCreditTokenAbi,
} as const;

export interface RetirementParams {
  tokenId: bigint;
  amount: bigint;
  note?: string;
}

export function useRetirement() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Get user's balance for a specific token
  const useTokenBalance = (tokenId: bigint | undefined) => {
    return useReadContract({
      ...carbonTokenConfig,
      functionName: "balanceOf",
      args: address && tokenId ? [address, tokenId] : undefined,
      query: {
        enabled: !!address && !!tokenId,
      },
    });
  };

  // Get user's total retirements for a token
  const useUserRetirements = (tokenId: bigint | undefined) => {
    return useReadContract({
      ...carbonTokenConfig,
      functionName: "userRetirements",
      args: address && tokenId ? [address, tokenId] : undefined,
      query: {
        enabled: !!address && !!tokenId,
      },
    });
  };

  // Get user's category retirements
  const useCategoryRetirements = (category: CarbonCategory) => {
    return useReadContract({
      ...carbonTokenConfig,
      functionName: "getUserCategoryRetirements",
      args: address ? [address, category] : undefined,
      query: {
        enabled: !!address,
      },
    });
  };

  // Retire carbon credits
  const retire = async ({ tokenId, amount, note = "" }: RetirementParams) => {
    if (!isConnected) throw new Error("Wallet not connected");
    if (!tokenId) throw new Error("Token ID required");
    if (!amount || amount <= BigInt(0)) throw new Error("Amount must be positive");

    writeContract({
      ...carbonTokenConfig,
      functionName: "retire",
      args: [tokenId, amount, note],
    });
  };

  // Retire carbon credits (with amount in tonnes for convenience)
  const retireTonnes = async (tokenId: bigint, tonnes: number, note = "") => {
    const amountWei = parseEther(tonnes.toString());
    return retire({ tokenId, amount: amountWei, note });
  };

  // Batch retire multiple tokens
  const retireBatch = async (
    tokenIds: bigint[],
    amounts: bigint[],
    note = ""
  ) => {
    if (!isConnected) throw new Error("Wallet not connected");
    if (tokenIds.length !== amounts.length) throw new Error("Array length mismatch");

    writeContract({
      ...carbonTokenConfig,
      functionName: "retireBatch",
      args: [tokenIds, amounts, note],
    });
  };

  // Helper to format retirement amount
  const formatTonnes = (amount: bigint): string => {
    return formatEther(amount);
  };

  return {
    // Hooks for reading balances
    useTokenBalance,
    useUserRetirements,
    useCategoryRetirements,

    // Actions
    retire,
    retireTonnes,
    retireBatch,

    // Utilities
    formatTonnes,

    // Transaction state
    hash,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
