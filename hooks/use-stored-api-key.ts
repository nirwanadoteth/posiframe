"use client";

import { useCallback, useEffect, useState } from "react";
import { decryptData, encryptData } from "@/lib/crypto";

type UseStoredApiKeyReturn = {
  apiKey: string;
  hasKey: boolean;
  isLoading: boolean;
  saveKey: (key: string) => Promise<boolean>;
  clearKey: () => void;
};

export function useStoredApiKey(): UseStoredApiKeyReturn {
  const [apiKey, setApiKey] = useState<string>("");
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load key on mount
  useEffect(() => {
    const loadStoredKey = async () => {
      try {
        const storedEncryptedKey = localStorage.getItem(
          "gemini_api_key_secure"
        );
        if (storedEncryptedKey) {
          const decryptedKey = await decryptData(storedEncryptedKey);
          if (decryptedKey) {
            setApiKey(decryptedKey);
            setHasKey(true);
          }
        }
      } catch (error) {
        console.error("Failed to load stored API key:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredKey();
  }, []);

  const saveKey = useCallback(async (newKey: string): Promise<boolean> => {
    if (!newKey.trim()) {
      return false;
    }

    try {
      const encrypted = await encryptData(newKey.trim());
      if (encrypted) {
        localStorage.setItem("gemini_api_key_secure", encrypted);
        setApiKey(newKey.trim());
        setHasKey(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to save API key:", error);
      return false;
    }
  }, []);

  const clearKey = useCallback(() => {
    localStorage.removeItem("gemini_api_key_secure");
    setApiKey("");
    setHasKey(false);
  }, []);

  return {
    apiKey,
    hasKey,
    isLoading,
    saveKey,
    clearKey,
  };
}
