"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { decryptData, encryptData } from "@/lib/crypto";

type RefineResult = {
  sentiment: string;
  reasoning: string;
  suggestion: string;
  isNegative: boolean;
};

export default function Home() {
  const [apiKey, setApiKey] = useState<string>("");
  const [hasKey, setHasKey] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RefineResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStoredKey = async () => {
      const storedEncryptedKey = localStorage.getItem("gemini_api_key_secure");
      if (storedEncryptedKey) {
        const decryptedKey = await decryptData(storedEncryptedKey);
        if (decryptedKey) {
          setApiKey(decryptedKey);
          setHasKey(true);
        }
      }
    };
    loadStoredKey();
  }, []);

  const handleSaveKeyWithEncryption = async (keyToSave: string) => {
    if (keyToSave.trim()) {
      const encrypted = await encryptData(keyToSave.trim());
      if (encrypted) {
        localStorage.setItem("gemini_api_key_secure", encrypted);
        setApiKey(keyToSave.trim());
        setHasKey(true);
      }
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key_secure");
    setApiKey("");
    setHasKey(false);
    setResult(null);
  };

  const handleRefine = async () => {
    if (!text.trim()) {
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to refine text");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const useSuggestion = () => {
    if (result) {
      setText(result.suggestion);
      setResult(null);
    }
  };

  if (!hasKey) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-md">
          <h1 className="font-bold text-2xl">Configure API Key</h1>
          <p className="text-muted-foreground text-sm">
            To use this feature, please enter your Google Gemini API Key. Your
            key is stored locally on your device.
          </p>
          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter Gemini API Key"
            type="password"
            value={apiKey}
          />
          <Button
            className="w-full"
            onClick={() => handleSaveKeyWithEncryption(apiKey)}
          >
            Save Key
          </Button>
          <p className="text-muted-foreground text-xs">
            Don't have a key?{" "}
            <a
              className="underline"
              href="https://aistudio.google.com/app/apikey"
              rel="noopener noreferrer"
              target="_blank"
            >
              Get one here
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-4 sm:p-8 dark:bg-black">
      <div className="w-full max-w-2xl space-y-6">
        <header className="flex items-center justify-between border-b pb-4">
          <h1 className="font-bold text-2xl">PosiFrame</h1>
          <Button
            className="text-muted-foreground text-xs"
            onClick={handleClearKey}
            size="sm"
            variant="ghost"
          >
            Clear Key
          </Button>
        </header>

        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Draft your message</h2>
          <Textarea
            className="min-h-[150px] resize-y bg-white dark:bg-zinc-900"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here..."
            value={text}
          />
          <div className="flex justify-end">
            <Button disabled={loading || !text.trim()} onClick={handleRefine}>
              {loading ? "Analyzing..." : "Analyze & Refine"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm dark:bg-red-900/10">
            {error}
          </div>
        )}

        {result && (
          <div className="fade-in slide-in-from-bottom-4 animate-in space-y-6 rounded-lg border bg-white p-6 shadow-sm duration-500 dark:bg-zinc-900">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-muted-foreground text-sm">
                  Sentiment Analysis
                </h3>
                <p
                  className={`font-semibold text-sm ${result.isNegative ? "text-red-500" : "text-green-500"}`}
                >
                  {result.sentiment}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-muted-foreground text-sm">
                  Reasoning
                </h3>
                <p className="text-sm text-zinc-600 italic dark:text-zinc-400">
                  "{result.reasoning}"
                </p>
              </div>

              <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/10">
                <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
                  Suggested Rewrite:
                </h3>
                <p className="text-blue-800 text-lg dark:text-blue-200">
                  {result.suggestion}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button onClick={() => setResult(null)} variant="outline">
                Keep Original
              </Button>
              <Button onClick={useSuggestion}>Use Suggestion</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
