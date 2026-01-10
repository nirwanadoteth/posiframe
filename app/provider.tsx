"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { SafeAreaProvider } from "@/components/providers/safe-area-provider";

const queryClient = new QueryClient();

export function Provider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <MiniAppProvider>
        <SafeAreaProvider>{children}</SafeAreaProvider>
      </MiniAppProvider>
    </QueryClientProvider>
  );
}
