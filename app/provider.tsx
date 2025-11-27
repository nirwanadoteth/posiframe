"use client";

import type { ReactNode } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { OnchainKitProvider } from "@/components/providers/onchainkit-provider";
import { SafeAreaProvider } from "@/components/providers/safe-area-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WagmiProvider } from "@/components/providers/wagmi-provider";

export function Provider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
    >
      <WagmiProvider>
        <OnchainKitProvider>
          <MiniAppProvider>
            <SafeAreaProvider>{children}</SafeAreaProvider>
          </MiniAppProvider>
        </OnchainKitProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
