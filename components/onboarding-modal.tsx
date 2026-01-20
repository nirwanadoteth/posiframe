"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STORAGE_KEYS } from "@/lib/constants";
import { storage } from "@/lib/storage";

type OnboardingModalProps = {
  username?: string;
};

export function OnboardingModal({ username }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);

  // Check onboarding status on mount
  useEffect(() => {
    if (!hasCompletedOnboarding()) {
      setOpen(true);
    }
  }, []);

  const handleGetStarted = () => {
    storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, "true");
    setOpen(false);
  };

  const greeting = username ? `Hello, @${username}!` : "Welcome!";

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="font-bold font-heading text-2xl text-gradient tracking-tight sm:text-3xl">
            PosiFrame
          </DialogTitle>
          <DialogDescription className="space-y-2 text-base">
            <span className="block font-medium text-foreground">
              {greeting}
            </span>
            <span className="block text-muted-foreground">
              Transform negative vibes into positive connections.
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <Button
            className="w-full bg-gradient-to-r from-primary to-purple-600 font-medium shadow-lg transition-all hover:scale-[1.02] hover:from-primary/90 hover:to-purple-600/90"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Check if onboarding has been completed */
export function hasCompletedOnboarding(): boolean {
  return storage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === "true";
}
