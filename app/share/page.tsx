import type { Metadata } from "next";
import { minikitConfig } from "@/minikit.config";
import Home from "../page";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const text = typeof params.text === "string" ? params.text : undefined;
  const streak = typeof params.streak === "string" ? params.streak : undefined;
  const count = typeof params.count === "string" ? params.count : undefined;

  // Build API URL
  const query = new URLSearchParams();
  if (text) {
    query.set("text", text);
  }
  if (streak) {
    query.set("streak", streak);
  }
  if (count) {
    query.set("count", count);
  }

  // Base URL for the dynamic image
  const ogImage = `${minikitConfig.miniapp.homeUrl}/api/og?${query.toString()}`;

  const title = streak
    ? "My PosiFrame Stats 🔥"
    : "PosiFrame - Check out my reframe!";
  let description: string = minikitConfig.miniapp.description;

  if (text) {
    description = `"${text}"`;
  } else if (streak && count) {
    description = `${streak} day streak • ${count} toxic messages blocked`;
  }

  const miniappEmbed = {
    version: "next",
    imageUrl: ogImage,
    button: {
      title: "Launch PosiFrame",
      action: {
        type: "launch_frame",
        url: minikitConfig.miniapp.homeUrl, // Always launch to home for now
        name: minikitConfig.miniapp.name,
        splashImageUrl: minikitConfig.miniapp.splashImageUrl,
        splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      },
    },
  };

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [ogImage],
    },
    other: {
      "fc:miniapp": JSON.stringify(miniappEmbed),
    },
  };
}

export default async function SharePage({ searchParams }: Props) {
  const params = await searchParams;
  const text = typeof params.text === "string" ? params.text : undefined;

  // We can pass the text to Home if we want to pre-fill it or show it
  // For now, simply rendering Home is enough to get the app running
  return <Home initialText={text} />;
}
