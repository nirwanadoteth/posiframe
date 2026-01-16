import { BarChart3, MessageSquare, ThumbsUp } from "lucide-react";

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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="glass-card flex items-center gap-4 rounded-xl p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <div>
          <p className="font-bold text-2xl text-foreground">
            {statistics.totalAnalyses}
          </p>
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Analyses
          </p>
        </div>
      </div>

      <div className="glass-card flex items-center gap-4 rounded-xl p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-bold text-2xl text-foreground">
            {statistics.negativeCount}
          </p>
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Reframed
          </p>
        </div>
      </div>

      <div className="glass-card flex items-center gap-4 rounded-xl p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
          <ThumbsUp className="h-6 w-6" />
        </div>
        <div>
          <p className="font-bold text-2xl text-foreground">
            {statistics.positiveCount}
          </p>
          <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
            Positive
          </p>
        </div>
      </div>
    </div>
  );
}
