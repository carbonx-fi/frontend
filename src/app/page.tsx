"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Leaf,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Users,
  TrendingUp,
  Droplets,
  TreePine,
  Waves,
  Factory,
  Building,
  Cpu,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const stats = [
  { label: "Carbon Retired", value: "2.5M", suffix: "tonnes", icon: TreePine },
  { label: "Active Traders", value: "50K", suffix: "+", icon: Users },
  { label: "Total Volume", value: "$125M", suffix: "", icon: TrendingUp },
  { label: "Projects", value: "1,200", suffix: "+", icon: Globe },
];

const features = [
  {
    icon: Shield,
    title: "Verified Credits",
    description:
      "Every carbon credit is tokenized from verified projects with full audit trails and provenance tracking.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Trade with confidence knowing your transactions settle instantly on the Mantle blockchain.",
  },
  {
    icon: BarChart3,
    title: "Professional Trading",
    description:
      "Advanced order book with limit orders, market orders, and sophisticated trading strategies.",
  },
  {
    icon: Droplets,
    title: "AMM Pools",
    description:
      "Provide liquidity to carbon credit pools and earn fees while supporting sustainability.",
  },
];

const categories = [
  { icon: TreePine, name: "Forest", color: "from-emerald-500 to-green-600" },
  { icon: Waves, name: "Ocean", color: "from-blue-500 to-cyan-600" },
  { icon: Factory, name: "Energy", color: "from-yellow-500 to-orange-600" },
  { icon: Building, name: "Waste", color: "from-gray-500 to-slate-600" },
  { icon: Users, name: "Community", color: "from-purple-500 to-violet-600" },
  { icon: Cpu, name: "Tech", color: "from-pink-500 to-rose-600" },
];

const guardianTiers = [
  { tier: "Common", credits: "0t", discount: "2%", color: "bg-gray-500" },
  { tier: "Uncommon", credits: "10t", discount: "5%", color: "bg-green-500" },
  { tier: "Rare", credits: "50t", discount: "10%", color: "bg-blue-500" },
  { tier: "Epic", credits: "200t", discount: "15%", color: "bg-purple-500" },
  { tier: "Legendary", credits: "500t", discount: "20%", color: "bg-amber-500" },
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient noise">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            style={{ y, opacity }}
            className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-40 right-20 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-20 left-1/3 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"
          />
        </div>

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-500/40 rounded-full"
            initial={{
              x: Math.random() * 1000,
              y: Math.random() * 800,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        <div className="container px-4 md:px-6 lg:px-8 pt-20 pb-32 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <Badge
                variant="secondary"
                className="mb-6 px-4 py-2 text-sm font-medium bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Built on Mantle for Global Hackathon 2025
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Trade Carbon Credits{" "}
              <span className="gradient-text">On-Chain</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
            >
              The most advanced decentralized marketplace for verified carbon credits.
              Trade, retire, and contribute to a sustainable future with full transparency.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link href="/trade">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25 px-8"
                >
                  Start Trading
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/guardian">
                <Button size="lg" variant="outline" className="gap-2 px-8">
                  <Shield className="h-4 w-4" />
                  Become a Guardian
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-3xl"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex flex-col items-center p-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm"
                >
                  <stat.icon className="h-5 w-5 text-emerald-500 mb-2" />
                  <div className="text-2xl md:text-3xl font-bold">
                    {stat.value}
                    <span className="text-muted-foreground text-lg">{stat.suffix}</span>
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose CarbonX?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete ecosystem for carbon credit trading with institutional-grade
              infrastructure and retail-friendly interface.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 w-fit mb-4">
                      <feature.icon className="h-6 w-6 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 md:py-32">
        <div className="container px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4">
              Carbon Categories
            </Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Diverse Carbon Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trade credits from verified projects across multiple sustainability categories.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div
                      className={`p-4 rounded-2xl bg-gradient-to-br ${category.color} mb-4 shadow-lg`}
                    >
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold">{category.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guardian Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-4">
                Guardian NFT
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Become a Climate{" "}
                <span className="gradient-text">Guardian</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Mint your soulbound Guardian NFT and unlock exclusive benefits.
                The more carbon you retire, the higher your tier and trading discounts.
              </p>
              <div className="space-y-4 mb-8">
                {guardianTiers.map((tier, index) => (
                  <motion.div
                    key={tier.tier}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/50"
                  >
                    <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                    <span className="font-semibold w-24">{tier.tier}</span>
                    <span className="text-muted-foreground">
                      {tier.credits} retired
                    </span>
                    <span className="ml-auto text-emerald-500 font-semibold">
                      {tier.discount} off fees
                    </span>
                  </motion.div>
                ))}
              </div>
              <Link href="/guardian">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25"
                >
                  Mint Your Guardian
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-3xl blur-3xl animate-pulse" />

                {/* Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 border border-emerald-500/30 shadow-2xl"
                >
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-amber-500 text-amber-950 border-0">
                      Legendary
                    </Badge>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="p-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mb-6 animate-pulse-glow">
                      <Shield className="h-16 w-16 text-amber-950" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Climate Guardian
                    </h3>
                    <p className="text-emerald-300/80 text-sm mb-6">
                      500+ tonnes retired
                    </p>
                    <div className="w-full space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-300/60">Trading Fee</span>
                        <span className="text-emerald-400 font-medium">
                          20% Discount
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-300/60">Status</span>
                        <span className="text-amber-400 font-medium">
                          Legendary
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-emerald-300/60">NFT Type</span>
                        <span className="text-emerald-400 font-medium">
                          Soulbound
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-emerald-600/10" />
        <div className="container px-4 md:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Make an Impact?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of traders and businesses contributing to a sustainable future.
              Start trading verified carbon credits today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/trade">
                <Button
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-xl shadow-emerald-500/25 px-8"
                >
                  Launch App
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 px-8">
                <Leaf className="h-4 w-4" />
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
