"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TreePine,
  Waves,
  Zap,
  Factory,
  Users,
  Cpu,
  Shield,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Loader2,
  MapPin,
  Calendar,
  Leaf,
  ExternalLink,
} from "lucide-react";
import { formatEther } from "viem";
import { useProjects } from "@/hooks/useProjects";
import {
  ProjectCategory,
  VerificationStatus,
  CategoryNames,
  VerificationStatusNames,
} from "@/hooks/useProjectVerification";

const categoryIcons: Record<ProjectCategory, React.ElementType> = {
  [ProjectCategory.FOREST]: TreePine,
  [ProjectCategory.OCEAN]: Waves,
  [ProjectCategory.ENERGY]: Zap,
  [ProjectCategory.WASTE]: Factory,
  [ProjectCategory.COMMUNITY]: Users,
  [ProjectCategory.TECH]: Cpu,
};

const categoryColors: Record<ProjectCategory, string> = {
  [ProjectCategory.FOREST]: "bg-green-500",
  [ProjectCategory.OCEAN]: "bg-blue-500",
  [ProjectCategory.ENERGY]: "bg-yellow-500",
  [ProjectCategory.WASTE]: "bg-purple-500",
  [ProjectCategory.COMMUNITY]: "bg-orange-500",
  [ProjectCategory.TECH]: "bg-cyan-500",
};

const statusConfig: Record<
  VerificationStatus,
  { color: string; icon: React.ElementType; bgColor: string }
> = {
  [VerificationStatus.PENDING]: {
    color: "text-amber-500",
    icon: Clock,
    bgColor: "bg-amber-500/10 border-amber-500/30",
  },
  [VerificationStatus.BASIC]: {
    color: "text-gray-500",
    icon: CheckCircle2,
    bgColor: "bg-gray-500/10 border-gray-500/30",
  },
  [VerificationStatus.STANDARD]: {
    color: "text-blue-500",
    icon: CheckCircle2,
    bgColor: "bg-blue-500/10 border-blue-500/30",
  },
  [VerificationStatus.PREMIUM]: {
    color: "text-emerald-500",
    icon: CheckCircle2,
    bgColor: "bg-emerald-500/10 border-emerald-500/30",
  },
  [VerificationStatus.REJECTED]: {
    color: "text-red-500",
    icon: XCircle,
    bgColor: "bg-red-500/10 border-red-500/30",
  },
};

export default function ProjectsPage() {
  const { projects, totalProjects, isLoading } = useProjects();

  // Calculate stats
  const verifiedCount = projects.filter(
    (p) =>
      p.status !== VerificationStatus.PENDING &&
      p.status !== VerificationStatus.REJECTED
  ).length;
  const pendingCount = projects.filter(
    (p) => p.status === VerificationStatus.PENDING
  ).length;
  const totalCredits = projects.reduce(
    (sum, p) => sum + Number(formatEther(p.estimatedCredits)),
    0
  );

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
              AVS-Verified Projects
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Carbon <span className="gradient-text">Projects</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse verified carbon offset projects. Each project is validated
              by decentralized AVS operators for authenticity and quality.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {[
              { label: "Total Projects", value: totalProjects.toString() },
              { label: "Verified", value: verifiedCount.toString() },
              { label: "Pending", value: pendingCount.toString() },
              {
                label: "Est. Credits",
                value: `${(totalCredits / 1000).toFixed(0)}K t`,
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl bg-card/50 border border-border/50 backdrop-blur-sm text-center"
              >
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 md:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Projects</h2>
          <Link href="/submit-project">
            <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Submit Project
            </Button>
          </Link>
        </div>

        {/* Projects Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                <span className="ml-3 text-muted-foreground">
                  Loading projects...
                </span>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No projects yet</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to submit a carbon project for verification
                </p>
                <Link href="/submit-project">
                  <Button variant="outline">Submit a Project</Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Vintage</TableHead>
                    <TableHead className="text-right">Est. Credits</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project, index) => {
                    const CategoryIcon = categoryIcons[project.category];
                    const StatusIcon = statusConfig[project.status].icon;

                    return (
                      <TableRow key={project.taskId}>
                        <TableCell className="text-muted-foreground">
                          {project.taskId}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${categoryColors[project.category]}/20`}
                            >
                              <CategoryIcon
                                className={`h-4 w-4 ${categoryColors[project.category].replace("bg-", "text-")}`}
                              />
                            </div>
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {project.registry} - {project.registryId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {CategoryNames[project.category]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {project.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {project.vintage}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {Number(
                            formatEther(project.estimatedCredits)
                          ).toLocaleString()}{" "}
                          t
                        </TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[project.status].bgColor}`}
                          >
                            <StatusIcon
                              className={`h-3 w-3 ${statusConfig[project.status].color}`}
                            />
                            <span className={statusConfig[project.status].color}>
                              {VerificationStatusNames[project.status]}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {project.qualityScore !== undefined ? (
                            <span
                              className={`font-medium ${
                                project.qualityScore >= 80
                                  ? "text-emerald-500"
                                  : project.qualityScore >= 60
                                    ? "text-amber-500"
                                    : "text-muted-foreground"
                              }`}
                            >
                              {project.qualityScore}/100
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                AVS Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                Every project on CarbonX goes through decentralized verification
                by AVS operators who validate:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Registry authenticity and project existence</li>
                <li>Methodology compliance</li>
                <li>Documentation verification</li>
                <li>Credit estimation accuracy</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Leaf className="h-5 w-5 text-emerald-500" />
                Verification Tiers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  status: VerificationStatus.PREMIUM,
                  desc: "Highest quality score (80+)",
                },
                {
                  status: VerificationStatus.STANDARD,
                  desc: "Good quality score (60-79)",
                },
                {
                  status: VerificationStatus.BASIC,
                  desc: "Minimum requirements met",
                },
                {
                  status: VerificationStatus.PENDING,
                  desc: "Awaiting operator verification",
                },
              ].map(({ status, desc }) => {
                const Icon = statusConfig[status].icon;
                return (
                  <div
                    key={status}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Icon
                      className={`h-4 w-4 ${statusConfig[status].color}`}
                    />
                    <span className={statusConfig[status].color}>
                      {VerificationStatusNames[status]}
                    </span>
                    <span className="text-muted-foreground">- {desc}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
