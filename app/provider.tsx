"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { SafeArea } from "@/components/safe-area";

const queryClient = new QueryClient();

export function Provider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <MiniAppProvider>
        <SafeArea>{children}</SafeArea>
      </MiniAppProvider>
    </QueryClientProvider>
  );
}
