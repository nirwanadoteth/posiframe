import type { AccountAssociation } from "@farcaster/miniapp-core/src/manifest";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

const APP_ACCOUNT_ASSOCIATION: AccountAssociation | undefined =
  process.env.FARCASTER_HEADER &&
  process.env.FARCASTER_PAYLOAD &&
  process.env.FARCASTER_SIGNATURE
    ? {
        header: process.env.FARCASTER_HEADER,
        payload: process.env.FARCASTER_PAYLOAD,
        signature: process.env.FARCASTER_SIGNATURE,
      }
    : undefined;

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: APP_ACCOUNT_ASSOCIATION,
  miniapp: {
    version: "1",
    name: "PosiFrame",
    subtitle: "Bring positivity to your words, effortlessly",
    description: "Make your words more positive and friendly.",
    screenshotUrls: [
      `${ROOT_URL}/screenshot1.png`,
      `${ROOT_URL}/screenshot2.png`,
      `${ROOT_URL}/screenshot3.png`,
    ],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/icon.png`,
    splashBackgroundColor: "#7C3AED", // Matching primary color
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["ai", "positivity", "writing"],
    heroImageUrl: `${ROOT_URL}/opengraph-image.png`,
    tagline: "Turn Negativity Into Positivity",
    ogTitle: "PosiFrame",
    ogDescription: "Make your words more positive and friendly.",
    ogImageUrl: `${ROOT_URL}/opengraph-image.png`,
    noindex: false,
  },
} as const;
