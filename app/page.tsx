"use client";

import sdk from "@farcaster/miniapp-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { type RefineResult, refineMessage } from "@/app/actions/refine";
import { ApiKeyCard } from "@/components/api-key-card";
import { MessageForm } from "@/components/message-form";
import { OnboardingModal } from "@/components/onboarding-modal";
import { ResultCard } from "@/components/result-card";
import { StatisticsCard } from "@/components/statistics-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMiniApp } from "@/hooks/use-mini-app";
import { useStatistics } from "@/hooks/use-statistics";
import { useStoredApiKey } from "@/hooks/use-stored-api-key";
import {
  type ApiKeyTypes,
  type MessageTypes,
  messageSchema,
} from "@/lib/schema";

export default function Home() {
  // Mini app context and initialization
  const { context, setMiniAppReady } = useMiniApp();

  // Custom hooks for state management
  const { apiKey, hasKey, saveKey, clearKey } = useStoredApiKey();
  const { statistics, updateStatistics } = useStatistics();

  // UI state management
  const [isPending, startTransition] = useTransition();
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<RefineResult | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

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
        setShowApiKeyDialog(false);
        toast.success("API Key saved! You can now refine messages.");
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

      // PROGRESSIVE AUTH: Check for key here, not at page load
      if (!hasKey) {
        setShowApiKeyDialog(true);
        return;
      }

      setError("");
      setResult(null);

      startTransition(async () => {
        const payload = new FormData();
        payload.append("text", formData.text);
        payload.append("apiKey", apiKey);

        const result = await refineMessage(
          {}, // prevState
          payload
        );

        if (result.error) {
          setError(result.error);
        } else if (result.success && result.data) {
          setResult(result.data);
          updateStatistics(result.data.isNegative);
        }
      });
    },
    [apiKey, hasKey, updateStatistics]
  );

  // Handle using suggestion in form
  const handleUseSuggestion = useCallback(() => {
    if (result) {
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

        setSuccessMessage("Successfully opened composer! 🎉");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to publish");
      } finally {
        setIsPublishing(false);
      }
    },
    [context]
  );

  // User info from mini app context
  const user = context?.user;

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <div className="fade-in slide-in-from-bottom-4 w-full max-w-2xl animate-in space-y-4 duration-700">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-full bg-background/50 px-2 py-1 backdrop-blur-sm sm:px-3 sm:py-1.5">
              <Avatar className="h-7 w-7 ring-2 ring-primary/20 sm:h-8 sm:w-8">
                {user?.pfpUrl ? (
                  <AvatarImage
                    alt={user.displayName || user.username || "Profile"}
                    src={user.pfpUrl}
                  />
                ) : null}
                <AvatarFallback className="text-xs">
                  {user?.username?.slice(0, 2).toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground text-sm">
                {user?.username ? `@${user.username}` : "Guest"}
              </span>
            </div>
            {hasKey && (
              <Button
                className="text-muted-foreground hover:text-foreground"
                onClick={clearKey}
                size="sm"
                variant="ghost"
              >
                Clear Key
              </Button>
            )}
          </header>

          <StatisticsCard statistics={statistics} />

          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <MessageFormWrapper
              hasContext={!!context}
              isAnalyzing={isPending}
              isPublishing={isPublishing}
              onPublish={handlePublishToFarcaster}
              onSubmit={handleRefine}
              // Pre-fill for demo if desired, or leave empty
            />
          </div>

          {error && (
            <Alert
              className="fade-in zoom-in-95 animate-in duration-300"
              variant="destructive"
            >
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

          {/* API Key Modal */}
          <Dialog onOpenChange={setShowApiKeyDialog} open={showApiKeyDialog}>
            <DialogContent className="sm:max-w-md">
              <DialogTitle className="sr-only">
                Connect Gemini API Key
              </DialogTitle>
              <ApiKeyCard isLoading={isPending} onSave={handleSaveKey} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal username={user?.username} />

      <Toaster closeButton position="top-center" richColors theme="system" />
    </>
  );
}

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
