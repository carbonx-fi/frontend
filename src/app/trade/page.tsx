"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Leaf,
  TreePine,
  Waves,
  Factory,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react";

const mockOrderBook = {
  bids: [
    { price: 24.50, quantity: 1250, total: 30625 },
    { price: 24.45, quantity: 850, total: 20782.5 },
    { price: 24.40, quantity: 2100, total: 51240 },
    { price: 24.35, quantity: 1800, total: 43830 },
    { price: 24.30, quantity: 3200, total: 77760 },
    { price: 24.25, quantity: 1500, total: 36375 },
  ],
  asks: [
    { price: 24.55, quantity: 980, total: 24059 },
    { price: 24.60, quantity: 1420, total: 34932 },
    { price: 24.65, quantity: 2300, total: 56695 },
    { price: 24.70, quantity: 1650, total: 40755 },
    { price: 24.75, quantity: 890, total: 22027.5 },
    { price: 24.80, quantity: 2800, total: 69440 },
  ],
};

const mockTrades = [
  { price: 24.52, quantity: 150, time: "12:45:32", side: "buy" },
  { price: 24.51, quantity: 320, time: "12:45:28", side: "sell" },
  { price: 24.53, quantity: 85, time: "12:45:15", side: "buy" },
  { price: 24.50, quantity: 500, time: "12:44:58", side: "buy" },
  { price: 24.48, quantity: 200, time: "12:44:45", side: "sell" },
  { price: 24.52, quantity: 175, time: "12:44:30", side: "buy" },
  { price: 24.49, quantity: 400, time: "12:44:12", side: "sell" },
  { price: 24.51, quantity: 250, time: "12:43:58", side: "buy" },
];

const markets = [
  { name: "Forest Credits", symbol: "FOREST", price: 24.52, change: 3.2, icon: TreePine },
  { name: "Ocean Credits", symbol: "OCEAN", price: 18.75, change: -1.5, icon: Waves },
  { name: "Energy Credits", symbol: "ENERGY", price: 31.20, change: 5.8, icon: Factory },
];

