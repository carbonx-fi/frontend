"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Droplets,
  TrendingUp,
  TreePine,
  Waves,
  Factory,
  Building,
  Users,
  Cpu,
  Plus,
  ArrowRightLeft,
  BarChart3,
  Info,
  Sparkles,
} from "lucide-react";

const pools = [
  {
    id: 1,
    name: "Forest 2024",
    category: "Forest",
    icon: TreePine,
    tier: "PREMIUM",
    tierColor: "bg-amber-500",
    tvl: 2450000,
    volume24h: 125000,
    apy: 12.5,
    fee: 0.5,
    reserveCarbon: 45000,
    reserveQuote: 1102500,
    price: 24.5,
    change: 3.2,
  },
  {
    id: 2,
    name: "Ocean 2023",
    category: "Ocean",
    icon: Waves,
    tier: "STANDARD",
    tierColor: "bg-blue-500",
    tvl: 1850000,
    volume24h: 98000,
    apy: 8.2,
    fee: 0.3,
    reserveCarbon: 85000,
    reserveQuote: 1573750,
    price: 18.5,
    change: -1.2,
  },
  {
    id: 3,
    name: "Energy 2024",
    category: "Energy",
    icon: Factory,
    tier: "PREMIUM",
    tierColor: "bg-amber-500",
    tvl: 3200000,
    volume24h: 210000,
    apy: 15.8,
    fee: 0.5,
    reserveCarbon: 52000,
    reserveQuote: 1612000,
    price: 31.0,
    change: 5.5,
  },
  {
    id: 4,
    name: "Waste 2022",
    category: "Waste",
    icon: Building,
    tier: "BASIC",
    tierColor: "bg-gray-500",
    tvl: 890000,
    volume24h: 45000,
    apy: 5.5,
    fee: 0.2,
    reserveCarbon: 62000,
    reserveQuote: 806200,
    price: 13.0,
    change: 0.8,
  },
  {
    id: 5,
    name: "Community 2024",
    category: "Community",
    icon: Users,
    tier: "STANDARD",
    tierColor: "bg-blue-500",
    tvl: 1200000,
    volume24h: 67000,
    apy: 9.8,
    fee: 0.3,
    reserveCarbon: 38000,
    reserveQuote: 798000,
    price: 21.0,
    change: 2.1,
  },
];

const userPositions = [
  {
    pool: "Forest 2024",
    lpTokens: 1250,
    carbonDeposited: 125,
    quoteDeposited: 3062.5,
    currentValue: 3250,
    pnl: 187.5,
    pnlPercent: 6.1,
  },
  {
    pool: "Energy 2024",
    lpTokens: 800,
    carbonDeposited: 80,
    quoteDeposited: 2480,
    currentValue: 2650,
    pnl: 170,
    pnlPercent: 6.9,
  },
];

