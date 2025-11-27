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
    description: "Make your words more positive and friendly",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon-dark.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#FFFFFF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["ai", "positivity", "reframe", "writing", "language"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Turn Negativity Into Positivity",
    ogTitle: "PosiFrame",
    ogDescription: "Make your words more positive and friendly",
    ogImageUrl: `${ROOT_URL}/hero.png`,
    noindex: false,
  },
  baseBuilder: {
    ownerAddress: "0x0e2d4eF0a0A82cd818f0B3cfFe52F4Ebcbf0d96e",
  },
} as const;