export default function TradePage() {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]);
  const [orderType, setOrderType] = useState<"limit" | "market">("limit");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [price, setPrice] = useState("24.52");
  const [quantity, setQuantity] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Market Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm">
        <div className="container px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Market Selector */}
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                  <selectedMarket.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold">{selectedMarket.name}</h1>
                    <Badge variant="secondary">{selectedMarket.symbol}/USDC</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-2xl font-bold">${selectedMarket.price.toFixed(2)}</span>
                    <span
                      className={`flex items-center ${
                        selectedMarket.change >= 0 ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {selectedMarket.change >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {selectedMarket.change >= 0 ? "+" : ""}
                      {selectedMarket.change}%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-muted-foreground">24h Volume</span>
                <p className="font-semibold">$2.4M</p>
              </div>
              <div>
                <span className="text-muted-foreground">24h High</span>
                <p className="font-semibold text-emerald-500">$25.80</p>
              </div>
              <div>
                <span className="text-muted-foreground">24h Low</span>
                <p className="font-semibold text-red-500">$23.15</p>
              </div>
              <div>
                <span className="text-muted-foreground">Open Interest</span>
                <p className="font-semibold">125,450 t</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Trading Interface */}
      <div className="container px-4 md:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-4 lg:gap-6 items-start">
          {/* Order Book */}
          <Card className="lg:col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-500" />
                Order Book
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              {/* Asks (Sells) */}
              <div className="px-4 space-y-1">
                <div className="grid grid-cols-3 text-xs text-muted-foreground pb-2">
                  <span>Price</span>
                  <span className="text-right">Qty</span>
                  <span className="text-right">Total</span>
                </div>
                {mockOrderBook.asks.slice().reverse().map((ask, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-3 text-sm relative group cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-red-500/10 rounded"
                      style={{ width: `${(ask.quantity / 3000) * 100}%` }}
                    />
                    <span className="relative text-red-500 font-medium">
                      ${ask.price.toFixed(2)}
                    </span>
                    <span className="relative text-right">{ask.quantity.toLocaleString()}</span>
                    <span className="relative text-right text-muted-foreground">
                      ${ask.total.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Spread */}
              <div className="px-4 py-3 my-2 bg-muted/30 text-center">
                <span className="text-lg font-bold text-emerald-500">$24.52</span>
                <span className="text-xs text-muted-foreground ml-2">Spread: $0.05 (0.20%)</span>
              </div>

              {/* Bids (Buys) */}
              <div className="px-4 space-y-1">
                {mockOrderBook.bids.map((bid, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="grid grid-cols-3 text-sm relative group cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 bg-emerald-500/10 rounded"
                      style={{ width: `${(bid.quantity / 3500) * 100}%` }}
                    />
                    <span className="relative text-emerald-500 font-medium">
                      ${bid.price.toFixed(2)}
                    </span>
                    <span className="relative text-right">{bid.quantity.toLocaleString()}</span>
                    <span className="relative text-right text-muted-foreground">
                      ${bid.total.toLocaleString()}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chart Placeholder + Order Entry */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-6">
            {/* Chart Placeholder */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="h-80 flex items-center justify-center bg-muted/20 rounded-xl border border-dashed border-border/50">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">TradingView Chart Integration</p>
                    <p className="text-xs">Coming Soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Entry */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Place Order</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="limit" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="limit" onClick={() => setOrderType("limit")}>
                      Limit
                    </TabsTrigger>
                    <TabsTrigger value="market" onClick={() => setOrderType("market")}>
                      Market
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="limit" className="space-y-4">
                    {/* Buy/Sell Toggle */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant={side === "buy" ? "default" : "outline"}
                        onClick={() => setSide("buy")}
                        className={
                          side === "buy"
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                            : ""
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Buy
                      </Button>
                      <Button
                        variant={side === "sell" ? "default" : "outline"}
                        onClick={() => setSide("sell")}
                        className={
                          side === "sell"
                            ? "bg-red-500 hover:bg-red-600 text-white"
                            : ""
                        }
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        Sell
                      </Button>
                    </div>

                    {/* Price Input */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Price (USDC)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full h-12 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                          placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          USDC
                        </span>
                      </div>
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">
                        Quantity (tonnes)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="w-full h-12 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                          tonnes
                        </span>
                      </div>
                    </div>

                    {/* Quick Percentages */}
                    <div className="flex gap-2">
                      {["25%", "50%", "75%", "100%"].map((pct) => (
                        <Button
                          key={pct}
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                        >
                          {pct}
                        </Button>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="p-4 rounded-xl bg-muted/30 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Order Value</span>
                        <span>${(parseFloat(price) * parseFloat(quantity || "0")).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Est. Fee (0.1%)</span>
                        <span>
                          ${((parseFloat(price) * parseFloat(quantity || "0")) * 0.001).toFixed(2)}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>
                          ${((parseFloat(price) * parseFloat(quantity || "0")) * 1.001).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      className={`w-full h-12 text-white ${
                        side === "buy"
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      {side === "buy" ? "Buy" : "Sell"} {selectedMarket.symbol}
                    </Button>
                  </TabsContent>

                  <TabsContent value="market" className="space-y-4">
                    <p className="text-center text-muted-foreground py-8">
                      Market orders execute at best available price
                    </p>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Trades + Markets */}
          <div className="lg:col-span-1 space-y-4 lg:space-y-6 lg:sticky lg:top-24">
            {/* Recent Trades */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-500" />
                  Recent Trades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-3 text-xs text-muted-foreground pb-2">
                    <span>Price</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Time</span>
                  </div>
                  {mockTrades.map((trade, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-3 text-sm"
                    >
                      <span
                        className={
                          trade.side === "buy" ? "text-emerald-500" : "text-red-500"
                        }
                      >
                        ${trade.price.toFixed(2)}
                      </span>
                      <span className="text-right">{trade.quantity}</span>
                      <span className="text-right text-muted-foreground">
                        {trade.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Markets */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Leaf className="h-4 w-4 text-emerald-500" />
                  Markets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {markets.map((market) => (
                    <motion.div
                      key={market.symbol}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedMarket(market)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        selectedMarket.symbol === market.symbol
                          ? "bg-emerald-500/10 border border-emerald-500/30"
                          : "bg-muted/30 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20">
                          <market.icon className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{market.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {market.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${market.price.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs ${
                            market.change >= 0
                              ? "text-emerald-500"
                              : "text-red-500"
                          }`}
                        >
                          {market.change >= 0 ? "+" : ""}
                          {market.change}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Open Orders */}
        <Card className="mt-6 border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" />
              Open Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Market</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Filled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No open orders. Connect your wallet to start trading.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
