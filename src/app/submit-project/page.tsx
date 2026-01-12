"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TreePine,
  Waves,
  Zap,
  Factory,
  Users,
  Cpu,
  FileCheck,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Shield,
} from "lucide-react";
import {
  useProjectVerification,
  ProjectCategory,
  CategoryNames,
} from "@/hooks/useProjectVerification";

const categoryOptions = [
  { value: ProjectCategory.FOREST, label: "Forestry / REDD+", icon: TreePine, color: "bg-green-500" },
  { value: ProjectCategory.OCEAN, label: "Blue Carbon", icon: Waves, color: "bg-blue-500" },
  { value: ProjectCategory.ENERGY, label: "Renewable Energy", icon: Zap, color: "bg-yellow-500" },
  { value: ProjectCategory.WASTE, label: "Waste Management", icon: Factory, color: "bg-purple-500" },
  { value: ProjectCategory.COMMUNITY, label: "Community", icon: Users, color: "bg-orange-500" },
  { value: ProjectCategory.TECH, label: "Tech Removal", icon: Cpu, color: "bg-cyan-500" },
];

const methodologies = [
  "VCS (Verified Carbon Standard)",
  "Gold Standard",
  "CAR (Climate Action Reserve)",
  "ACR (American Carbon Registry)",
  "Plan Vivo",
  "Other",
];

const registries = [
  "Verra",
  "Gold Standard Registry",
  "Climate Action Reserve",
  "American Carbon Registry",
  "Other",
];

export default function SubmitProjectPage() {
  const { isConnected } = useAccount();
  const {
    submitProject,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    hash,
  } = useProjectVerification();

  // Form state
  const [name, setName] = useState("");
  const [methodology, setMethodology] = useState("");
  const [registry, setRegistry] = useState("");
  const [registryId, setRegistryId] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<ProjectCategory>(ProjectCategory.FOREST);
  const [vintage, setVintage] = useState(2024);
  const [estimatedCredits, setEstimatedCredits] = useState("");
  const [documentationUri, setDocumentationUri] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !methodology || !registry || !registryId || !location || !estimatedCredits) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await submitProject({
        name,
        methodology,
        registry,
        registryId,
        location,
        category,
        vintage,
        estimatedCredits: parseFloat(estimatedCredits),
        documentationUri: documentationUri || "ipfs://placeholder",
      });
    } catch (e) {
      console.error("Submit failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-12 overflow-hidden hero-gradient">
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
              AVS-Verified RWA Tokenization
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Submit Carbon <span className="gradient-text">Project</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Register your carbon project for decentralized verification. AVS operators
              will verify your project authenticity before tokenization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Form */}
      <div className="container px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-emerald-500" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Amazon Rainforest Protection"
                    className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Project Category *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categoryOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = category === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setCategory(opt.value)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-border hover:border-emerald-500/50"
                          }`}
                        >
                          <Icon className={`h-5 w-5 mx-auto mb-1 ${isSelected ? "text-emerald-500" : "text-muted-foreground"}`} />
                          <span className="text-xs">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Methodology & Registry */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Methodology *</label>
                    <select
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    >
                      <option value="">Select methodology</option>
                      {methodologies.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registry *</label>
                    <select
                      value={registry}
                      onChange={(e) => setRegistry(e.target.value)}
                      className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    >
                      <option value="">Select registry</option>
                      {registries.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Registry ID */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Registry Project ID *</label>
                  <input
                    type="text"
                    value={registryId}
                    onChange={(e) => setRegistryId(e.target.value)}
                    placeholder="e.g., VCS-1234"
                    className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location *</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Brazil, Amazon Basin"
                    className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                    required
                  />
                </div>

                {/* Vintage & Estimated Credits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vintage Year *</label>
                    <select
                      value={vintage}
                      onChange={(e) => setVintage(parseInt(e.target.value))}
                      className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 outline-none"
                      required
                    >
                      {[2024, 2023, 2022, 2021, 2020].map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Credits (tonnes) *</label>
                    <input
                      type="number"
                      value={estimatedCredits}
                      onChange={(e) => setEstimatedCredits(e.target.value)}
                      placeholder="e.g., 10000"
                      className="w-full h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                      required
                      min="1"
                    />
                  </div>
                </div>

                {/* Documentation URI */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Documentation URL (optional)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={documentationUri}
                      onChange={(e) => setDocumentationUri(e.target.value)}
                      placeholder="https://... or ipfs://..."
                      className="flex-1 h-11 px-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
                    />
                    <Button type="button" variant="outline" size="icon" className="h-11 w-11">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Link to project documentation, PDD, or verification report
                  </p>
                </div>

                <Separator />

                {/* Info Box */}
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <h4 className="font-medium text-emerald-500 mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    AVS Verification Process
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Submit your project details</li>
                    <li>AVS operators verify registry listing & documentation</li>
                    <li>Quality score assigned (0-100)</li>
                    <li>Upon approval, tokens can be minted</li>
                  </ol>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error.message}</span>
                  </div>
                )}

                {/* Success Display */}
                {isConfirmed && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Project submitted successfully!</p>
                      <p className="text-xs">AVS operators will verify your project shortly.</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                  disabled={!isConnected || isPending || isConfirming}
                >
                  {!isConnected ? (
                    "Connect Wallet"
                  ) : isPending || isConfirming ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {isPending ? "Confirm in Wallet..." : "Submitting..."}
                    </>
                  ) : (
                    <>
                      <FileCheck className="h-5 w-5 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
