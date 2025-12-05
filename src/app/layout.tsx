import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CarbonX | Carbon Credit Trading Platform",
  description: "Trade verified carbon credits on the blockchain. Join the future of sustainable finance with CarbonX - the most advanced carbon credit marketplace.",
  keywords: ["carbon credits", "blockchain", "sustainability", "trading", "climate", "web3", "defi"],
  authors: [{ name: "CarbonX Team" }],
  openGraph: {
    title: "CarbonX | Carbon Credit Trading Platform",
    description: "Trade verified carbon credits on the blockchain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonX | Carbon Credit Trading Platform",
    description: "Trade verified carbon credits on the blockchain",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
