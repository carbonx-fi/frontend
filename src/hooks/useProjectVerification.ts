"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

// Contract address
const PROJECT_VERIFICATION_ADDRESS = "0x0A762a19e9b64caC0149EDbe2DE6D5c0165001Fe";

// Minimal ABI
const ProjectVerificationAbi = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "methodology", type: "string" },
      { name: "registry", type: "string" },
      { name: "registryId", type: "string" },
      { name: "location", type: "string" },
      { name: "category", type: "uint8" },
      { name: "vintage", type: "uint16" },
      { name: "estimatedCredits", type: "uint256" },
      { name: "documentationUri", type: "string" },
    ],
    name: "submitProject",
    outputs: [{ name: "taskId", type: "uint32" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "uint32" }],
    name: "getSubmission",
    outputs: [
      {
        components: [
          { name: "owner", type: "address" },
          { name: "name", type: "string" },
          { name: "methodology", type: "string" },
          { name: "registry", type: "string" },
          { name: "registryId", type: "string" },
          { name: "location", type: "string" },
          { name: "category", type: "uint8" },
          { name: "vintage", type: "uint16" },
          { name: "estimatedCredits", type: "uint256" },
          { name: "documentationUri", type: "string" },
          { name: "submittedBlock", type: "uint32" },
          { name: "status", type: "uint8" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "uint32" }],
    name: "getVerificationResult",
    outputs: [
      {
        components: [
          { name: "status", type: "uint8" },
          { name: "qualityScore", type: "uint8" },
          { name: "verifiedCredits", type: "uint256" },
          { name: "verifiedAt", type: "uint256" },
          { name: "verifiedBy", type: "address" },
          { name: "verificationUri", type: "string" },
          { name: "canMint", type: "bool" },
        ],
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "taskId", type: "uint32" }],
    name: "canMintTokens",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestTaskNum",
    outputs: [{ name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Enums
export enum ProjectCategory {
  FOREST = 0,
  OCEAN = 1,
  ENERGY = 2,
  WASTE = 3,
  COMMUNITY = 4,
  TECH = 5,
}

export enum VerificationStatus {
  PENDING = 0,
  BASIC = 1,
  STANDARD = 2,
  PREMIUM = 3,
  REJECTED = 4,
}

export const CategoryNames: Record<ProjectCategory, string> = {
  [ProjectCategory.FOREST]: "Forestry / REDD+",
  [ProjectCategory.OCEAN]: "Blue Carbon / Ocean",
  [ProjectCategory.ENERGY]: "Renewable Energy",
  [ProjectCategory.WASTE]: "Waste Management",
  [ProjectCategory.COMMUNITY]: "Community Projects",
  [ProjectCategory.TECH]: "Technology-based Removal",
};

export const VerificationStatusNames: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: "Pending Verification",
  [VerificationStatus.BASIC]: "Basic Verified",
  [VerificationStatus.STANDARD]: "Standard Verified",
  [VerificationStatus.PREMIUM]: "Premium Verified",
  [VerificationStatus.REJECTED]: "Rejected",
};

export interface ProjectSubmissionParams {
  name: string;
  methodology: string;
  registry: string;
  registryId: string;
  location: string;
  category: ProjectCategory;
  vintage: number;
  estimatedCredits: number; // in tonnes
  documentationUri: string;
}

const contractConfig = {
  address: PROJECT_VERIFICATION_ADDRESS as `0x${string}`,
  abi: ProjectVerificationAbi,
} as const;

export function useProjectVerification() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Get latest task number
  const { data: latestTaskNum, refetch: refetchLatestTask } = useReadContract({
    ...contractConfig,
    functionName: "latestTaskNum",
  });

  // Submit a new project for verification
  const submitProject = async (params: ProjectSubmissionParams) => {
    if (!isConnected) throw new Error("Wallet not connected");

    const creditsWei = parseEther(params.estimatedCredits.toString());

    writeContract({
      ...contractConfig,
      functionName: "submitProject",
      args: [
        params.name,
        params.methodology,
        params.registry,
        params.registryId,
        params.location,
        params.category,
        params.vintage,
        creditsWei,
        params.documentationUri,
      ],
    });
  };

  // Get submission details
  const useSubmission = (taskId: number | undefined) => {
    return useReadContract({
      ...contractConfig,
      functionName: "getSubmission",
      args: taskId !== undefined ? [taskId] : undefined,
      query: {
        enabled: taskId !== undefined,
      },
    });
  };

  // Get verification result
  const useVerificationResult = (taskId: number | undefined) => {
    return useReadContract({
      ...contractConfig,
      functionName: "getVerificationResult",
      args: taskId !== undefined ? [taskId] : undefined,
      query: {
        enabled: taskId !== undefined,
      },
    });
  };

  // Check if project can mint tokens
  const useCanMint = (taskId: number | undefined) => {
    return useReadContract({
      ...contractConfig,
      functionName: "canMintTokens",
      args: taskId !== undefined ? [taskId] : undefined,
      query: {
        enabled: taskId !== undefined,
      },
    });
  };

  return {
    // Data
    latestTaskNum: latestTaskNum as number | undefined,

    // Actions
    submitProject,
    refetchLatestTask,

    // Hooks for reading
    useSubmission,
    useVerificationResult,
    useCanMint,

    // Transaction state
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: writeError,

    // Constants
    CategoryNames,
    VerificationStatusNames,
    ProjectCategory,
    VerificationStatus,
  };
}
