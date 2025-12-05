// Contract addresses deployed on Mantle Sepolia (Chain 5003)
export const CONTRACTS = {
  CARBON_CREDIT_TOKEN: "0xc4CebF58836707611439e23996f4FA4165Ea6A28" as const,
  GUARDIAN_NFT: "0xE1349D2c44422b70C73BF767AFB58ae1C59cd1Fd" as const,
  CARBON_ORDER_BOOK: "0xc8d6B960CFe734452f2468A2E0a654C5C25Bb6b1" as const,
  CARBON_BALANCE_MANAGER: "0xaACee6478D299EbaEF28667A601Bce22eABD5015" as const,
  KYC_SERVICE_MANAGER: "0xbDe5421D508C781c401E2af2101D74A23E39cBd6" as const,
  CARBON_POOL_FACTORY: "0xAECB3a3a5b32161c77a67Fe5E1Ed89dDF0FC0884" as const,
  MOCK_USDC: "0xBe871f9a85330BD95ff3Bcdd7AF57da4282cfD3e" as const,
} as const;

// Pool addresses (dynamically created by factory)
export const POOLS = {
  FOREST_2024: "0xF1E03c6A05c3b8C97e7249A5e988de3ca0041aE0" as const,
} as const;

// Chain configuration
export const CHAIN_CONFIG = {
  id: 5003,
  name: "Mantle Sepolia",
  rpcUrl: "https://rpc.sepolia.mantle.xyz",
  blockExplorer: "https://sepolia.mantlescan.xyz",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
} as const;

// Carbon categories
export enum CarbonCategory {
  FOREST = 0,
  OCEAN = 1,
  ENERGY = 2,
  WASTE = 3,
  COMMUNITY = 4,
  TECH = 5,
}

// Guardian tiers
export enum GuardianTier {
  COMMON = 0,
  UNCOMMON = 1,
  RARE = 2,
  EPIC = 3,
  LEGENDARY = 4,
}

// Tier thresholds (in tonnes, readable format)
export const TIER_THRESHOLDS = {
  [GuardianTier.COMMON]: 0,
  [GuardianTier.UNCOMMON]: 10, // 10 tonnes
  [GuardianTier.RARE]: 50, // 50 tonnes
  [GuardianTier.EPIC]: 200, // 200 tonnes
  [GuardianTier.LEGENDARY]: 500, // 500 tonnes
} as const;

// Tier discounts (in basis points)
export const TIER_DISCOUNTS = {
  [GuardianTier.COMMON]: 200, // 2%
  [GuardianTier.UNCOMMON]: 500, // 5%
  [GuardianTier.RARE]: 1000, // 10%
  [GuardianTier.EPIC]: 1500, // 15%
  [GuardianTier.LEGENDARY]: 2000, // 20%
} as const;

// Pool tiers
export enum PoolTier {
  BASIC = 0,
  STANDARD = 1,
  PREMIUM = 2,
}

// Pool fee rates (in basis points)
export const POOL_FEES = {
  [PoolTier.BASIC]: 20, // 0.2%
  [PoolTier.STANDARD]: 30, // 0.3%
  [PoolTier.PREMIUM]: 50, // 0.5%
} as const;

// KYC levels
export enum KYCLevel {
  NONE = 0,
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  ACCREDITED = 4,
}

// Order book constants
export const ORDER_BOOK = {
  MIN_ORDER_SIZE: 100, // $100 minimum
  MIN_PRICE_MOVEMENT: 0.001, // 0.001 USDC
  DEFAULT_EXPIRY_DAYS: 30,
  MAKER_FEE_BPS: 10, // 0.1%
  TAKER_FEE_BPS: 30, // 0.3%
} as const;
