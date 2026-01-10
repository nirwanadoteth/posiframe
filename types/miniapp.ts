import type {
  Context,
  MiniAppNotificationDetails,
} from "@farcaster/miniapp-sdk";

export type UpdateClientContextParams = {
  details?: MiniAppNotificationDetails | null;
  miniAppAdded?: boolean;
};

export type MiniAppContextType = {
  context: Context.MiniAppContext | null;
  updateClientContext: (params: UpdateClientContextParams) => void;
  notificationProxyUrl: string;
};