export default function PoolsPage() {
  const [selectedPool, setSelectedPool] = useState(pools[0]);
  const [activeTab, setActiveTab] = useState("swap");

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="border-b border-border/40 bg-card/30 backdrop-blur-sm py-8 md:py-12">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex gap-2 mb-4">
              <Badge
                variant="secondary"
                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              >
                <Droplets className="w-3.5 h-3.5 mr-2" />
                Automated Market Maker
              </Badge>
              <Badge
                variant="secondary"
                className="bg-amber-500/10 text-amber-500 border-amber-500/20"
              >
                Preview Data
              </Badge>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Carbon Liquidity Pools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Swap carbon credits instantly or provide liquidity to earn fees.
              Guardian NFT holders receive up to 20% fee discounts.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              { label: "Total TVL", value: "$9.5M" },
              { label: "24h Volume", value: "$545K" },
              { label: "Active Pools", value: "5" },
              { label: "Avg APY", value: "10.4%" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card/50 border border-border/50"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Pool List */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-emerald-500" />
                  All Pools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pool</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead className="text-right">TVL</TableHead>
                      <TableHead className="text-right">24h Volume</TableHead>
                      <TableHead className="text-right">APY</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools.map((pool) => (
                      <TableRow
                        key={pool.id}
                        className={`cursor-pointer transition-colors ${
                          selectedPool.id === pool.id
                            ? "bg-emerald-500/5"
                            : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedPool(pool)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20">
                              <pool.icon className="h-4 w-4 text-emerald-500" />
                            </div>
                            <div>
                              <p className="font-medium">{pool.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {pool.category}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${pool.tierColor} text-white border-0`}>
                            {pool.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          ${(pool.tvl / 1000000).toFixed(2)}M
                        </TableCell>
                        <TableCell className="text-right">
                          ${(pool.volume24h / 1000).toFixed(0)}K
                        </TableCell>
                        <TableCell className="text-right text-emerald-500 font-medium">
                          {pool.apy}%
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-medium">${pool.price.toFixed(2)}</p>
                            <p
                              className={`text-xs ${
                                pool.change >= 0
                                  ? "text-emerald-500"
                                  : "text-red-500"
                              }`}
                            >
                              {pool.change >= 0 ? "+" : ""}
                              {pool.change}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* User Positions */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-emerald-500" />
                  Your Positions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userPositions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pool</TableHead>
                        <TableHead className="text-right">LP Tokens</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">PnL</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userPositions.map((position) => (
                        <TableRow key={position.pool}>
                          <TableCell className="font-medium">
                            {position.pool}
                          </TableCell>
                          <TableCell className="text-right">
                            {position.lpTokens.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            ${position.currentValue.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="text-emerald-500">
                              +${position.pnl.toFixed(2)} (+{position.pnlPercent}%)
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Connect your wallet to view your positions
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Swap/Liquidity Panel */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Selected Pool Card */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div
                className={`p-4 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-b border-border/50`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <selectedPool.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedPool.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${selectedPool.tierColor} text-white border-0`}
                      >
                        {selectedPool.tier}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedPool.fee}% fee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">Carbon Reserve</p>
                    <p className="font-semibold">
                      {selectedPool.reserveCarbon.toLocaleString()} t
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-muted-foreground">USDC Reserve</p>
                    <p className="font-semibold">
                      ${selectedPool.reserveQuote.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-emerald-500/10">
                  <span className="text-muted-foreground">Est. APY</span>
                  <span className="font-bold text-emerald-500">
                    {selectedPool.apy}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Swap/Add Liquidity */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <Tabs defaultValue="swap" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b border-border/50">
                    <TabsTrigger value="swap" className="rounded-none">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Swap
                    </TabsTrigger>
                    <TabsTrigger value="liquidity" className="rounded-none">
                      <Plus className="h-4 w-4 mr-2" />
                      Liquidity
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="swap" className="p-4 space-y-4">
                    {/* From */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        From
                      </label>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex justify-between mb-2">
                          <input
                            type="number"
                            placeholder="0.0"
                            className="bg-transparent text-2xl font-medium w-full outline-none"
                          />
                          <Badge variant="secondary" className="gap-2">
                            <Droplets className="h-3 w-3" />
                            USDC
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balance: 5,000.00
                        </p>
                      </div>
                    </div>

                    {/* Swap Icon */}
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* To */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        To
                      </label>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex justify-between mb-2">
                          <input
                            type="number"
                            placeholder="0.0"
                            className="bg-transparent text-2xl font-medium w-full outline-none"
                            disabled
                          />
                          <Badge variant="secondary" className="gap-2">
                            <TreePine className="h-3 w-3" />
                            CARBON
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balance: 0.00
                        </p>
                      </div>
                    </div>

                    {/* Swap Details */}
                    <div className="p-3 rounded-lg bg-muted/30 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rate</span>
                        <span>1 CARBON = ${selectedPool.price.toFixed(2)} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Fee ({selectedPool.fee}%)
                        </span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          Guardian Discount
                          <Info className="h-3 w-3" />
                        </span>
                        <span className="text-emerald-500">-10%</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                      Swap
                    </Button>
                  </TabsContent>

                  <TabsContent value="liquidity" className="p-4 space-y-4">
                    {/* Carbon Input */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Carbon Credits
                      </label>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex justify-between mb-2">
                          <input
                            type="number"
                            placeholder="0"
                            className="bg-transparent text-2xl font-medium w-full outline-none"
                          />
                          <Badge variant="secondary" className="gap-2">
                            <TreePine className="h-3 w-3" />
                            CARBON
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balance: 250.00
                        </p>
                      </div>
                    </div>

                    {/* Plus Icon */}
                    <div className="flex justify-center">
                      <div className="p-2 rounded-full bg-muted/50">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    {/* USDC Input */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        USDC
                      </label>
                      <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                        <div className="flex justify-between mb-2">
                          <input
                            type="number"
                            placeholder="0.0"
                            className="bg-transparent text-2xl font-medium w-full outline-none"
                          />
                          <Badge variant="secondary" className="gap-2">
                            <Droplets className="h-3 w-3" />
                            USDC
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Balance: 5,000.00
                        </p>
                      </div>
                    </div>

                    {/* LP Info */}
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Est. LP Tokens
                        </span>
                        <span className="font-medium">0</span>
                      </div>
                      <div className="flex justify-between mt-2">
                        <span className="text-muted-foreground">Pool Share</span>
                        <span className="font-medium">0%</span>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                      Add Liquidity
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
