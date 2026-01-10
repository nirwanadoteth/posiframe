"use client";
import sdk, { type Context } from "@farcaster/miniapp-sdk";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  MiniAppContextType,
  UpdateClientContextParams,
} from "@/types/miniapp";

export const MiniAppContext = createContext<MiniAppContextType>({
  context: null,
  updateClientContext: () => {
    // no-op initially
  },
  notificationProxyUrl: "",
});

function MiniAppProviderContent({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<Context.MiniAppContext | null>(null);

  const updateClientContext = useCallback(
    ({ details, miniAppAdded }: UpdateClientContextParams) => {
      setContext((prevContext) => {
        if (!prevContext) {
          return null;
        }
        return {
          ...prevContext,
          client: {
            ...prevContext.client,
            notificationDetails: details ?? undefined,
            added: miniAppAdded ?? prevContext.client.added,
          },
        };
      });
    },
    []
  );

  useEffect(() => {
    sdk.on("miniAppAdded", ({ notificationDetails }) => {
      if (notificationDetails) {
        updateClientContext({
          details: notificationDetails,
          miniAppAdded: true,
        });
      }
    });

    sdk.on("miniAppAddRejected", ({ reason }) => {
      console.error("MiniApp add rejected", reason);
    });

    sdk.on("miniAppRemoved", () => {
      updateClientContext({
        details: undefined,
        miniAppAdded: false,
      });
    });

    sdk.on("notificationsEnabled", ({ notificationDetails }) => {
      updateClientContext({
        details: notificationDetails,
      });
    });

    sdk.on("notificationsDisabled", () => {
      updateClientContext({
        details: undefined,
      });
    });

    async function fetchContext() {
      try {
        // if not running in a frame, context resolves as undefined
        const miniAppContext = await sdk.context;
        setContext(miniAppContext);
      } catch (error) {
        console.error("Error fetching context:", error);
      }
    }

    fetchContext();

    return () => {
      sdk.removeAllListeners();
    };
  }, [updateClientContext]);

  const value = useMemo(
    () => ({
      context,
      updateClientContext,
      notificationProxyUrl: "/api/notify",
    }),
    [updateClientContext, context]
  );

  return <MiniAppContext value={value}>{children}</MiniAppContext>;
}

export function MiniAppProvider({ children }: { children: ReactNode }) {
  return <MiniAppProviderContent>{children}</MiniAppProviderContent>;
}
