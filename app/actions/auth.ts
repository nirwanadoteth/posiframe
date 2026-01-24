"use server";

import { createClient, Errors } from "@farcaster/quick-auth";
import { captureException } from "@sentry/nextjs";
import { headers } from "next/headers";

const client = createClient();

type AuthSuccess = {
  success: true;
  user: {
    fid: number;
    issuedAt: number;
    expiresAt: number;
  };
};

type AuthError = {
  success: false;
  error: string;
};

export type VerifyTokenResult = AuthSuccess | AuthError;

export async function verifyFarcasterToken(): Promise<VerifyTokenResult> {
  try {
    const headersList = await headers();
    const authorization = headersList.get("authorization");
    const host = headersList.get("host");

    if (!authorization?.startsWith("Bearer ")) {
      return { success: false, error: "Missing token" };
    }

    if (!host) {
      return { success: false, error: "Could not determine host" };
    }

    const payload = await client.verifyJwt({
      token: authorization.split(" ")[1] as string,
      domain: host,
    });

    return {
      success: true,
      user: {
        fid: payload.sub,
        issuedAt: payload.iat,
        expiresAt: payload.exp,
      },
    };
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      return { success: false, error: "Invalid token" };
    }
    if (e instanceof Error) {
      captureException(e);
      return { success: false, error: e.message };
    }
    return { success: false, error: "Unknown authentication error" };
  }
}
