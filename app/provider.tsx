"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { SafeArea } from "@/components/safe-area";

export function Provider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MiniAppProvider>
        <SafeArea>{children}</SafeArea>
      </MiniAppProvider>
    </QueryClientProvider>
  );
}
