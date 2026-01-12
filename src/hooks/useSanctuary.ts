"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { GuardianPath, GUARDIAN_PATH_NAMES } from "./useGuardian";

// Zone health states
export enum ZoneHealth {
  DEAD = 0,
  STRUGGLING = 1,
  GROWING = 2,
  THRIVING = 3,
}

export const ZONE_HEALTH_NAMES: Record<ZoneHealth, string> = {
  [ZoneHealth.DEAD]: "Dead",
  [ZoneHealth.STRUGGLING]: "Struggling",
  [ZoneHealth.GROWING]: "Growing",
  [ZoneHealth.THRIVING]: "Thriving",
};

// Zone health thresholds (total tonnes retired globally)
const ZONE_THRESHOLDS = {
  STRUGGLING: 100, // 100 tonnes
  GROWING: 1000, // 1,000 tonnes
  THRIVING: 10000, // 10,000 tonnes
};

export interface ZoneState {
  path: GuardianPath;
  name: string;
  health: ZoneHealth;
  healthName: string;
  totalRetired: number; // in tonnes
  healthPercentage: number; // 0-100
  contributors: number;
}

export interface LeaderboardEntry {
  rank: number;
  address: string;
  totalRetired: number;
  path: GuardianPath | null;
  tier: number;
}

// Mock data for now - in production this would come from the indexer/GraphQL
const MOCK_ZONE_DATA: Record<GuardianPath, { totalRetired: number; contributors: number }> = {
  [GuardianPath.OCEAN]: { totalRetired: 1250, contributors: 45 },
  [GuardianPath.FOREST]: { totalRetired: 3500, contributors: 120 },
  [GuardianPath.ENERGY]: { totalRetired: 2100, contributors: 78 },
  [GuardianPath.TECH]: { totalRetired: 800, contributors: 32 },
  [GuardianPath.COMMUNITY]: { totalRetired: 2800, contributors: 95 },
  [GuardianPath.WILDLIFE]: { totalRetired: 1500, contributors: 52 },
};

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: "0x1234...abcd", totalRetired: 150, path: GuardianPath.FOREST, tier: 4 },
  { rank: 2, address: "0x2345...bcde", totalRetired: 120, path: GuardianPath.OCEAN, tier: 3 },
  { rank: 3, address: "0x3456...cdef", totalRetired: 95, path: GuardianPath.COMMUNITY, tier: 3 },
  { rank: 4, address: "0x4567...def0", totalRetired: 80, path: GuardianPath.ENERGY, tier: 2 },
  { rank: 5, address: "0x5678...ef01", totalRetired: 65, path: GuardianPath.TECH, tier: 2 },
  { rank: 6, address: "0x6789...f012", totalRetired: 55, path: GuardianPath.WILDLIFE, tier: 2 },
  { rank: 7, address: "0x789a...0123", totalRetired: 45, path: GuardianPath.FOREST, tier: 1 },
  { rank: 8, address: "0x89ab...1234", totalRetired: 35, path: GuardianPath.OCEAN, tier: 1 },
  { rank: 9, address: "0x9abc...2345", totalRetired: 25, path: GuardianPath.COMMUNITY, tier: 1 },
  { rank: 10, address: "0xabcd...3456", totalRetired: 15, path: GuardianPath.ENERGY, tier: 0 },
];

function calculateHealth(totalRetired: number): ZoneHealth {
  if (totalRetired >= ZONE_THRESHOLDS.THRIVING) return ZoneHealth.THRIVING;
  if (totalRetired >= ZONE_THRESHOLDS.GROWING) return ZoneHealth.GROWING;
  if (totalRetired >= ZONE_THRESHOLDS.STRUGGLING) return ZoneHealth.STRUGGLING;
  return ZoneHealth.DEAD;
}

function calculateHealthPercentage(totalRetired: number, health: ZoneHealth): number {
  switch (health) {
    case ZoneHealth.DEAD:
      return Math.min(100, (totalRetired / ZONE_THRESHOLDS.STRUGGLING) * 100);
    case ZoneHealth.STRUGGLING:
      return Math.min(100, ((totalRetired - ZONE_THRESHOLDS.STRUGGLING) / (ZONE_THRESHOLDS.GROWING - ZONE_THRESHOLDS.STRUGGLING)) * 100);
    case ZoneHealth.GROWING:
      return Math.min(100, ((totalRetired - ZONE_THRESHOLDS.GROWING) / (ZONE_THRESHOLDS.THRIVING - ZONE_THRESHOLDS.GROWING)) * 100);
    case ZoneHealth.THRIVING:
      return 100;
  }
}

export function useSanctuary() {
  const { address } = useAccount();
  const [zones, setZones] = useState<ZoneState[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState<GuardianPath | null>(null);

  // Calculate zone states from data
  const calculateZoneStates = useCallback(() => {
    const zoneStates: ZoneState[] = Object.entries(MOCK_ZONE_DATA).map(([pathStr, data]) => {
      const path = parseInt(pathStr) as GuardianPath;
      const health = calculateHealth(data.totalRetired);

      return {
        path,
        name: GUARDIAN_PATH_NAMES[path],
        health,
        healthName: ZONE_HEALTH_NAMES[health],
        totalRetired: data.totalRetired,
        healthPercentage: calculateHealthPercentage(data.totalRetired, health),
        contributors: data.contributors,
      };
    });

    return zoneStates;
  }, []);

  // Load sanctuary data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // In production, this would fetch from GraphQL/indexer
      // For now, use mock data
      const zoneStates = calculateZoneStates();
      setZones(zoneStates);
      setLeaderboard(MOCK_LEADERBOARD);

      // Mock user rank
      if (address) {
        // Random rank for demo purposes
        setUserRank(Math.floor(Math.random() * 100) + 11);
      }

      setIsLoading(false);
    };

    loadData();
  }, [address, calculateZoneStates]);

  // Get total retired across all zones
  const totalGlobalRetired = zones.reduce((sum, zone) => sum + zone.totalRetired, 0);

  // Get zone by path
  const getZone = (path: GuardianPath): ZoneState | undefined => {
    return zones.find((z) => z.path === path);
  };

  // Trigger animation when retirement happens
  const triggerRetirementAnimation = (path: GuardianPath, amount: number) => {
    // This would trigger particle effects in the UI
    console.log(`Retirement animation triggered: ${amount} tonnes in ${GUARDIAN_PATH_NAMES[path]}`);

    // Update zone state locally (optimistic update)
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.path === path) {
          const newTotal = zone.totalRetired + amount;
          const newHealth = calculateHealth(newTotal);
          return {
            ...zone,
            totalRetired: newTotal,
            health: newHealth,
            healthName: ZONE_HEALTH_NAMES[newHealth],
            healthPercentage: calculateHealthPercentage(newTotal, newHealth),
          };
        }
        return zone;
      })
    );
  };

  return {
    // Data
    zones,
    leaderboard,
    userRank,
    totalGlobalRetired,
    selectedZone,
    isLoading,

    // Actions
    setSelectedZone,
    getZone,
    triggerRetirementAnimation,

    // Constants
    thresholds: ZONE_THRESHOLDS,
  };
}
