"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { formatEther, parseEther, parseUnits, formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Leaf,
  TreePine,
  Waves,
  Factory,
  RefreshCw,
  BarChart3,
  Clock,
  Zap,
  AlertCircle,
  Loader2,
  ArrowDown,
  Info,
  Flame,
} from "lucide-react";
import { useSwap, PoolReserves } from "@/hooks/useSwap";
import { useRetirement } from "@/hooks/useRetirement";
import { POOLS } from "@/config/contracts";
import dynamic from "next/dynamic";

// Dynamically import TradingView widget to avoid SSR issues
const TradingViewWidget = dynamic(
  () => import("@/components/trading-view-widget"),
  { ssr: false, loading: () => <div className="h-[400px] bg-muted/20 animate-pulse rounded-lg" /> }
);

// Mock data for CLOB (coming soon)
const mockOrderBook = {
  bids: [
    { price: 24.50, quantity: 1250, total: 30625 },
    { price: 24.45, quantity: 850, total: 20782.5 },
    { price: 24.40, quantity: 2100, total: 51240 },
  ],
  asks: [
    { price: 24.55, quantity: 980, total: 24059 },
    { price: 24.60, quantity: 1420, total: 34932 },
    { price: 24.65, quantity: 2300, total: 56695 },
  ],
};

