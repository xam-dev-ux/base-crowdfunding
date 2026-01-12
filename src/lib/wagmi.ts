import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    // Farcaster Mini App connector - handles authorization in Farcaster frames
    farcasterMiniApp(),
    injected({
      shimDisconnect: true,
    }),
    walletConnect({
      projectId,
      showQrModal: true,
      metadata: {
        name: "Base Crowdfunding",
        description: "Decentralized crowdfunding platform on Base blockchain",
        url: process.env.NEXT_PUBLIC_APP_URL || "https://your-app.vercel.app",
        icons: ["/icon.png"],
      },
    }),
    coinbaseWallet({
      appName: "Base Crowdfunding",
      appLogoUrl: "/icon.png",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // Batch requests to prevent race conditions with Farcaster SDK
  batch: {
    multicall: true,
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
