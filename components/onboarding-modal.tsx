"use client";

import { MessageSquareHeart, Wand2, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STORAGE_KEYS } from "@/lib/constants";
import { storage } from "@/lib/storage";

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Analysis",
    description: "Detects negative sentiment in your messages",
  },
  {
    icon: MessageSquareHeart,
    title: "Positive Reframing",
    description: "Suggests constructive alternatives",
  },
  {
    icon: Zap,
    title: "Quick Share",
    description: "Post directly to your Social feed",
  },
];

export function OnboardingModal() {
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

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="font-bold font-heading text-2xl text-primary tracking-tight">
            PosiFrame
          </DialogTitle>
          <DialogDescription>
            Transform negative vibes into positive connections
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            {features.map((feature) => (
              <div
                className="flex items-start gap-3 rounded-lg bg-muted/50 p-3"
                key={feature.title}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm">
                    {feature.title}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="font-medium text-foreground text-sm">How it works</p>
            <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
              Type your message, click "Analyze & Refine", and our AI will
              suggest a more positive version while keeping your intent intact.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full bg-primary font-medium shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Check if onboarding has been completed */
export function hasCompletedOnboarding(): boolean {
  return storage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === "true";
}
