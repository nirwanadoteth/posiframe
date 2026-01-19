"use client";

import { useCallback, useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { decryptData, encryptData } from "@/lib/crypto";
import { storage } from "@/lib/storage";

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
        const storedEncryptedKey = storage.getItem(STORAGE_KEYS.API_KEY);
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
        storage.setItem(STORAGE_KEYS.API_KEY, encrypted);
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
    storage.removeItem(STORAGE_KEYS.API_KEY);
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
