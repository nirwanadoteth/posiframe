import {
  Geist_Mono as FontMono,
  Geist as FontSans,
  Outfit,
} from "next/font/google";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400"],
});

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontHeading.variable
);
