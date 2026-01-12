"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  TrendingUp,
  FileText,
  Shield,
  Zap,
  Globe,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Users,
  Clock,
  Award,
  ChevronRight,
  Mail,
  Filter,
  TreePine,
  Waves,
  Factory,
  Bird,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Check,
  X,
} from "lucide-react";

// Carbon credit categories
const categories = [
  { id: "forest", name: "Forestry", icon: TreePine, color: "bg-green-500" },
  { id: "ocean", name: "Ocean", icon: Waves, color: "bg-blue-500" },
  { id: "energy", name: "Renewable Energy", icon: Zap, color: "bg-yellow-500" },
  { id: "industrial", name: "Industrial", icon: Factory, color: "bg-purple-500" },
  { id: "wildlife", name: "Wildlife", icon: Bird, color: "bg-amber-500" },
];

// Certification standards
const certifications = [
  { id: "verra", name: "Verra VCS" },
  { id: "gold", name: "Gold Standard" },
  { id: "car", name: "Climate Action Reserve" },
  { id: "acr", name: "American Carbon Registry" },
];

// Regions
const regions = [
  { id: "americas", name: "Americas" },
  { id: "europe", name: "Europe" },
  { id: "asia", name: "Asia Pacific" },
  { id: "africa", name: "Africa" },
];

// Vintage years
const vintages = ["2024", "2023", "2022", "2021"];

// Mock available credits
const mockCredits = [
  {
    id: 1,
    name: "Amazon Rainforest Conservation",
    category: "forest",
    certification: "verra",
    region: "americas",
    vintage: "2024",
    available: 50000,
    pricePerTonne: 28.5,
    rating: 4.9,
    cobenefits: ["Biodiversity", "Community"],
  },
  {
    id: 2,
    name: "Blue Carbon Mangrove Restoration",
    category: "ocean",
    certification: "gold",
    region: "asia",
    vintage: "2024",
    available: 25000,
    pricePerTonne: 35.0,
    rating: 4.8,
    cobenefits: ["Marine Life", "Coastal Protection"],
  },
  {
    id: 3,
    name: "Wind Farm - Central Europe",
    category: "energy",
    certification: "gold",
    region: "europe",
    vintage: "2023",
    available: 100000,
    pricePerTonne: 22.0,
    rating: 4.7,
    cobenefits: ["Clean Energy", "Local Jobs"],
  },
  {
    id: 4,
    name: "Kenya Great Rift Valley Forest",
    category: "forest",
    certification: "verra",
    region: "africa",
    vintage: "2024",
    available: 35000,
    pricePerTonne: 26.0,
    rating: 4.9,
    cobenefits: ["Wildlife", "Water Resources"],
  },
  {
    id: 5,
    name: "Industrial Methane Capture",
    category: "industrial",
    certification: "acr",
    region: "americas",
    vintage: "2023",
    available: 80000,
    pricePerTonne: 18.5,
    rating: 4.5,
    cobenefits: ["Waste Reduction"],
  },
  {
    id: 6,
    name: "Borneo Orangutan Habitat",
    category: "wildlife",
    certification: "verra",
    region: "asia",
    vintage: "2024",
    available: 15000,
    pricePerTonne: 42.0,
    rating: 5.0,
    cobenefits: ["Endangered Species", "Education"],
  },
];

// Impact metrics
const impactMetrics = [
  { label: "Corporate Partners", value: "500+", icon: Building2 },
  { label: "Tonnes Offset", value: "2.5M", icon: Leaf },
  { label: "Countries", value: "45", icon: Globe },
  { label: "Avg. Response Time", value: "<2hrs", icon: Clock },
];

