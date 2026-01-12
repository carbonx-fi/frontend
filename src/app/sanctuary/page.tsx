"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Waves,
  TreePine,
  Zap,
  Cpu,
  Users,
  Bird,
  Shield,
  TrendingUp,
  Sparkles,
  Trophy,
  Leaf,
  Share2,
  Play,
} from "lucide-react";
import {
  useSanctuary,
  ZoneHealth,
  ZONE_HEALTH_NAMES,
} from "@/hooks/useSanctuary";
import { GuardianPath, GUARDIAN_PATH_NAMES, GUARDIAN_TIER_NAMES } from "@/hooks/useGuardian";

// Particle type for animations
interface ParticleData {
  id: number;
  x: number;
  y: number;
  color: string;
  zone: GuardianPath;
}

// Zone configurations with colors and icons
const ZONE_CONFIG = {
  [GuardianPath.OCEAN]: {
    icon: Waves,
    color: "from-blue-400 to-cyan-500",
    bgColor: "bg-blue-500",
    textColor: "text-blue-400",
    glowColor: "shadow-blue-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-blue-900",
      [ZoneHealth.GROWING]: "bg-blue-600",
      [ZoneHealth.THRIVING]: "bg-blue-400",
    },
  },
  [GuardianPath.FOREST]: {
    icon: TreePine,
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-500",
    textColor: "text-green-400",
    glowColor: "shadow-green-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-green-900",
      [ZoneHealth.GROWING]: "bg-green-600",
      [ZoneHealth.THRIVING]: "bg-green-400",
    },
  },
  [GuardianPath.ENERGY]: {
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-400",
    glowColor: "shadow-yellow-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-yellow-900",
      [ZoneHealth.GROWING]: "bg-yellow-600",
      [ZoneHealth.THRIVING]: "bg-yellow-400",
    },
  },
  [GuardianPath.TECH]: {
    icon: Cpu,
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-500",
    textColor: "text-purple-400",
    glowColor: "shadow-purple-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-purple-900",
      [ZoneHealth.GROWING]: "bg-purple-600",
      [ZoneHealth.THRIVING]: "bg-purple-400",
    },
  },
  [GuardianPath.COMMUNITY]: {
    icon: Users,
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-500",
    textColor: "text-pink-400",
    glowColor: "shadow-pink-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-pink-900",
      [ZoneHealth.GROWING]: "bg-pink-600",
      [ZoneHealth.THRIVING]: "bg-pink-400",
    },
  },
  [GuardianPath.WILDLIFE]: {
    icon: Bird,
    color: "from-amber-400 to-orange-500",
    bgColor: "bg-amber-500",
    textColor: "text-amber-400",
    glowColor: "shadow-amber-500/50",
    healthColors: {
      [ZoneHealth.DEAD]: "bg-gray-800",
      [ZoneHealth.STRUGGLING]: "bg-amber-900",
      [ZoneHealth.GROWING]: "bg-amber-600",
      [ZoneHealth.THRIVING]: "bg-amber-400",
    },
  },
};

// Particle component for retirement effects
function Particle({
  x,
  y,
  color,
  onComplete,
}: {
  x: number;
  y: number;
  color: string;
  onComplete: () => void;
}) {
  // Random offsets for more organic motion
  const randomX = Math.random() * 60 - 30;
  const randomDuration = 1.2 + Math.random() * 0.8;

  return (
    <motion.div
      className={`absolute w-3 h-3 rounded-full ${color} pointer-events-none`}
      style={{ left: x, top: y }}
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        y: -120 - Math.random() * 60,
        x: randomX,
        opacity: 0,
        scale: 0.3,
      }}
      transition={{ duration: randomDuration, ease: "easeOut" }}
      onAnimationComplete={onComplete}
    />
  );
}

