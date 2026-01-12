"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import sdk from "@farcaster/miniapp-sdk";

interface FarcasterContextType {
  isSDKReady: boolean;
  isInFrame: boolean;
}

const FarcasterContext = createContext<FarcasterContextType>({
  isSDKReady: false,
  isInFrame: false,
});

export function useFarcaster() {
  return useContext(FarcasterContext);
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [isInFrame, setIsInFrame] = useState(false);

  useEffect(() => {
    // Check if we're in a Farcaster frame environment
    const checkFrameEnvironment = async () => {
      try {
        // Check if we're in a Farcaster mini app
        const inFrame = await sdk.isInMiniApp();
        setIsInFrame(inFrame);

        if (inFrame) {
          // If we're in a mini app, notify the host that we're ready
          await sdk.actions.ready();
        }

        // Mark SDK as ready (either it's ready or we're not in a frame)
        setIsSDKReady(true);
      } catch (error) {
        console.error("Error initializing Farcaster SDK:", error);
        // Even if there's an error, mark as ready to not block the app
        setIsSDKReady(true);
      }
    };

    checkFrameEnvironment();
  }, []);

  return (
    <FarcasterContext.Provider value={{ isSDKReady, isInFrame }}>
      {children}
    </FarcasterContext.Provider>
  );
}
