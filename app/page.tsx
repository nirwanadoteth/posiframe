"use client";

import sdk from "@farcaster/miniapp-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { ApiKeyCard } from "@/components/api-key-card";
import { MessageForm } from "@/components/message-form";
import { ResultCard } from "@/components/result-card";
import { StatisticsCard } from "@/components/statistics-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error, {
        description: "Please try again",
        duration: 5000,
      });
    }
  }, [error]);

  // Show success toast
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
      });
      setSuccessMessage("");
    }
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
    <>
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
              onClick={clearKey}
              size="sm"
              variant="ghost"
            >
              Clear Key
            </Button>
          </header>

          <StatisticsCard statistics={statistics} />

          <MessageFormWrapper
            hasContext={!!context}
            isAnalyzing={isAnalyzing}
            isPublishing={isPublishing}
            onPublish={handlePublishToFarcaster}
            onSubmit={handleRefine}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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
      <Toaster position="top-center" richColors />
    </>
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
