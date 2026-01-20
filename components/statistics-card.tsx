import { BarChart3, MessageSquare, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Statistics = {
  totalAnalyses: number;
  negativeCount: number;
  positiveCount: number;
};

type StatisticsCardProps = {
  statistics: Statistics;
};

export function StatisticsCard({ statistics }: StatisticsCardProps) {
  if (statistics.totalAnalyses === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Card className="glass-card border-0 shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-12 sm:w-12 dark:bg-blue-900/30 dark:text-blue-400">
            <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="font-bold text-foreground text-xl sm:text-2xl">
              {statistics.totalAnalyses}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide sm:text-xs">
              Analyses
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 sm:h-12 sm:w-12 dark:bg-red-900/30 dark:text-red-400">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="font-bold text-foreground text-xl sm:text-2xl">
              {statistics.negativeCount}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide sm:text-xs">
              Reframed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card border-0 shadow-sm">
        <CardContent className="flex flex-col items-center gap-2 p-3 text-center sm:flex-row sm:gap-4 sm:p-4 sm:text-left">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-12 sm:w-12 dark:bg-green-900/30 dark:text-green-400">
            <ThumbsUp className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="font-bold text-foreground text-xl sm:text-2xl">
              {statistics.positiveCount}
            </p>
            <p className="font-medium text-[10px] text-muted-foreground uppercase tracking-wide sm:text-xs">
              Positive
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
