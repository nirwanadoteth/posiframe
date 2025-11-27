"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import type { MiniAppContext as MiniAppCoreContext } from "@farcaster/miniapp-core/dist/context";
import { sdk } from "@farcaster/miniapp-sdk";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type MiniAppContextType = {
  context: MiniAppCoreContext | null;
  isInMiniApp: boolean;
} | null;

const MiniAppContext = createContext<MiniAppContextType>(null);

export const useMiniAppContext = () => useContext(MiniAppContext);

export function MiniAppProvider({ children }: { children: ReactNode }) {
  const [miniAppContext, setMiniAppContext] =
    useState<MiniAppContextType>(null);
  const { context } = useMiniKit();

  useEffect(() => {
    const init = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();

        setMiniAppContext({
          context,
          isInMiniApp: inMiniApp,
        });
      } catch {
        // MiniApp initialization failure handled gracefully
        setMiniAppContext({
          context: null,
          isInMiniApp: false,
        });
      }
    };

    init();
  }, [context]);

  return (
    <MiniAppContext.Provider value={miniAppContext}>
      {children}
    </MiniAppContext.Provider>
  );
}
