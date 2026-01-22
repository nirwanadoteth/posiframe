import type { Metadata } from "next";
import { HomeContent } from "@/components/home-content";
import { minikitConfig } from "@/minikit.config";

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
        url: minikitConfig.miniapp.homeUrl,
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

  return <HomeContent initialText={text} />;
}
