"use client";

import sdk from "@farcaster/miniapp-sdk";
import { captureException } from "@sentry/nextjs";
import { Flame, Share2, ShieldCheck, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { minikitConfig } from "@/minikit.config";

type Statistics = {
  totalAnalyses: number;
  negativeCount: number;
  positiveCount: number;
  streakCount: number;
};

type StatisticsCardProps = {
  statistics: Statistics;
  canShare?: boolean;
};

export function StatisticsCard({
  statistics,
  canShare = true,
}: StatisticsCardProps) {
  if (statistics.totalAnalyses === 0) {
    return (
      <Card className="glass-card border-primary/20 border-dashed bg-primary/5">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <Trophy className="mb-2 h-8 w-8 text-primary/40" />
          <p className="font-medium text-muted-foreground text-sm">
            Start analyzing messages to unlock your stats!
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleShare = async () => {
    try {
      const shareUrl = `${minikitConfig.miniapp.homeUrl}/share?streak=${statistics.streakCount}&count=${statistics.negativeCount}`;
      const text = `I've reframed ${statistics.negativeCount} toxic messages and maintained a ${statistics.streakCount}-day positivity streak with PosiFrame! 🧘 ✨\n\nTurning vibes into value. ${shareUrl}`;

      await sdk.actions.composeCast({
        text,
        embeds: [],
      });
    } catch (error) {
      captureException(error);
      toast.error("Could not open Farcaster composer");
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="glass-card relative overflow-hidden border-orange-500/20 bg-orange-500/5">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Flame className="h-6 w-6 fill-orange-600 text-orange-600 dark:fill-orange-400 dark:text-orange-400" />
            </div>
            <p className="font-bold text-2xl text-foreground">
              {statistics.streakCount}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
              Day Streak
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/20 bg-blue-500/5">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <p className="font-bold text-2xl text-foreground">
              {statistics.negativeCount}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
              Toxic Blocked
            </p>
          </CardContent>
        </Card>
      </div>

      {canShare && (
        <Button
          className="w-full gap-2 bg-primary text-primary-foreground shadow-md transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-lg active:scale-95"
          onClick={handleShare}
          size="sm"
          variant="outline"
        >
          <Share2 className="h-4 w-4" />
          Share My Impact
        </Button>
      )}
    </div>
  );
}
