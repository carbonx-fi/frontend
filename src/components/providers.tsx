"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mantleSepoliaTestnet } from "viem/chains";
import { http } from "wagmi";
import { useState, type ReactNode } from "react";

// Privy-compatible wagmi config
const wagmiConfig = createConfig({
  chains: [mantleSepoliaTestnet],
  transports: {
    [mantleSepoliaTestnet.id]: http("https://rpc.sepolia.mantle.xyz"),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        // Chain config
        defaultChain: mantleSepoliaTestnet,
        supportedChains: [mantleSepoliaTestnet],

        // Embedded wallet - auto-create for users without wallets
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },

        // Appearance
        appearance: {
          theme: "dark",
          accentColor: "#10b981", // Emerald-500 to match CarbonX branding
          landingHeader: "Welcome to CarbonX",
          loginMessage: "Trade carbon credits on Mantle",
          showWalletLoginFirst: false, // Show email/social first for mass market
          walletList: [
            "metamask",
            "wallet_connect",
            "coinbase_wallet",
            "rainbow",
            "detected_ethereum_wallets",
          ],
        },

        // Login methods - prioritize mass market options
        loginMethods: [
          "email",
          "google",
          "twitter",
          "wallet",
        ],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
