"use client";

import sdk from "@farcaster/miniapp-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ApiKeyCard } from "@/components/api-key-card";
import { MessageForm } from "@/components/message-form";
import { ResultCard } from "@/components/result-card";
import { StatisticsCard } from "@/components/statistics-card";
import { Button } from "@/components/ui/button";
import { useMiniApp } from "@/hooks/use-mini-app";
import { useStatistics } from "@/hooks/use-statistics";
import { useStoredApiKey } from "@/hooks/use-stored-api-key";
import {
  type ApiKeyTypes,
  type MessageTypes,
  messageSchema,
} from "@/lib/schema";

type RefineResult = {
  sentiment: string;
  reasoning: string;
  suggestion: string;
  isNegative: boolean;
};

export default function Home() {
  // Mini app context and initialization
  const { context, setMiniAppReady } = useMiniApp();

  // Custom hooks for state management
  const { apiKey, hasKey, saveKey, clearKey } = useStoredApiKey();
  const { statistics, updateStatistics } = useStatistics();

  // UI state management
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<RefineResult | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Initialize mini app on mount
  useEffect(() => {
    setMiniAppReady();
  }, [setMiniAppReady]);

  // Auto-clear success message after 3 seconds
  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  // Handle API key save
  const handleSaveKey = useCallback(
    async (data: ApiKeyTypes) => {
      const success = await saveKey(data.apiKey);
      if (success) {
        setError("");
      }
    },
    [saveKey]
  );

  // Handle text refinement
  const handleRefine = useCallback(
    async (formData: MessageTypes) => {
      if (!formData.text.trim()) {
        return;
      }

      setIsAnalyzing(true);
      setError("");
      setResult(null);

      try {
        const response = await fetch("/api/refine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: formData.text, apiKey }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to refine text");
        }

        setResult(data);
        updateStatistics(data.isNegative);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsAnalyzing(false);
      }
    },
    [apiKey, updateStatistics]
  );

  // Handle using suggestion in form
  const handleUseSuggestion = useCallback(() => {
    if (result) {
      // This is handled in the MessageForm component
      setResult(null);
    }
  }, [result]);

  // Handle Farcaster publish
  const handlePublishToFarcaster = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setError("Please enter text to publish");
        return;
      }

      setIsPublishing(true);
      setError("");
      setSuccessMessage("");

      try {
        if (!context) {
          throw new Error(
            "Not running in Farcaster. Please open this app from Farcaster."
          );
        }

        await sdk.actions.composeCast({
          text: text.trim(),
        });

        setSuccessMessage("Successfully opened Farcaster composer! 🎉");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to publish to Farcaster"
        );
      } finally {
        setIsPublishing(false);
      }
    },
    [context]
  );

  // Show API key setup screen
  if (!hasKey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-black">
        <ApiKeyCard isLoading={isAnalyzing} onSave={handleSaveKey} />
      </div>
    );
  }

  // Main app screen
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 p-4 sm:p-8 dark:bg-black">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="font-bold text-2xl">PosiFrame</h1>
            <p className="text-muted-foreground text-xs">
              Transform negative language into positive communication
            </p>
          </div>
          <Button
            className="text-muted-foreground text-xs"
            onClick={clearKey}
            size="sm"
            variant="ghost"
          >
            Clear Key
          </Button>
        </header>

        {/* Statistics */}
        <StatisticsCard statistics={statistics} />

        {/* Message Form */}
        <MessageFormWrapper
          hasContext={!!context}
          isAnalyzing={isAnalyzing}
          isPublishing={isPublishing}
          onPublish={handlePublishToFarcaster}
          onSubmit={handleRefine}
        />

        {/* Error Message */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 text-red-500 text-sm dark:bg-red-900/10">
            {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="fade-in slide-in-from-bottom-4 animate-in rounded-md bg-green-50 p-4 text-green-600 text-sm duration-500 dark:bg-green-900/10">
            {successMessage}
          </div>
        )}

        {/* Result Card */}
        {result && (
          <ResultCard
            canPublish={!!context}
            isPublishing={isPublishing}
            onKeepOriginal={() => setResult(null)}
            onUseAndPublish={() => {
              if (result) {
                handlePublishToFarcaster(result.suggestion);
                setResult(null);
              }
            }}
            onUseSuggestion={handleUseSuggestion}
            result={result}
          />
        )}
      </div>
    </div>
  );
}

// Wrapper component to manage form state
function MessageFormWrapper({
  onSubmit,
  onPublish,
  isAnalyzing,
  isPublishing,
  hasContext,
}: {
  onSubmit: (data: MessageTypes) => Promise<void>;
  onPublish: (text: string) => Promise<void>;
  isAnalyzing: boolean;
  isPublishing: boolean;
  hasContext: boolean;
}) {
  const form = useForm<MessageTypes>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(messageSchema),
  });

  const handlePublish = useCallback(async () => {
    const text = form.getValues("text");
    await onPublish(text);
    if (!isPublishing) {
      form.reset();
    }
  }, [form, onPublish, isPublishing]);

  return (
    <MessageForm
      hasContext={hasContext}
      isAnalyzing={isAnalyzing}
      isPublishing={isPublishing}
      onPublish={handlePublish}
      onSubmit={onSubmit}
    />
  );
}