export default function TradePage() {
  const { address, isConnected } = useAccount();
  const {
    reserves,
    spotPrice,
    lpBalance,
    usdcBalance,
    usdcAllowance,
    getAmountOut,
    getAmountIn,
    getPriceImpact,
    approveUsdc,
    needsApproval,
    swapQuoteForCarbon,
    swapCarbonForQuote,
    addLiquidity,
    removeLiquidity,
    refetch,
    reset,
    formatCarbon,
    formatQuote,
    parseCarbon,
    parseQuote,
    QUOTE_DECIMALS,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  } = useSwap(POOLS.FOREST_2024);

  const {
    retire,
    isPending: isRetirePending,
    isConfirming: isRetireConfirming,
    isConfirmed: isRetireConfirmed,
  } = useRetirement();

  // UI State
  const [activeTab, setActiveTab] = useState<"swap" | "retire" | "clob">("swap");
  const [swapDirection, setSwapDirection] = useState<"buy" | "sell">("buy");
  const [inputAmount, setInputAmount] = useState("");
  const [retireAmount, setRetireAmount] = useState("");
  const [retireNote, setRetireNote] = useState("");
  const [slippage, setSlippage] = useState(0.5); // 0.5% default slippage

  // Parse input amount based on direction
  // Buy: input is USDC (6 decimals), output is carbon (18 decimals)
  // Sell: input is carbon (18 decimals), output is USDC (6 decimals)
  const parsedInputAmount = useMemo(() => {
    if (!inputAmount) return BigInt(0);
    try {
      if (swapDirection === "buy") {
        return parseUnits(inputAmount, QUOTE_DECIMALS); // USDC has 6 decimals
      } else {
        return parseEther(inputAmount); // Carbon has 18 decimals
      }
    } catch {
      return BigInt(0);
    }
  }, [inputAmount, swapDirection, QUOTE_DECIMALS]);

  // Calculate output amount based on input
  const outputAmount = useMemo(() => {
    if (!inputAmount || !reserves || parsedInputAmount === BigInt(0)) return BigInt(0);
    try {
      if (swapDirection === "buy") {
        // Buying carbon with USDC
        return getAmountOut(parsedInputAmount, reserves.reserveQuote, reserves.reserveCarbon);
      } else {
        // Selling carbon for USDC
        return getAmountOut(parsedInputAmount, reserves.reserveCarbon, reserves.reserveQuote);
      }
    } catch {
      return BigInt(0);
    }
  }, [parsedInputAmount, reserves, swapDirection, getAmountOut, inputAmount]);

  // Calculate price impact
  const priceImpact = useMemo(() => {
    if (!inputAmount || !reserves || parsedInputAmount === BigInt(0)) return 0;
    try {
      if (swapDirection === "buy") {
        return getPriceImpact(parsedInputAmount, reserves.reserveQuote, reserves.reserveCarbon);
      } else {
        return getPriceImpact(parsedInputAmount, reserves.reserveCarbon, reserves.reserveQuote);
      }
    } catch {
      return 0;
    }
  }, [parsedInputAmount, reserves, swapDirection, getPriceImpact, inputAmount]);

  // Min amount out with slippage
  const minAmountOut = useMemo(() => {
    const slippageMultiplier = BigInt(Math.floor((100 - slippage) * 10));
    return (outputAmount * slippageMultiplier) / BigInt(1000);
  }, [outputAmount, slippage]);

  // Check if we need to approve USDC
  const requiresApproval = useMemo(() => {
    if (swapDirection !== "buy" || parsedInputAmount === BigInt(0)) return false;
    return needsApproval(parsedInputAmount);
  }, [swapDirection, parsedInputAmount, needsApproval]);

  // Handle approval
  const handleApprove = async () => {
    if (!inputAmount) return;
    try {
      // Approve a large amount to avoid repeated approvals
      await approveUsdc(parsedInputAmount * BigInt(10));
    } catch (e) {
      console.error("Approval failed:", e);
    }
  };

  // Execute swap
  const handleSwap = async () => {
    if (!inputAmount || parsedInputAmount === BigInt(0)) return;
    try {
      if (swapDirection === "buy") {
        await swapQuoteForCarbon(parsedInputAmount, minAmountOut);
      } else {
        await swapCarbonForQuote(parsedInputAmount, minAmountOut);
      }
    } catch (e) {
      console.error("Swap failed:", e);
    }
  };

  // Execute retirement
  const handleRetire = async () => {
    if (!retireAmount) return;
    try {
      const amount = parseEther(retireAmount);
      // Token ID for FOREST 2024 (Project 3, vintage 2024, category FOREST)
      // Encoded as: projectId << 24 | vintage << 8 | category
      // = 3 << 24 | 2024 << 8 | 0 = 50849792
      const FOREST_2024_TOKEN_ID = BigInt(50849792);
      await retire({ tokenId: FOREST_2024_TOKEN_ID, amount, note: retireNote });
    } catch (e) {
      console.error("Retire failed:", e);
    }
  };

  // Flip swap direction
  const handleFlipDirection = () => {
    setSwapDirection((prev) => (prev === "buy" ? "sell" : "buy"));
    setInputAmount("");
  };

  // Format spot price for display
  // Spot price is (reserveQuote * 1e18) / reserveCarbon
  // Since USDC has 6 decimals, divide by 1e6 to get the dollar value
  const formattedSpotPrice = spotPrice
    ? Number(formatUnits(spotPrice, QUOTE_DECIMALS)).toFixed(2)
    : "0.00";

  return (
    <div className="min-h-screen bg-background">
      {/* Market Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Market Info */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">Forest Carbon 2024</h1>
                    <Badge variant="secondary">FOREST/USDC</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl font-bold">
                      ${formattedSpotPrice}
                    </span>
                    <span className="flex items-center text-emerald-500">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      AMM Pool
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pool Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">Carbon Reserve</span>
                <p className="font-semibold">
                  {reserves
                    ? Number(formatEther(reserves.reserveCarbon)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )
                    : "0"}{" "}
                  t
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">USDC Reserve</span>
                <p className="font-semibold">
                  {reserves
                    ? Number(formatUnits(reserves.reserveQuote, 6)).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 2 }
                      )
                    : "0"}{" "}
                  USDC
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Your LP</span>
                <p className="font-semibold text-emerald-500">
                  {lpBalance
                    ? Number(formatEther(lpBalance)).toLocaleString(undefined, {
                        maximumFractionDigits: 4,
                      })
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="container px-4 md:px-6 lg:px-8 py-6">
        <div className="max-w-lg mx-auto">
          {/* Tab Selection */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "swap" | "retire" | "clob")}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="swap" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Swap
              </TabsTrigger>
              <TabsTrigger value="retire" className="gap-2">
                <Flame className="h-4 w-4" />
                Retire
              </TabsTrigger>
              <TabsTrigger value="clob" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                CLOB
              </TabsTrigger>
            </TabsList>

            {/* Swap Tab */}
            <TabsContent value="swap">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {/* Input Token */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {swapDirection === "buy" ? "You Pay" : "You Sell"}
                      </span>
                      <span className="text-muted-foreground">
                        Balance: --
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full h-16 px-4 pr-24 text-2xl rounded-xl bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {swapDirection === "buy" ? "USDC" : "CARBON"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Swap Direction Button */}
                  <div className="flex justify-center -my-2 relative z-10">
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full bg-background hover:bg-muted"
                      onClick={handleFlipDirection}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Output Token */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {swapDirection === "buy" ? "You Receive" : "You Get"}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        readOnly
                        value={
                          outputAmount > BigInt(0)
                            ? swapDirection === "buy"
                              ? Number(formatEther(outputAmount)).toFixed(6) // Carbon out (18 decimals)
                              : Number(formatUnits(outputAmount, QUOTE_DECIMALS)).toFixed(2) // USDC out (6 decimals)
                            : ""
                        }
                        placeholder="0.0"
                        className="w-full h-16 px-4 pr-24 text-2xl rounded-xl bg-muted/30 border border-border outline-none"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Badge variant="secondary" className="text-base px-3 py-1">
                          {swapDirection === "buy" ? "CARBON" : "USDC"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Swap Details */}
                  {inputAmount && outputAmount > BigInt(0) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="p-4 rounded-xl bg-muted/30 space-y-2 text-sm"
                    >
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span>
                          1 CARBON = ${formattedSpotPrice}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Price Impact
                          <Info className="h-3 w-3" />
                        </span>
                        <span
                          className={
                            priceImpact > 5
                              ? "text-red-500"
                              : priceImpact > 2
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }
                        >
                          {priceImpact.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Min. Received ({slippage}% slippage)
                        </span>
                        <span>
                          {swapDirection === "buy"
                            ? `${Number(formatEther(minAmountOut)).toFixed(6)} CARBON`
                            : `$${Number(formatUnits(minAmountOut, QUOTE_DECIMALS)).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Network Fee
                        </span>
                        <span className="text-muted-foreground">~0.3%</span>
                      </div>
                    </motion.div>
                  )}

                  {/* High Price Impact Warning */}
                  {priceImpact > 5 && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>
                        High price impact! Consider reducing your trade size.
                      </span>
                    </div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{error.message}</span>
                    </div>
                  )}

                  {/* Submit Button - Approve or Swap */}
                  {requiresApproval ? (
                    <Button
                      className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                      disabled={
                        !isConnected ||
                        !inputAmount ||
                        isPending ||
                        isConfirming
                      }
                      onClick={handleApprove}
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Approving USDC...
                        </>
                      ) : (
                        "Approve USDC"
                      )}
                    </Button>
                  ) : (
                    <Button
                      className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                      disabled={
                        !isConnected ||
                        !inputAmount ||
                        outputAmount <= BigInt(0) ||
                        isPending ||
                        isConfirming
                      }
                      onClick={handleSwap}
                    >
                      {!isConnected ? (
                        "Connect Wallet"
                      ) : isPending || isConfirming ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          {isPending ? "Confirm in Wallet..." : "Swapping..."}
                        </>
                      ) : !inputAmount ? (
                        "Enter Amount"
                      ) : (
                        <>
                          {swapDirection === "buy" ? "Buy" : "Sell"} Carbon
                        </>
                      )}
                    </Button>
                  )}

                  {isConfirmed && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm">
                      <Zap className="h-4 w-4 flex-shrink-0" />
                      <span>Swap successful!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Retire Tab */}
            <TabsContent value="retire">
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="text-center mb-4">
                    <div className="p-3 rounded-full bg-emerald-500/10 w-fit mx-auto mb-3">
                      <Flame className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold">Retire Carbon Credits</h3>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove carbon credits from circulation and claim
                      your environmental impact.
                    </p>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Amount to Retire (tonnes)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={retireAmount}
                        onChange={(e) => setRetireAmount(e.target.value)}
                        placeholder="0.0"
                        className="w-full h-14 px-4 pr-20 text-xl rounded-xl bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        tonnes
                      </span>
                    </div>
                  </div>

                  {/* Note Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">
                      Retirement Note (optional)
                    </label>
                    <textarea
                      value={retireNote}
                      onChange={(e) => setRetireNote(e.target.value)}
                      placeholder="e.g., Offsetting Q4 2024 emissions"
                      className="w-full h-20 px-4 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none resize-none"
                    />
                  </div>

                  {/* Retirement Summary */}
                  {retireAmount && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Carbon to Retire
                        </span>
                        <span className="font-medium">{retireAmount} tonnes</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          CO2 Equivalent
                        </span>
                        <span className="font-medium text-emerald-500">
                          {retireAmount} tonnes CO2
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground text-sm">
                          Guardian Impact
                        </span>
                        <span className="font-bold text-emerald-500">
                          +{retireAmount}t to your profile
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    disabled={
                      !isConnected ||
                      !retireAmount ||
                      isRetirePending ||
                      isRetireConfirming
                    }
                    onClick={handleRetire}
                  >
                    {!isConnected ? (
                      "Connect Wallet"
                    ) : isRetirePending || isRetireConfirming ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        {isRetirePending ? "Confirm in Wallet..." : "Retiring..."}
                      </>
                    ) : !retireAmount ? (
                      "Enter Amount"
                    ) : (
                      <>
                        <Flame className="h-5 w-5 mr-2" />
                        Retire {retireAmount} tonnes
                      </>
                    )}
                  </Button>

                  {isRetireConfirmed && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm">
                      <Zap className="h-4 w-4 flex-shrink-0" />
                      <span>
                        Successfully retired! Check your Guardian profile for
                        updated stats.
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* CLOB Tab - Professional Trading Interface */}
            <TabsContent value="clob" className="space-y-4">
              {/* Phase 3 Banner */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                    Phase 3 Preview
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Limit order trading coming soon
                  </span>
                </div>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>

              {/* TradingView Chart */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                      CARBON/USDC Chart
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Demo Data
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <TradingViewWidget symbol="BINANCE:ETHUSDT" theme="dark" height={400} />
                </CardContent>
              </Card>

              {/* Order Book + Place Order Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Order Book */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Order Book</span>
                      <span className="text-xs text-muted-foreground font-normal">
                        Spread: 0.04%
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Column Headers */}
                    <div className="grid grid-cols-3 text-xs text-muted-foreground mb-2 pb-2 border-b border-border/50">
                      <span>Price (USDC)</span>
                      <span className="text-right">Size (t)</span>
                      <span className="text-right">Total</span>
                    </div>

                    {/* Asks (Sells) */}
                    <div className="space-y-0.5 mb-2">
                      {mockOrderBook.asks.slice().reverse().map((ask, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 text-xs py-1 px-1 rounded hover:bg-red-500/10 transition-colors relative"
                        >
                          <div
                            className="absolute inset-0 bg-red-500/10 rounded"
                            style={{ width: `${Math.min((ask.quantity / 2500) * 100, 100)}%` }}
                          />
                          <span className="text-red-400 relative z-10">${ask.price.toFixed(2)}</span>
                          <span className="text-right relative z-10">{ask.quantity.toLocaleString()}</span>
                          <span className="text-right text-muted-foreground relative z-10">
                            ${ask.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Spread / Current Price */}
                    <div className="flex items-center justify-center gap-2 py-2 my-2 border-y border-border/50 bg-emerald-500/5">
                      <span className="text-lg font-bold text-emerald-500">$24.52</span>
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-xs text-emerald-500">+2.4%</span>
                    </div>

                    {/* Bids (Buys) */}
                    <div className="space-y-0.5 mt-2">
                      {mockOrderBook.bids.map((bid, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 text-xs py-1 px-1 rounded hover:bg-emerald-500/10 transition-colors relative"
                        >
                          <div
                            className="absolute inset-0 bg-emerald-500/10 rounded"
                            style={{ width: `${Math.min((bid.quantity / 2500) * 100, 100)}%` }}
                          />
                          <span className="text-emerald-400 relative z-10">${bid.price.toFixed(2)}</span>
                          <span className="text-right relative z-10">{bid.quantity.toLocaleString()}</span>
                          <span className="text-right text-muted-foreground relative z-10">
                            ${bid.total.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Place Order Form (Disabled Preview) */}
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Place Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Order Type Tabs */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 hover:bg-emerald-500/30">
                        Limit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 opacity-50" disabled>
                        Market
                      </Button>
                    </div>

                    {/* Buy/Sell Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white">
                        Buy
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-500/10">
                        Sell
                      </Button>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Price (USDC)</label>
                      <input
                        type="text"
                        placeholder="0.00"
                        defaultValue="24.50"
                        disabled
                        className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-border text-sm opacity-50"
                      />
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">Amount (tonnes)</label>
                      <input
                        type="text"
                        placeholder="0.00"
                        disabled
                        className="w-full h-10 px-3 rounded-lg bg-muted/30 border border-border text-sm opacity-50"
                      />
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex gap-2">
                      {["25%", "50%", "75%", "100%"].map((pct) => (
                        <Button
                          key={pct}
                          size="sm"
                          variant="outline"
                          className="flex-1 text-xs opacity-50"
                          disabled
                        >
                          {pct}
                        </Button>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="p-3 rounded-lg bg-muted/20 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Total</span>
                        <span>--</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Fee (0.1%)</span>
                        <span>--</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button className="w-full" disabled>
                      <Clock className="h-4 w-4 mr-2" />
                      Coming in Phase 3
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pool Info Card */}
          <Card className="mt-6 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-4 w-4 text-emerald-500" />
                Pool Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground text-xs">Pool Type</p>
                  <p className="font-medium">Constant Product AMM</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground text-xs">Trading Fee</p>
                  <p className="font-medium">0.3%</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground text-xs">Token ID</p>
                  <p className="font-medium">#1 (Forest 2024)</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground text-xs">Network</p>
                  <p className="font-medium">Mantle Sepolia</p>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => refetch()}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Pool Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