// Floating spark component for ambient effects
function FloatingSpark({ color }: { color: string }) {
  const randomX = Math.random() * 100;
  const randomDelay = Math.random() * 2;

  return (
    <motion.div
      className={`absolute w-1 h-1 rounded-full ${color} opacity-60`}
      style={{ left: `${randomX}%`, bottom: 0 }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: -200,
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration: 3,
        delay: randomDelay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    />
  );
}

// Zone hex component
const ZoneHex = ({
  zone,
  isSelected,
  onClick,
  onRef,
}: {
  zone: {
    path: GuardianPath;
    name: string;
    health: ZoneHealth;
    healthName: string;
    totalRetired: number;
    healthPercentage: number;
    contributors: number;
  };
  isSelected: boolean;
  onClick: () => void;
  onRef?: (el: HTMLDivElement | null) => void;
}) => {
  const config = ZONE_CONFIG[zone.path];
  const ZoneIcon = config.icon;

  return (
    <motion.div
      ref={onRef}
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected ? "scale-110 z-10" : "hover:scale-105"
      }`}
      onClick={onClick}
      whileHover={{ scale: isSelected ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Glow effect for thriving zones */}
      {zone.health === ZoneHealth.THRIVING && (
        <div
          className={`absolute inset-0 rounded-2xl blur-xl opacity-50 ${config.bgColor} animate-pulse`}
        />
      )}

      <div
        className={`relative w-32 h-32 md:w-40 md:h-40 rounded-2xl border-2 ${
          isSelected
            ? `border-white ${config.glowColor} shadow-lg`
            : "border-border/50"
        } ${config.healthColors[zone.health]} transition-all duration-500 flex flex-col items-center justify-center p-4`}
      >
        {/* Zone icon */}
        <div
          className={`p-3 rounded-xl bg-gradient-to-br ${config.color} mb-2`}
        >
          <ZoneIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </div>

        {/* Zone name */}
        <h3 className="font-bold text-sm md:text-base text-white">{zone.name}</h3>

        {/* Health indicator */}
        <Badge
          className={`mt-1 text-xs ${
            zone.health === ZoneHealth.THRIVING
              ? "bg-emerald-500 text-white"
              : zone.health === ZoneHealth.GROWING
              ? "bg-blue-500 text-white"
              : zone.health === ZoneHealth.STRUGGLING
              ? "bg-amber-500 text-white"
              : "bg-gray-600 text-white"
          }`}
        >
          {zone.healthName}
        </Badge>

        {/* Progress ring */}
        <div className="absolute -bottom-1 -right-1 w-10 h-10">
          <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-700"
            />
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${zone.healthPercentage} ${100 - zone.healthPercentage}`}
              className={config.textColor}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
            {Math.round(zone.healthPercentage)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SanctuaryPage() {
  const { isConnected } = useAccount();
  const {
    zones,
    leaderboard,
    userRank,
    totalGlobalRetired,
    selectedZone,
    setSelectedZone,
    getZone,
    isLoading,
    triggerRetirementAnimation,
  } = useSanctuary();

  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [particleIdCounter, setParticleIdCounter] = useState(0);
  const zoneRefs = useRef<Map<GuardianPath, HTMLDivElement | null>>(new Map());

  const selectedZoneData = selectedZone !== null ? getZone(selectedZone) : null;

  // Spawn particles at a zone location
  const spawnParticles = useCallback(
    (zone: GuardianPath, count: number = 15) => {
      const zoneEl = zoneRefs.current.get(zone);
      if (!zoneEl) return;

      const rect = zoneEl.getBoundingClientRect();
      const config = ZONE_CONFIG[zone];
      const newParticles: ParticleData[] = [];

      for (let i = 0; i < count; i++) {
        newParticles.push({
          id: particleIdCounter + i,
          x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
          y: rect.top + rect.height / 2,
          color: config.bgColor,
          zone,
        });
      }

      setParticleIdCounter((prev) => prev + count);
      setParticles((prev) => [...prev, ...newParticles]);
    },
    [particleIdCounter]
  );

  // Remove particle when animation completes
  const removeParticle = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // Demo: trigger retirement animation on selected zone
  const handleDemoRetirement = () => {
    const targetZone = selectedZone ?? GuardianPath.FOREST;
    spawnParticles(targetZone, 20);
    triggerRetirementAnimation(targetZone, 10); // Mock 10 tonnes
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden hero-gradient">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge
              variant="secondary"
              className="mb-4 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              <Leaf className="w-3.5 h-3.5 mr-2" />
              Earth Sanctuary
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Restore the{" "}
              <span className="gradient-text">Planet Together</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Watch your impact come to life. Every tonne of carbon retired heals
              one of six environmental zones. Join Guardians worldwide in
              restoring our Earth.
            </p>

            {/* Global stats */}
            <div className="flex justify-center gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-emerald-500">
                  {totalGlobalRetired.toLocaleString()}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Tonnes Retired</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">
                  {zones.reduce((sum, z) => sum + z.contributors, 0)}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Guardians</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold">
                  {zones.filter((z) => z.health === ZoneHealth.THRIVING).length}/6
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">Thriving Zones</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Sanctuary Canvas */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-6">
                {/* Zone Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 place-items-center min-h-[400px]">
                  <AnimatePresence>
                    {zones.map((zone, index) => (
                      <motion.div
                        key={zone.path}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ZoneHex
                          zone={zone}
                          isSelected={selectedZone === zone.path}
                          onClick={() =>
                            setSelectedZone(
                              selectedZone === zone.path ? null : zone.path
                            )
                          }
                          onRef={(el) => zoneRefs.current.set(zone.path, el)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Selected Zone Details */}
                <AnimatePresence>
                  {selectedZoneData && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-border/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {(() => {
                            const config = ZONE_CONFIG[selectedZoneData.path];
                            const ZoneIcon = config.icon;
                            return (
                              <>
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}
                                >
                                  <ZoneIcon className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold">
                                    {selectedZoneData.name} Zone
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {selectedZoneData.healthName} -{" "}
                                    {selectedZoneData.contributors} contributors
                                  </p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                        <Badge
                          className={
                            selectedZoneData.health === ZoneHealth.THRIVING
                              ? "bg-emerald-500"
                              : ""
                          }
                        >
                          {selectedZoneData.totalRetired.toLocaleString()} tonnes
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress to{" "}
                            {selectedZoneData.health < ZoneHealth.THRIVING
                              ? ZONE_HEALTH_NAMES[(selectedZoneData.health + 1) as ZoneHealth]
                              : "Max Level"}
                          </span>
                          <span className="font-medium">
                            {selectedZoneData.healthPercentage.toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={selectedZoneData.healthPercentage}
                          className="h-2"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Top Guardians
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.slice(0, 5).map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      entry.rank <= 3 ? "bg-muted/50" : ""
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1
                          ? "bg-amber-500 text-white"
                          : entry.rank === 2
                          ? "bg-gray-400 text-white"
                          : entry.rank === 3
                          ? "bg-amber-700 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {entry.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {entry.address}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {entry.path !== null
                          ? GUARDIAN_PATH_NAMES[entry.path]
                          : "No Path"}{" "}
                        - {GUARDIAN_TIER_NAMES[entry.tier as 0 | 1 | 2 | 3 | 4]}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {entry.totalRetired}t
                    </Badge>
                  </div>
                ))}

                {userRank && (
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Rank</span>
                      <span className="font-bold">#{userRank}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Zone Stats */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Zone Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {zones.map((zone) => {
                  const config = ZONE_CONFIG[zone.path];
                  const ZoneIcon = config.icon;

                  return (
                    <div
                      key={zone.path}
                      className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded-lg transition-colors"
                      onClick={() => setSelectedZone(zone.path)}
                    >
                      <div className={`p-1.5 rounded-lg ${config.bgColor}/20`}>
                        <ZoneIcon className={`h-4 w-4 ${config.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{zone.name}</span>
                          <span className={config.textColor}>
                            {zone.totalRetired.toLocaleString()}t
                          </span>
                        </div>
                        <Progress
                          value={zone.healthPercentage}
                          className="h-1 mt-1"
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 gap-2" variant="outline">
                <Share2 className="h-4 w-4" />
                Share Your Impact
              </Button>
              <Button
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                onClick={handleDemoRetirement}
              >
                <Play className="h-4 w-4" />
                Demo Retirement
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Particle Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {particles.map((particle) => (
            <Particle
              key={particle.id}
              x={particle.x}
              y={particle.y}
              color={particle.color}
              onComplete={() => removeParticle(particle.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
