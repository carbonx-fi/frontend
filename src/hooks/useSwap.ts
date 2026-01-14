"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import { parseEther, formatEther, parseUnits, formatUnits } from "viem";
import { CONTRACTS, POOLS } from "@/config/contracts";
import CarbonAMMPoolAbi from "@/config/abis/CarbonAMMPool.json";

// ERC20 ABI for approve
const ERC20Abi = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Quote currency (USDC) - 6 decimals
const QUOTE_CURRENCY = CONTRACTS.MOCK_USDC;
const QUOTE_DECIMALS = 6;

// Default pool address - can be overridden
const DEFAULT_POOL = POOLS.FOREST_2024;

export interface PoolReserves {
  reserveCarbon: bigint;
  reserveQuote: bigint;
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
  const { writeContract, data: hash, isPending: isWritePending, error: writeError, reset } = useWriteContract();
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
    functionName: "getSpotPrice",
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

  // Read user's USDC balance
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useReadContract({
    address: QUOTE_CURRENCY,
    abi: ERC20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read user's USDC allowance for pool
  const { data: usdcAllowance, refetch: refetchAllowance } = useReadContract({
    address: QUOTE_CURRENCY,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address ? [address, poolAddress] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Parse reserves - returns 2 values from getReserves
  const parsedReserves: PoolReserves | null = reserves
    ? {
        reserveCarbon: (reserves as [bigint, bigint])[0],
        reserveQuote: (reserves as [bigint, bigint])[1],
      }
    : null;

  // Calculate amount out for swap (constant product formula)
  // Carbon has 18 decimals, USDC has 6 decimals
  const getAmountOut = (amountIn: bigint, reserveIn: bigint, reserveOut: bigint): bigint => {
    const zero = BigInt(0);
    if (amountIn <= zero || reserveIn <= zero || reserveOut <= zero) return zero;

    // Constant product formula with 0.3% fee (30 bps)
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

  // Approve USDC spending
  const approveUsdc = async (amount: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      address: QUOTE_CURRENCY,
      abi: ERC20Abi,
      functionName: "approve",
      args: [poolAddress, amount],
    });
  };

  // Check if approval is needed
  const needsApproval = (amount: bigint): boolean => {
    if (!usdcAllowance) return true;
    return (usdcAllowance as bigint) < amount;
  };

  // Swap USDC for carbon
  const swapQuoteForCarbon = async (quoteAmount: bigint, minCarbonOut: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "swapQuoteForCarbon",
      args: [quoteAmount, minCarbonOut],
    });
  };

  // Swap carbon for USDC
  const swapCarbonForQuote = async (carbonAmount: bigint, minQuoteOut: bigint) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "swapCarbonForQuote",
      args: [carbonAmount, minQuoteOut],
    });
  };

  // Add liquidity
  const addLiquidity = async (carbonAmount: bigint, quoteAmount: bigint, minLpTokens: bigint = BigInt(0)) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "addLiquidity",
      args: [carbonAmount, quoteAmount, minLpTokens],
    });
  };

  // Remove liquidity
  const removeLiquidity = async (lpAmount: bigint, minCarbonOut: bigint = BigInt(0), minQuoteOut: bigint = BigInt(0)) => {
    if (!isConnected) throw new Error("Wallet not connected");

    writeContract({
      ...poolConfig,
      functionName: "removeLiquidity",
      args: [lpAmount, minCarbonOut, minQuoteOut],
    });
  };

  // Refetch all pool data
  const refetch = () => {
    refetchReserves();
    refetchSpotPrice();
    refetchLpBalance();
    refetchUsdcBalance();
    refetchAllowance();
  };

  // Helper formatters
  // Carbon uses 18 decimals
  const formatCarbon = (amount: bigint): string => formatEther(amount);
  const parseCarbon = (amount: string): bigint => parseEther(amount);

  // USDC uses 6 decimals
  const formatQuote = (amount: bigint): string => formatUnits(amount, QUOTE_DECIMALS);
  const parseQuote = (amount: string): bigint => parseUnits(amount, QUOTE_DECIMALS);

  return {
    // Data
    reserves: parsedReserves,
    spotPrice: spotPrice as bigint | undefined,
    lpBalance: lpBalance as bigint | undefined,
    totalLpSupply: totalLpSupply as bigint | undefined,
    usdcBalance: usdcBalance as bigint | undefined,
    usdcAllowance: usdcAllowance as bigint | undefined,

    // Calculations
    getAmountOut,
    getAmountIn,
    getPriceImpact,

    // Actions
    approveUsdc,
    needsApproval,
    swapQuoteForCarbon,
    swapCarbonForQuote,
    addLiquidity,
    removeLiquidity,
    refetch,
    reset,

    // Utilities
    formatCarbon,
    formatQuote,
    parseCarbon,
    parseQuote,
    QUOTE_DECIMALS,

    // Transaction state
    hash,
    isPending: isWritePending,
    isConfirming,
    isConfirmed,
    error: writeError,
  };
}
