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
        <Card className="glass-card relative overflow-hidden border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent">
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
              <Flame className="h-6 w-6 fill-orange-600 text-orange-600 dark:fill-orange-400 dark:text-orange-400" />
            </div>
              <div className="mb-2 w-full max-w-[80px]">
              <div className="h-2 w-full overflow-hidden rounded-full bg-orange-200 dark:bg-orange-900/50">
             <div 
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-500"
              style={{ width: `${Math.min((statistics.streakCount % 7) * (100/7), 100)}%` }}
              />
          </div>
      <span className="mt-1 block text-muted-foreground text-xs">
        {statistics.streakCount % 7 || 7}/7 days
      </span>
    </div>
            <p className="font-bold text-2xl text-foreground">
              {statistics.streakCount}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide">
              Day Streak
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent">
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
          className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 shadow-md transition-all hover:scale-[1.02] hover:shadow-lg active:scale-95"
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
