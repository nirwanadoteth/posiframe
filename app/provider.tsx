"use client";

import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import type { ReactNode } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { SafeAreaProvider } from "@/components/providers/safe-area-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

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
      <MiniKitProvider enabled={true}>
        <MiniAppProvider>
          <SafeAreaProvider>{children}</SafeAreaProvider>
        </MiniAppProvider>
      </MiniKitProvider>
    </ThemeProvider>
  );
}
