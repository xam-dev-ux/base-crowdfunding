import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    title: "Base Crowdfunding - Decentralized Fundraising Platform",
    description:
      "Create and support crowdfunding campaigns on Base blockchain",
    siteName: "Base Crowdfunding",
    images: [
      {
        url: "/splash.png",
        width: 1200,
        height: 630,
        alt: "Base Crowdfunding Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Base Crowdfunding - Decentralized Fundraising Platform",
    description:
      "Create and support crowdfunding campaigns on Base blockchain",
    images: ["/splash.png"],
  },
  other: {
    // ✅ Base Mini App
    "base:app_id": "694c0c754d3a403912ed7e47",

    // ✅ Farcaster Frame metadata
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
