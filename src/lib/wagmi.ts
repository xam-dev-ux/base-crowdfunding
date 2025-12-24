import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "";

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
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
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
