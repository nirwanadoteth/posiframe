"use client";

import sdk from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMiniApp } from "@/hooks/use-mini-app";
import { decryptData, encryptData } from "@/lib/crypto";

type RefineResult = {
  sentiment: string;
  reasoning: string;
  suggestion: string;
  isNegative: boolean;
};

type Statistics = {
  totalAnalyses: number;
  negativeCount: number;
  positiveCount: number;
};

export default function Home() {
  const { context, setMiniAppReady } = useMiniApp();
  const [apiKey, setApiKey] = useState<string>("");
  const [hasKey, setHasKey] = useState(false);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<RefineResult | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [statistics, setStatistics] = useState<Statistics>({
    totalAnalyses: 0,
    negativeCount: 0,
    positiveCount: 0,
  });

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

    const loadStatistics = () => {
      const storedStats = localStorage.getItem("posiframe_statistics");
      if (storedStats) {
        try {
          setStatistics(JSON.parse(storedStats));
        } catch (e) {
          console.error("Failed to load statistics", e);
        }
      }
    };

    loadStoredKey();
    loadStatistics();

    // Initialize mini app
    setMiniAppReady();
  }, [setMiniAppReady]);

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

      // Update statistics
      const newStats = {
        totalAnalyses: statistics.totalAnalyses + 1,
        negativeCount: data.isNegative
          ? statistics.negativeCount + 1
          : statistics.negativeCount,
        positiveCount: data.isNegative
          ? statistics.positiveCount
          : statistics.positiveCount + 1,
      };
      setStatistics(newStats);
      localStorage.setItem("posiframe_statistics", JSON.stringify(newStats));
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

  const handlePublishToFarcaster = async () => {
    if (!text.trim()) {
      setError("Please enter text to publish");
      return;
    }

    setPublishing(true);
    setError("");
    setSuccessMessage("");

    try {
      // Check if running in Farcaster mini app
      if (!context) {
        throw new Error(
          "Not running in Farcaster. Please open this app from Farcaster."
        );
      }

      // Use Farcaster SDK to compose a cast
      await sdk.actions.composeCast({
        text: text.trim(),
      });

      // Clear the text after opening composer
      setText("");
      setResult(null);
      setError("");
      setSuccessMessage("Successfully opened Farcaster composer! 🎉");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish to Farcaster"
      );
    } finally {
      setPublishing(false);
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
          <div>
            <h1 className="font-bold text-2xl">PosiFrame</h1>
            <p className="text-muted-foreground text-xs">
              Transform negative language into positive communication
            </p>
          </div>
          <Button
            className="text-muted-foreground text-xs"
            onClick={handleClearKey}
            size="sm"
            variant="ghost"
          >
            Clear Key
          </Button>
        </header>

        {/* Statistics Section */}
        {statistics.totalAnalyses > 0 && (
          <div className="grid grid-cols-3 gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
            <div className="text-center">
              <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                {statistics.totalAnalyses}
              </p>
              <p className="text-muted-foreground text-xs">Total Analyses</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-red-600 dark:text-red-400">
                {statistics.negativeCount}
              </p>
              <p className="text-muted-foreground text-xs">Negative Detected</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-2xl text-green-600 dark:text-green-400">
                {statistics.positiveCount}
              </p>
              <p className="text-muted-foreground text-xs">Already Positive</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-semibold text-lg">Draft your message</h2>
          <Textarea
            className="min-h-[150px] resize-y bg-white dark:bg-zinc-900"
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message in English or Indonesian..."
            value={text}
          />
          <div className="flex justify-end gap-2">
            <Button
              disabled={loading || !text.trim()}
              onClick={handleRefine}
              variant="outline"
            >
              {loading ? "Analyzing..." : "Analyze & Refine"}
            </Button>
            <Button
              disabled={publishing || !text.trim() || !context}
              onClick={handlePublishToFarcaster}
            >
              {publishing ? "Publishing..." : "Publish to Farcaster"}
            </Button>
          </div>
          {!context && (
            <p className="text-right text-muted-foreground text-xs">
              💡 Open in Farcaster app to publish casts
            </p>
          )}
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm dark:bg-red-900/10">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="fade-in slide-in-from-bottom-4 animate-in rounded-md bg-green-50 p-4 text-green-600 text-sm duration-500 dark:bg-green-900/10">
            {successMessage}
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
              <Button onClick={useSuggestion} variant="secondary">
                Use Suggestion
              </Button>
              {context && (
                <Button
                  disabled={publishing}
                  onClick={() => {
                    if (result) {
                      setText(result.suggestion);
                      setResult(null);
                      setTimeout(() => handlePublishToFarcaster(), 100);
                    }
                  }}
                >
                  {publishing ? "Publishing..." : "Use & Publish"}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
