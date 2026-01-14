"use client";

import { useReadContract, useReadContracts } from "wagmi";

// Contract address
const PROJECT_VERIFICATION_ADDRESS = "0x0A762a19e9b64caC0149EDbe2DE6D5c0165001Fe";

// ABI for reading submissions
const ProjectVerificationAbi = [
  {
    inputs: [],
    name: "latestTaskNum",
    outputs: [{ name: "", type: "uint32" }],
    stateMutability: "view",
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
  [ProjectCategory.OCEAN]: "Blue Carbon",
  [ProjectCategory.ENERGY]: "Renewable Energy",
  [ProjectCategory.WASTE]: "Waste Management",
  [ProjectCategory.COMMUNITY]: "Community",
  [ProjectCategory.TECH]: "Tech Removal",
};

export const VerificationStatusNames: Record<VerificationStatus, string> = {
  [VerificationStatus.PENDING]: "Pending",
  [VerificationStatus.BASIC]: "Basic",
  [VerificationStatus.STANDARD]: "Standard",
  [VerificationStatus.PREMIUM]: "Premium",
  [VerificationStatus.REJECTED]: "Rejected",
};

export interface Project {
  taskId: number;
  owner: string;
  name: string;
  methodology: string;
  registry: string;
  registryId: string;
  location: string;
  category: ProjectCategory;
  vintage: number;
  estimatedCredits: bigint;
  documentationUri: string;
  submittedBlock: number;
  status: VerificationStatus;
  qualityScore?: number;
  verifiedCredits?: bigint;
  canMint?: boolean;
}

const contractConfig = {
  address: PROJECT_VERIFICATION_ADDRESS as `0x${string}`,
  abi: ProjectVerificationAbi,
} as const;

export function useProjects() {
  // Get total number of tasks
  const { data: latestTaskNum, isLoading: isLoadingCount } = useReadContract({
    ...contractConfig,
    functionName: "latestTaskNum",
  });

  const taskCount = latestTaskNum ? Number(latestTaskNum) : 0;

  // Build array of contract calls to fetch all submissions
  const submissionCalls = taskCount > 0
    ? Array.from({ length: taskCount }, (_, i) => ({
        ...contractConfig,
        functionName: "getSubmission" as const,
        args: [i + 1] as [number],
      }))
    : [];

  const verificationCalls = taskCount > 0
    ? Array.from({ length: taskCount }, (_, i) => ({
        ...contractConfig,
        functionName: "getVerificationResult" as const,
        args: [i + 1] as [number],
      }))
    : [];

  // Fetch all submissions
  const { data: submissions, isLoading: isLoadingSubmissions } = useReadContracts({
    contracts: submissionCalls,
    query: {
      enabled: taskCount > 0,
    },
  });

  // Fetch all verification results
  const { data: verifications, isLoading: isLoadingVerifications } = useReadContracts({
    contracts: verificationCalls,
    query: {
      enabled: taskCount > 0,
    },
  });

  // Combine data into Project objects
  const projects: Project[] = [];

  if (submissions && verifications) {
    for (let i = 0; i < submissions.length; i++) {
      const sub = submissions[i];
      const ver = verifications[i];

      if (sub.status === "success" && sub.result) {
        const s = sub.result as {
          owner: string;
          name: string;
          methodology: string;
          registry: string;
          registryId: string;
          location: string;
          category: number;
          vintage: number;
          estimatedCredits: bigint;
          documentationUri: string;
          submittedBlock: number;
          status: number;
        };

        const project: Project = {
          taskId: i + 1,
          owner: s.owner,
          name: s.name,
          methodology: s.methodology,
          registry: s.registry,
          registryId: s.registryId,
          location: s.location,
          category: s.category as ProjectCategory,
          vintage: s.vintage,
          estimatedCredits: s.estimatedCredits,
          documentationUri: s.documentationUri,
          submittedBlock: s.submittedBlock,
          status: s.status as VerificationStatus,
        };

        // Add verification data if available
        if (ver.status === "success" && ver.result) {
          const v = ver.result as {
            status: number;
            qualityScore: number;
            verifiedCredits: bigint;
            canMint: boolean;
          };
          project.qualityScore = v.qualityScore;
          project.verifiedCredits = v.verifiedCredits;
          project.canMint = v.canMint;
        }

        projects.push(project);
      }
    }
  }

  const isLoading = isLoadingCount || isLoadingSubmissions || isLoadingVerifications;

  return {
    projects,
    totalProjects: taskCount,
    isLoading,
    CategoryNames,
    VerificationStatusNames,
    ProjectCategory,
    VerificationStatus,
  };
}
