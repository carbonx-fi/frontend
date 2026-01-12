"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Shield,
  TreePine,
  Sparkles,
  Trophy,
  Target,
  Zap,
  ChevronRight,
  Lock,
  Check,
  Flame,
  Gift,
  Waves,
  Cpu,
  Users,
  Bird,
  Loader2,
} from "lucide-react";
import {
  useGuardian,
  GuardianPath,
  GUARDIAN_PATH_NAMES,
  GUARDIAN_TIER_NAMES,
} from "@/hooks/useGuardian";
import { GuardianTier } from "@/config/contracts";

// Tier configuration with thresholds matching the contract
const tiers = [
  {
    tier: GuardianTier.COMMON,
    name: "Common",
    requirement: 0,
    discount: 2,
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-500",
    textColor: "text-gray-500",
  },
  {
    tier: GuardianTier.UNCOMMON,
    name: "Uncommon",
    requirement: 10,
    discount: 5,
    color: "from-green-400 to-green-600",
    bgColor: "bg-green-500",
    textColor: "text-green-500",
  },
  {
    tier: GuardianTier.RARE,
    name: "Rare",
    requirement: 50,
    discount: 10,
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  {
    tier: GuardianTier.EPIC,
    name: "Epic",
    requirement: 200,
    discount: 15,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-500",
    textColor: "text-purple-500",
  },
  {
    tier: GuardianTier.LEGENDARY,
    name: "Legendary",
    requirement: 500,
    discount: 20,
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-amber-500",
    textColor: "text-amber-500",
  },
];

// Path configuration with icons
const paths = [
  {
    path: GuardianPath.OCEAN,
    icon: Waves,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-500",
    description: "Protect marine ecosystems",
  },
  {
    path: GuardianPath.FOREST,
    icon: TreePine,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500",
    description: "Preserve forests worldwide",
  },
  {
    path: GuardianPath.ENERGY,
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-500",
    description: "Support clean energy",
  },
  {
    path: GuardianPath.TECH,
    icon: Cpu,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-500",
    description: "Fund green technology",
  },
  {
    path: GuardianPath.COMMUNITY,
    icon: Users,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-500",
    description: "Empower local communities",
  },
  {
    path: GuardianPath.WILDLIFE,
    icon: Bird,
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-500",
    description: "Save endangered species",
  },
];

const benefits = [
  {
    icon: Zap,
    title: "Trading Fee Discounts",
    description: "Up to 20% off all trading fees across CLOB and AMM",
  },
  {
    icon: Trophy,
    title: "Exclusive Leaderboard",
    description: "Compete with other Guardians for top positions",
  },
  {
    icon: Gift,
    title: "Airdrop Eligibility",
    description: "Priority access to future token distributions",
  },
  {
    icon: Sparkles,
    title: "Premium Features",
    description: "Early access to new features and markets",
  },
];

// Mock leaderboard (will be replaced with indexer data)
const mockLeaderboard = [
  { rank: 1, name: "EcoWarrior.eth", retired: 2450, tier: "Legendary" },
  { rank: 2, name: "GreenFuture", retired: 1820, tier: "Legendary" },
  { rank: 3, name: "CarbonKing", retired: 890, tier: "Legendary" },
  { rank: 4, name: "EarthProtector", retired: 456, tier: "Epic" },
  { rank: 5, name: "SustainableApe", retired: 312, tier: "Epic" },
];

export default function GuardianPage() {
  const { address, isConnected } = useAccount();
  const {
    guardianId,
    guardian,
    tierProgress,
    feeReduction,
    discount,
    hasGuardian,
    mintGuardian,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    refetch,
  } = useGuardian();

  const [showPathModal, setShowPathModal] = useState(false);
  const [selectedPath, setSelectedPath] = useState<GuardianPath | null>(null);

  // Get current tier configuration
  const currentTierConfig = guardian
    ? tiers.find((t) => t.tier === guardian.tier) || tiers[0]
    : tiers[0];

  const nextTierConfig = guardian
    ? tiers.find((t) => t.tier === (guardian.tier + 1))
    : tiers[1];

  // Format retired amount (stored as wei, display as tonnes)
  const userRetired = guardian
    ? Number(formatEther(guardian.totalRetired))
    : 0;

  // Calculate progress to next tier
  const progress = tierProgress
    ? Number(tierProgress.progress)
    : 0;

  // Handle mint
  const handleMint = async () => {
    if (selectedPath === null) return;
    try {
      await mintGuardian(selectedPath);
      setShowPathModal(false);
    } catch (e) {
      console.error("Mint failed:", e);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden hero-gradient">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              <Shield className="w-3.5 h-3.5 mr-2" />
              Soulbound NFT
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Become a Climate{" "}
              <span className="gradient-text">Guardian</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Mint your free Guardian NFT and unlock exclusive benefits.
              Retire carbon credits to level up your tier and increase your discounts.
            </p>
            {!isConnected ? (
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25"
                disabled
              >
                Connect Wallet to Mint
              </Button>
            ) : !hasGuardian ? (
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25"
                onClick={() => setShowPathModal(true)}
                disabled={isPending || isConfirming}
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {isPending ? "Confirm in Wallet..." : "Minting..."}
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Mint Your Guardian (Free)
                  </>
                )}
              </Button>
            ) : null}
          </motion.div>
        </div>
      </section>

      <div className="container px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User's Guardian Card */}
            {isConnected && hasGuardian && guardian && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 min-h-[320px]">
                      {/* NFT Display */}
                      <div
                        className={`p-6 md:p-8 bg-gradient-to-br ${currentTierConfig.color} relative overflow-hidden flex items-center justify-center`}
                      >
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="relative flex flex-col items-center justify-center text-white">
                          <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="p-5 md:p-6 rounded-full bg-white/20 backdrop-blur-sm mb-4"
                          >
                            <Shield className="h-12 w-12 md:h-16 md:w-16" />
                          </motion.div>
                          <h2 className="text-xl md:text-2xl font-bold mb-1">
                            {guardian.nickname || "Climate Guardian"}
                          </h2>
                          <Badge className="bg-white/20 text-white border-0 mb-2">
                            {GUARDIAN_TIER_NAMES[guardian.tier]}
                          </Badge>
                          <p className="text-sm text-white/80">
                            Path: {GUARDIAN_PATH_NAMES[guardian.path]}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="p-6 md:p-8 space-y-5 flex flex-col justify-center">
                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">
                            Total Carbon Retired
                          </h3>
                          <p className="text-3xl font-bold">
                            {userRetired.toLocaleString(undefined, {
                              maximumFractionDigits: 2,
                            })}{" "}
                            <span className="text-lg text-muted-foreground">tonnes</span>
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm text-muted-foreground mb-1">
                            Current Fee Discount
                          </h3>
                          <p className={`text-3xl font-bold ${currentTierConfig.textColor}`}>
                            {discount ?? currentTierConfig.discount}%
                          </p>
                        </div>

                        {nextTierConfig && tierProgress && (
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="text-muted-foreground">
                                Progress to {nextTierConfig.name}
                              </span>
                              <span className="font-medium">
                                {progress.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={progress} className="h-3" />
                            <p className="text-xs text-muted-foreground mt-2">
                              {Number(formatEther(tierProgress.amountToNext)).toLocaleString(
                                undefined,
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              more tonnes to unlock {nextTierConfig.discount}% discount
                            </p>
                          </div>
                        )}

                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                          onClick={() => (window.location.href = "/trade")}
                        >
                          <Flame className="h-4 w-4 mr-2" />
                          Retire Carbon to Level Up
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* No Guardian - Show CTA */}
            {isConnected && !hasGuardian && (
              <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-full bg-emerald-500/10 w-fit mx-auto mb-4">
                    <Shield className="h-12 w-12 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Guardian Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Mint your free Guardian NFT to start earning discounts and tracking
                    your climate impact.
                  </p>
                  <Button
                    className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    onClick={() => setShowPathModal(true)}
                    disabled={isPending || isConfirming}
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isPending ? "Confirm in Wallet..." : "Minting..."}
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        Choose Your Path
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Tier Progression */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-500" />
                  Tier Progression
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-6">
                <div className="relative pt-2">
                  {/* Progress Line */}
                  <div className="absolute top-[26px] left-[24px] right-[24px] h-1 bg-muted/50 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          guardian
                            ? (guardian.tier / (tiers.length - 1)) * 100
                            : 0
                        }%`,
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                    />
                  </div>

                  {/* Tier Nodes */}
                  <div className="flex justify-between relative px-0">
                    {tiers.map((tier, index) => {
                      const isActive = guardian ? index <= guardian.tier : false;
                      const isCurrent = guardian ? index === guardian.tier : false;

                      return (
                        <motion.div
                          key={tier.name}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex flex-col items-center w-16 md:w-20"
                        >
                          <div
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative z-10 ${
                              isActive
                                ? `bg-gradient-to-br ${tier.color}`
                                : "bg-muted"
                            } ${isCurrent ? "ring-4 ring-emerald-500/30" : ""}`}
                          >
                            {isActive ? (
                              <Check className="h-4 w-4 md:h-5 md:w-5 text-white" />
                            ) : (
                              <Lock className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                            )}
                          </div>
                          <p
                            className={`mt-2 text-xs md:text-sm font-medium text-center ${
                              isActive ? "text-foreground" : "text-muted-foreground"
                            }`}
                          >
                            {tier.name}
                          </p>
                          <p className="text-[10px] md:text-xs text-muted-foreground">
                            {tier.requirement}t
                          </p>
                          <Badge
                            variant={isActive ? "default" : "secondary"}
                            className={`mt-1 text-[10px] md:text-xs px-1.5 md:px-2 ${
                              isActive
                                ? `bg-gradient-to-r ${tier.color} text-white border-0`
                                : ""
                            }`}
                          >
                            {tier.discount}% off
                          </Badge>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-emerald-500" />
                  Guardian Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-4 p-4 rounded-xl bg-muted/30"
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 h-fit">
                        <benefit.icon className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {benefit.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* Leaderboard */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Top Guardians
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {mockLeaderboard.map((user, index) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/30"
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                          index === 0
                            ? "bg-amber-500 text-amber-950"
                            : index === 1
                            ? "bg-gray-300 text-gray-700"
                            : index === 2
                            ? "bg-amber-700 text-amber-100"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {user.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.retired.toLocaleString()}t retired
                        </p>
                      </div>
                      <Badge
                        className={`text-xs flex-shrink-0 ${
                          user.tier === "Legendary"
                            ? "bg-amber-500 text-amber-950"
                            : "bg-purple-500 text-white"
                        } border-0`}
                      >
                        {user.tier}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 gap-2">
                  View Full Leaderboard
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TreePine className="h-5 w-5 text-emerald-500" />
                  Global Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground">Total Guardians</p>
                  <p className="text-xl font-bold">12,450</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    Carbon Retired by Guardians
                  </p>
                  <p className="text-xl font-bold text-emerald-500">
                    2.5M tonnes
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-muted/30">
                  <p className="text-xs text-muted-foreground">Legendary Guardians</p>
                  <p className="text-xl font-bold text-amber-500">245</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Path Selection Modal */}
      <Dialog open={showPathModal} onOpenChange={setShowPathModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Choose Your Guardian Path</DialogTitle>
            <DialogDescription>
              Select a cause that resonates with you. This determines which
              environmental zone you&apos;ll help restore in the Sanctuary.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            {paths.map((p) => {
              const PathIcon = p.icon;
              const isSelected = selectedPath === p.path;

              return (
                <motion.button
                  key={p.path}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPath(p.path)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-border hover:border-emerald-500/50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg bg-gradient-to-br ${p.color} w-fit mb-2`}
                  >
                    <PathIcon className="h-5 w-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm">
                    {GUARDIAN_PATH_NAMES[p.path]}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {p.description}
                  </p>
                </motion.button>
              );
            })}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowPathModal(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
              disabled={selectedPath === null || isPending || isConfirming}
              onClick={handleMint}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isPending ? "Confirm..." : "Minting..."}
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  Mint Guardian
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
