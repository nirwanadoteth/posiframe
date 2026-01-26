import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { minikitConfig } from "@/minikit.config";
import { Provider } from "./provider";

const miniappEmbed = {
  version: minikitConfig.miniapp.version,
  imageUrl: minikitConfig.miniapp.heroImageUrl,
  button: {
    title: `Open ${minikitConfig.miniapp.name}`,
    action: {
      type: "launch_frame",
      url: minikitConfig.miniapp.homeUrl,
      name: minikitConfig.miniapp.name,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
    description:
      minikitConfig.miniapp.ogDescription || minikitConfig.miniapp.description,
    openGraph: {
      title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
      description:
        minikitConfig.miniapp.ogDescription ||
        minikitConfig.miniapp.description,
      images: [minikitConfig.miniapp.ogImageUrl],
      url: minikitConfig.miniapp.homeUrl,
      siteName: minikitConfig.miniapp.name,
    },
    twitter: {
      card: "summary_large_image",
      title: minikitConfig.miniapp.ogTitle || minikitConfig.miniapp.name,
      description:
        minikitConfig.miniapp.ogDescription ||
        minikitConfig.miniapp.description,
      images: [minikitConfig.miniapp.ogImageUrl],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniappEmbed),
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased transition-colors duration-500",
          fontVariables
        )}
      >
        <Provider>
          <div className="relative flex min-h-screen flex-col">{children}</div>
        </Provider>
      </body>
    </html>
  );
}
