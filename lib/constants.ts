/** Storage keys used throughout the application */
export const STORAGE_KEYS = {
  API_KEY: "gemini_api_key_secure",
  STATISTICS: "posiframe_statistics",
} as const;

/** AI Model configuration */
export const AI_CONFIG = {
  MODEL: "gemini-2.5-flash",
  RESPONSE_MIME_TYPE: "application/json",
} as const;
