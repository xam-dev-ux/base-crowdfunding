import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = "https://base-crowdfunding.vercel.app";

export const metadata: Metadata = {
  title: "Base Crowdfunding - Decentralized Fundraising Platform",
  description:
    "Create and support crowdfunding campaigns on Base blockchain with transparent funding, milestone-based releases, and secure smart contracts.",

  metadataBase: new URL(APP_URL),
  manifest: "/manifest.json",

  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },

  // Open Graph
  openGraph: {
    type: "website",
    url: APP_URL,
    title: "Base Crowdfunding - Decentralized Fundraising Platform",
    description:
      "Create and support crowdfunding campaigns on Base blockchain with transparent funding, milestone-based releases, and secure smart contracts.",
    siteName: "Base Crowdfunding",
    images: [
      {
        url: `${APP_URL}/splash.png`,
        width: 1200,
        height: 630,
        alt: "Base Crowdfunding Platform",
      },
    ],
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Base Crowdfunding - Decentralized Fundraising Platform",
    description:
      "Create and support crowdfunding campaigns on Base blockchain with transparent funding.",
    images: [`${APP_URL}/splash.png`],
  },

  // 🔑 Custom meta (Base + Farcaster)
  other: {
    // ✅ Base Mini App ID (EL TUYO)
    "base:app_id": "6963be608a6eeb04b568debe",

    // ✅ REQUIRED for Base Mini App embeds
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: `${APP_URL}/splash.png`,
      button: {
        title: "Launch Crowdfunding",
        action: {
          type: "launch_frame",
          name: "Base Crowdfunding",
          url: APP_URL,
          splashImageUrl: `${APP_URL}/splash.png`,
          splashBackgroundColor: "#0052FF",
        },
      },
    }),

    // (Optional) Farcaster frame compatibility
    "fc:frame": "vNext",
    "fc:frame:image": `${APP_URL}/splash.png`,
    "fc:frame:button:1": "Launch App",
    "fc:frame:button:1:action": "link",
    "fc:frame:button:1:target": APP_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main>{children}</main>
            <Toaster position="top-right" />
          </div>
        </Providers>
      </body>
    </html>
  );
}