export default function CorporatePage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"browse" | "info">("browse");

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedVintages, setSelectedVintages] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);

  // Cart state
  const [cart, setCart] = useState<{ creditId: number; amount: number }[]>([]);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  // Filter credits based on selections
  const filteredCredits = useMemo(() => {
    return mockCredits.filter((credit) => {
      if (selectedCategories.length > 0 && !selectedCategories.includes(credit.category))
        return false;
      if (
        selectedCertifications.length > 0 &&
        !selectedCertifications.includes(credit.certification)
      )
        return false;
      if (selectedRegions.length > 0 && !selectedRegions.includes(credit.region)) return false;
      if (selectedVintages.length > 0 && !selectedVintages.includes(credit.vintage)) return false;
      if (credit.rating < minRating) return false;
      return true;
    });
  }, [selectedCategories, selectedCertifications, selectedRegions, selectedVintages, minRating]);

  // Toggle filter selection
  const toggleFilter = (
    value: string,
    selected: string[],
    setSelected: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  // Add to cart
  const addToCart = (creditId: number, amount: number) => {
    const existing = cart.find((c) => c.creditId === creditId);
    if (existing) {
      setCart(cart.map((c) => (c.creditId === creditId ? { ...c, amount: c.amount + amount } : c)));
    } else {
      setCart([...cart, { creditId, amount }]);
    }
  };

  // Calculate cart total
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const credit = mockCredits.find((c) => c.id === item.creditId);
      return total + (credit ? credit.pricePerTonne * item.amount : 0);
    }, 0);
  }, [cart]);

  const cartTonnes = useMemo(() => {
    return cart.reduce((total, item) => total + item.amount, 0);
  }, [cart]);

  // Get icon component for category
  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat?.icon || Leaf;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 overflow-hidden hero-gradient">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium bg-blue-500/10 text-blue-500 border-blue-500/20"
            >
              <Building2 className="w-3.5 h-3.5 mr-2" />
              Enterprise Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Scale Your <span className="gradient-text">Climate Impact</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Enterprise-grade carbon offsetting with verified credits, bulk purchasing,
              and comprehensive reporting for businesses of all sizes.
            </p>

            {/* Impact Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {impactMetrics.map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-3 rounded-lg bg-card/30 backdrop-blur-sm"
                >
                  <metric.icon className="h-5 w-5 mx-auto mb-1 text-emerald-500" />
                  <p className="text-xl font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 md:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "browse" | "info")}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="gap-2">
              <Filter className="h-4 w-4" />
              Browse Credits
            </TabsTrigger>
            <TabsTrigger value="info" className="gap-2">
              <Building2 className="h-4 w-4" />
              Enterprise Info
            </TabsTrigger>
          </TabsList>

          {/* Browse Credits Tab */}
          <TabsContent value="browse">
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Filters Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Filter className="h-4 w-4 text-emerald-500" />
                      Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {/* Categories */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Category</h4>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = selectedCategories.includes(cat.id);
                          return (
                            <Badge
                              key={cat.id}
                              variant={isSelected ? "default" : "secondary"}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-500 text-white" : ""
                              }`}
                              onClick={() =>
                                toggleFilter(cat.id, selectedCategories, setSelectedCategories)
                              }
                            >
                              <Icon className="h-3 w-3 mr-1" />
                              {cat.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Certifications */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Certification</h4>
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => {
                          const isSelected = selectedCertifications.includes(cert.id);
                          return (
                            <Badge
                              key={cert.id}
                              variant={isSelected ? "default" : "secondary"}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-500 text-white" : ""
                              }`}
                              onClick={() =>
                                toggleFilter(
                                  cert.id,
                                  selectedCertifications,
                                  setSelectedCertifications
                                )
                              }
                            >
                              {cert.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Regions */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Region</h4>
                      <div className="flex flex-wrap gap-2">
                        {regions.map((region) => {
                          const isSelected = selectedRegions.includes(region.id);
                          return (
                            <Badge
                              key={region.id}
                              variant={isSelected ? "default" : "secondary"}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-500 text-white" : ""
                              }`}
                              onClick={() =>
                                toggleFilter(region.id, selectedRegions, setSelectedRegions)
                              }
                            >
                              {region.name}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Vintage */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Vintage</h4>
                      <div className="flex flex-wrap gap-2">
                        {vintages.map((vintage) => {
                          const isSelected = selectedVintages.includes(vintage);
                          return (
                            <Badge
                              key={vintage}
                              variant={isSelected ? "default" : "secondary"}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-emerald-500 text-white" : ""
                              }`}
                              onClick={() =>
                                toggleFilter(vintage, selectedVintages, setSelectedVintages)
                              }
                            >
                              {vintage}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <Separator />

                    {/* Clear Filters */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedCertifications([]);
                        setSelectedRegions([]);
                        setSelectedVintages([]);
                        setMinRating(0);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Credits Grid */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredCredits.length} of {mockCredits.length} credits
                  </p>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredCredits.map((credit, index) => {
                    const Icon = getCategoryIcon(credit.category);
                    return (
                      <motion.div
                        key={credit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all">
                          <CardContent className="p-5">
                            <div className="flex gap-4">
                              <div
                                className={`p-3 rounded-xl ${categories.find((c) => c.id === credit.category)?.color}/10`}
                              >
                                <Icon
                                  className={`h-8 w-8 ${categories.find((c) => c.id === credit.category)?.color.replace("bg-", "text-")}`}
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold">{credit.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {
                                          certifications.find(
                                            (c) => c.id === credit.certification
                                          )?.name
                                        }
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {regions.find((r) => r.id === credit.region)?.name}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        {credit.vintage}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xl font-bold text-emerald-500">
                                      ${credit.pricePerTonne}
                                    </p>
                                    <p className="text-xs text-muted-foreground">per tonne</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <div className="flex items-center gap-4 text-sm">
                                    <span className="text-muted-foreground">
                                      Available:{" "}
                                      <span className="text-foreground font-medium">
                                        {credit.available.toLocaleString()}t
                                      </span>
                                    </span>
                                    <span className="text-amber-500 flex items-center gap-1">
                                      <Award className="h-4 w-4" />
                                      {credit.rating}
                                    </span>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => addToCart(credit.id, 100)}
                                    >
                                      +100t
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                                      onClick={() => addToCart(credit.id, 1000)}
                                    >
                                      +1000t
                                    </Button>
                                  </div>
                                </div>

                                {/* Co-benefits */}
                                <div className="flex gap-2 mt-3">
                                  {credit.cobenefits.map((benefit) => (
                                    <Badge
                                      key={benefit}
                                      variant="secondary"
                                      className="text-xs bg-emerald-500/10 text-emerald-600"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      {benefit}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {filteredCredits.length === 0 && (
                  <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-bold mb-2">No Credits Found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters to see more options.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Cart Sidebar */}
              <div className="lg:col-span-1">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-emerald-500" />
                      Purchase Order
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Your cart is empty. Add credits to get started.
                      </p>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {cart.map((item) => {
                            const credit = mockCredits.find((c) => c.id === item.creditId);
                            if (!credit) return null;
                            return (
                              <div
                                key={item.creditId}
                                className="flex justify-between items-center text-sm p-2 rounded-lg bg-muted/30"
                              >
                                <div>
                                  <p className="font-medium truncate max-w-[150px]">
                                    {credit.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.amount.toLocaleString()} tonnes
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    ${(credit.pricePerTonne * item.amount).toLocaleString()}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() =>
                                      setCart(cart.filter((c) => c.creditId !== item.creditId))
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Tonnes</span>
                            <span className="font-medium">
                              {cartTonnes.toLocaleString()} tonnes
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Volume Discount</span>
                            <span className="font-medium text-emerald-500">
                              -{cartTonnes >= 5000 ? "10%" : cartTonnes >= 1000 ? "5%" : "0%"}
                            </span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="font-bold">Estimated Total</span>
                            <span className="font-bold text-emerald-500">
                              $
                              {(
                                cartTotal *
                                (cartTonnes >= 5000 ? 0.9 : cartTonnes >= 1000 ? 0.95 : 1)
                              ).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>

                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                          <Mail className="h-4 w-4 mr-2" />
                          Request Quote
                        </Button>

                        <p className="text-xs text-muted-foreground text-center">
                          Our team will contact you within 24 hours
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Enterprise Info Tab */}
          <TabsContent value="info">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Features */}
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: BarChart3,
                    title: "Bulk Purchasing",
                    description: "Volume discounts up to 15% for large orders",
                  },
                  {
                    icon: FileText,
                    title: "Compliance Reports",
                    description: "Automated ESG reporting and audit documentation",
                  },
                  {
                    icon: Zap,
                    title: "API Access",
                    description: "Integrate carbon offsetting into your operations",
                  },
                  {
                    icon: Shield,
                    title: "Verified Credits",
                    description: "Verra, Gold Standard, and custom verification",
                  },
                ].map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="p-3 rounded-xl bg-emerald-500/10 w-fit mb-4">
                            <Icon className="h-6 w-6 text-emerald-500" />
                          </div>
                          <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <Card className="border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10">
                <CardContent className="p-8 text-center">
                  <Award className="h-12 w-12 mx-auto mb-6 text-emerald-500" />
                  <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
                  <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                    Join 500+ companies using CarbonX to achieve their sustainability goals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                    >
                      <Mail className="h-5 w-5" />
                      Schedule a Demo
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      <FileText className="h-5 w-5" />
                      Download Brochure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
