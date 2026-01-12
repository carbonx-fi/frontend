"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePrivy, useLogin, useLogout, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Leaf,
  Menu,
  Wallet,
  ChevronDown,
  BarChart3,
  Shield,
  Droplets,
  LogOut,
  Copy,
  ExternalLink,
  User,
  Sparkles,
  Building2,
  FileCheck,
} from "lucide-react";

const navLinks = [
  { href: "/trade", label: "Trade", icon: BarChart3 },
  { href: "/pools", label: "Pools", icon: Droplets },
  { href: "/guardian", label: "Guardian", icon: Shield },
  { href: "/sanctuary", label: "Sanctuary", icon: Sparkles },
  { href: "/corporate", label: "Corporate", icon: Building2 },
  { href: "/submit-project", label: "Submit", icon: FileCheck },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const { logout } = useLogout();
  const { wallets } = useWallets();

  // Get the user's wallet address (embedded or external)
  const address = wallets[0]?.address || user?.wallet?.address;

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  // Get display name - email, social handle, or truncated address
  const getDisplayName = () => {
    if (user?.email?.address) {
      return user.email.address.split("@")[0];
    }
    if (user?.google?.email) {
      return user.google.email.split("@")[0];
    }
    if (user?.twitter?.username) {
      return `@${user.twitter.username}`;
    }
    if (address) {
      return truncateAddress(address);
    }
    return "Connected";
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/40 glass"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/logo.png"
              alt="CarbonX Logo"
              width={40}
              height={40}
              className="rounded-lg"
            />
          </motion.div>
          <span className="font-bold text-xl tracking-tight">
            Carbon<span className="gradient-text">X</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Auth Button */}
          {!ready ? (
            <Button disabled variant="outline" className="gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Loading...
            </Button>
          ) : authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {getDisplayName()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {address && (
                  <>
                    <DropdownMenuItem onClick={copyAddress}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a
                        href={`https://sepolia.mantlescan.xyz/address/${address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View on Explorer
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {user?.email?.address && (
                  <DropdownMenuItem disabled>
                    <User className="h-4 w-4 mr-2" />
                    {user.email.address}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={login}
              className="gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
            >
              <Wallet className="h-4 w-4" />
              Sign In
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium hover:bg-accent transition-colors"
                    >
                      <link.icon className="h-5 w-5 text-emerald-500" />
                      {link.label}
                    </motion.div>
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
