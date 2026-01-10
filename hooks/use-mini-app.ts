"use client";
import type { ReadyOptions } from "@farcaster/miniapp-sdk";
import sdk from "@farcaster/miniapp-sdk";
import { useContext, useState } from "react";
import { MiniAppContext } from "@/components/providers/miniapp-provider";
import type { MiniAppContextType } from "@/types/miniapp";

type SetMiniAppReady = (
  readyOptions?: Partial<ReadyOptions>
) => Promise<MiniAppContextType>;
type UseMiniAppReturn = {
  /** The MiniApp context. */
  context: MiniAppContextType["context"];
  /** A boolean indicating if the mini app has been set as ready. */
  isMiniAppReady: boolean;
  /** A function to set the mini app as ready, which will hide the splash screen. */
  setMiniAppReady: SetMiniAppReady;
  /** A function to update the client context. */
  updateClientContext: MiniAppContextType["updateClientContext"];
  /** The notification proxy URL. */
  notificationProxyUrl: MiniAppContextType["notificationProxyUrl"];
};

/**
 * Allows for the use of the MiniApp context.
 *
 * @returns The MiniAppContext object.
 */
export const useMiniApp = (): UseMiniAppReturn => {
  const [isMiniAppReady, setIsMiniAppReady] = useState(false);
  const context = useContext(MiniAppContext);

  const setMiniAppReady = async (readyOptions: Partial<ReadyOptions> = {}) => {
    await sdk.actions.ready(readyOptions);
    setIsMiniAppReady(true);
    return context;
  };

  return {
    setMiniAppReady,
    isMiniAppReady,
    context: context.context,
    updateClientContext: context.updateClientContext,
    notificationProxyUrl: context.notificationProxyUrl,
  };
};
