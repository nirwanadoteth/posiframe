"use client";

import type { ReactNode } from "react";
import { SafeArea } from "@/components/safe-area";

type SafeAreaProviderProps = {
  children: ReactNode;
};

export function SafeAreaProvider({ children }: SafeAreaProviderProps) {
  return <SafeArea>{children}</SafeArea>;
}
