"use client";

import sdk from "@farcaster/miniapp-sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type RefineResult, refineMessage } from "@/app/actions/refine";
import { ApiKeyCard } from "@/components/api-key-card";
import { MessageForm } from "@/components/message-form";
import { ModeToggle } from "@/components/mode-toggle";
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

export function HomeContent({ initialText }: { initialText?: string }) {
  const { context, setMiniAppReady } = useMiniApp();
  const { apiKey, hasKey, saveKey, clearKey } = useStoredApiKey();
  const { statistics, updateStatistics } = useStatistics();

  const [result, setResult] = useState<RefineResult | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);

  const {
    mutate: refine,
    isPending,
    error: mutationError,
    reset: resetMutation,
  } = useMutation({
    mutationFn: async (formData: MessageTypes) => {
      const payload = new FormData();
      payload.append("text", formData.text);
      payload.append("apiKey", apiKey);

      const res = await refineMessage({}, payload);
      if (res.error) {
        throw new Error(res.error);
      }
      return res.data;
    },
    onSuccess: (data) => {
      if (data) {
        setResult(data);
        updateStatistics(data.isNegative);
      }
    },
  });

  useEffect(() => {
    setMiniAppReady();
  }, [setMiniAppReady]);

  useEffect(() => {
    if (mutationError) {
      toast.error(mutationError.message, {
        description: "Please try again",
        duration: 5000,
      });
    }
  }, [mutationError]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        duration: 3000,
      });
      setSuccessMessage("");
    }
  }, [successMessage]);

  const handleSaveKey = useCallback(
    async (data: ApiKeyTypes) => {
      const success = await saveKey(data.apiKey);
      if (success) {
        resetMutation();
        setShowApiKeyDialog(false);
        toast.success("API Key saved! You can now refine messages.");
      }
    },
    [saveKey, resetMutation]
  );

  const handleRefine = useCallback(
    (formData: MessageTypes) => {
      if (!formData.text.trim()) {
        return;
      }

      if (!hasKey) {
        setShowApiKeyDialog(true);
        return;
      }

      setResult(null);
      resetMutation();
      refine(formData);
    },
    [hasKey, refine, resetMutation]
  );

  const handleUseSuggestion = useCallback(() => {
    if (result) {
      setResult(null);
    }
  }, [result]);

  const handlePublishToFarcaster = useCallback(
    async (textOrUrl: string) => {
      if (!textOrUrl.trim()) {
        toast.error("Please enter text to publish");
        return;
      }

      setIsPublishing(true);
      resetMutation();
      setSuccessMessage("");

      try {
        if (!context) {
          throw new Error(
            "Not running in Farcaster. Please open this app from Farcaster."
          );
        }

        await sdk.actions.composeCast({
          text: textOrUrl.trim(),
        });

        setSuccessMessage("Successfully opened composer! 🎉");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to publish");
      } finally {
        setIsPublishing(false);
      }
    },
    [context, resetMutation]
  );

  const user = context?.user;

  return (
    <>
      <div className="flex flex-1 flex-col items-center justify-center p-3 sm:p-4">
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
            <div className="flex items-center gap-2">
              <ModeToggle />
              {hasKey && (
                <Button
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearKey}
                  size="sm"
                  variant="ghost"
                >
                  <span className="hidden sm:inline">Clear Key</span>
                  <span className="inline sm:hidden">Clear</span>
                </Button>
              )}
            </div>
          </header>

          <StatisticsCard canShare={!!context} statistics={statistics} />

          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <MessageFormWrapper
              hasContext={!!context}
              initialText={initialText}
              isAnalyzing={isPending}
              isPublishing={isPublishing}
              onPublish={handlePublishToFarcaster}
              onSubmit={handleRefine}
            />
          </div>

          {mutationError && (
            <Alert
              className="fade-in zoom-in-95 animate-in duration-300"
              variant="destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{mutationError.message}</AlertDescription>
            </Alert>
          )}

          {result && (
            <ResultCard
              canPublish={!!context}
              isPublishing={isPublishing}
              onKeepOriginal={() => setResult(null)}
              onUseAndPublish={(shareUrl) => {
                if (result) {
                  const contentToShare = shareUrl
                    ? `I just reframed my thoughts with PosiFrame! ✨\n\n${shareUrl}`
                    : result.suggestion;

                  handlePublishToFarcaster(contentToShare);
                  setResult(null);
                }
              }}
              onUseSuggestion={handleUseSuggestion}
              result={result}
            />
          )}

          <Dialog onOpenChange={setShowApiKeyDialog} open={showApiKeyDialog}>
            <DialogContent className="p-0 sm:max-w-md">
              <DialogTitle className="sr-only">
                Connect Gemini API Key
              </DialogTitle>
              <ApiKeyCard isLoading={isPending} onSave={handleSaveKey} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <OnboardingModal />
    </>
  );
}

function MessageFormWrapper({
  onSubmit,
  onPublish,
  isAnalyzing,
  isPublishing,
  hasContext,
  initialText,
}: {
  onSubmit: (data: MessageTypes) => Promise<void> | void;
  onPublish: (text: string) => Promise<void>;
  isAnalyzing: boolean;
  isPublishing: boolean;
  hasContext: boolean;
  initialText?: string;
}) {
  const form = useForm<MessageTypes>({
    defaultValues: {
      text: initialText || "",
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
