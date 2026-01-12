"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS, POOLS } from "@/config/contracts";
import CarbonAMMPoolAbi from "@/config/abis/CarbonAMMPool.json";

// Default pool address - can be overridden
const DEFAULT_POOL = POOLS.FOREST_2024;

export interface PoolReserves {
  reserveCarbon: bigint;
  reserveQuote: bigint;
  kValue: bigint;
  totalSupply: bigint;
}

export interface SwapParams {
  amountIn: bigint;
  minAmountOut: bigint;
  pool?: `0x${string}`;
}

const getPoolConfig = (pool: `0x${string}` = DEFAULT_POOL) => ({
  address: pool,
  abi: CarbonAMMPoolAbi,
} as const);

export function useSwap(poolAddress: `0x${string}` = DEFAULT_POOL) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending: isWritePending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const poolConfig = getPoolConfig(poolAddress);

  // Read pool reserves
  const { data: reserves, refetch: refetchReserves } = useReadContract({
    ...poolConfig,
    functionName: "getReserves",
    query: {
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Read spot price
  const { data: spotPrice, refetch: refetchSpotPrice } = useReadContract({
    ...poolConfig,
    functionName: "spotPrice",
    query: {
      refetchInterval: 10000,
    },
  });

  // Read user's LP balance
  const { data: lpBalance, refetch: refetchLpBalance } = useReadContract({
    ...poolConfig,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read total LP supply
  const { data: totalLpSupply } = useReadContract({
    ...poolConfig,
    functionName: "totalSupply",
  });

  // Parse reserves
  const parsedReserves: PoolReserves | null = reserves
    ? {
        reserveCarbon: (reserves as [bigint, bigint, bigint, bigint])[0],
        reserveQuote: (reserves as [bigint, bigint, bigint, bigint])[1],
        kValue: (reserves as [bigint, bigint, bigint, bigint])[2],
        totalSupply: (reserves as [bigint, bigint, bigint, bigint])[3],
      }
    : null;

  // Calculate amount out for swap
  const getAmountOut = (amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint => {
    const zero = BigInt(0);
    if (amountIn <= zero || reserveIn <= zero || reserveOut <= zero) return zero;

    // Constant product formula with 0.3% fee
    const amountInWithFee = amountIn * BigInt(997);
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * BigInt(1000) + amountInWithFee;

    return numerator / denominator;
  };

  // Calculate amount in for desired output
  const getAmountIn = (amountOut: bigint, reserveIn: bigint, reserveOut: bigint): bigint => {
    const zero = BigInt(0);
    if (amountOut <= zero || reserveIn <= zero || reserveOut <= zero) return zero;
    if (amountOut >= reserveOut) return zero;

    const numerator = reserveIn * amountOut * BigInt(1000);
    const denominator = (reserveOut - amountOut) * BigInt(997);

    return numerator / denominator + BigInt(1);
  };

  // Calculate price impact
  const getPriceImpact = (amountIn: bigint, reserveIn: bigint, reserveOut: bigint): number => {
    const zero = BigInt(0);
    if (amountIn <= zero || reserveIn <= zero || reserveOut <= zero) return 0;

    const amountOut = getAmountOut(amountIn, reserveIn, reserveOut);
    const idealRate = Number(reserveOut) / Number(reserveIn);
    const actualRate = Number(amountOut) / Number(amountIn);

    return ((idealRate - actualRate) / idealRate) * 100;
  };

  // Swap quote (ETH/MNT) for carbon
  const swapQuoteForCarbon = async (quoteAmount: bigint, minCarbonOut: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "swapQuoteForCarbon",
      args: [minCarbonOut],
      value: quoteAmount,
    });
  };

  // Swap carbon for quote (ETH/MNT)
  const swapCarbonForQuote = async (carbonAmount: bigint, minQuoteOut: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "swapCarbonForQuote",
      args: [carbonAmount, minQuoteOut],
    });
  };

  // Add liquidity
  const addLiquidity = async (carbonAmount: bigint, quoteAmount: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "addLiquidity",
      args: [carbonAmount],
      value: quoteAmount,
    });
  };

  // Remove liquidity
  const removeLiquidity = async (lpAmount: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "removeLiquidity",
      args: [lpAmount],
    });
  };

  // Refetch all pool data
  const refetch = () => {
    refetchReserves();
    refetchSpotPrice();
    refetchLpBalance();
  };

  // Helper formatters
  const formatCarbon = (amount: bigint): string => formatEther(amount);
  const formatQuote = (amount: bigint): string => formatEther(amount);
  const parseCarbon = (amount: string): bigint => parseEther(amount);
  const parseQuote = (amount: string): bigint => parseEther(amount);

  return {
    // Data
    reserves: parsedReserves,
    spotPrice: spotPrice as bigint | undefined,
    lpBalance: lpBalance as bigint | undefined,
    totalLpSupply: totalLpSupply as bigint | undefined,

    // Calculations
    getAmountOut,
    getAmountIn,
    getPriceImpact,

    // Actions
    swapQuoteForCarbon,
    swapCarbonForQuote,
    addLiquidity,
    removeLiquidity,
    refetch,

    // Utilities
    formatCarbon,
    formatQuote,
    parseCarbon,
    parseQuote,

    // Transaction state
    hash,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
