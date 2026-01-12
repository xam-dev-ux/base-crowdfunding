"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "@/lib/wagmi";
import { useState } from "react";
import { FarcasterProvider, useFarcaster } from "@/contexts/FarcasterContext";

function WagmiWrapper({ children }: { children: React.ReactNode }) {
  const { isSDKReady } = useFarcaster();
  const [queryClient] = useState(() => new QueryClient());

  // Don't render wagmi until Farcaster SDK is ready
  if (!isSDKReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FarcasterProvider>
      <WagmiWrapper>{children}</WagmiWrapper>
    </FarcasterProvider>
  );
}
