"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode, useState } from "react";
import { MiniAppProvider } from "@/components/providers/miniapp-provider";
import { SafeArea } from "@/components/safe-area";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Provider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <MiniAppProvider>
          <SafeArea>
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-center" richColors theme="system" />
          </SafeArea>
        </MiniAppProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
