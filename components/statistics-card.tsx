
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
    <div className="grid grid-cols-3 gap-4 rounded-lg bg-white p-4 shadow-sm dark:bg-zinc-900">
      <div className="text-center">
        <p className="font-bold text-2xl text-blue-600 dark:text-blue-400">
          {statistics.totalAnalyses}
        </p>
        <p className="text-muted-foreground text-xs">Total Analyses</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-2xl text-red-600 dark:text-red-400">
          {statistics.negativeCount}
        </p>
        <p className="text-muted-foreground text-xs">Negative Detected</p>
      </div>
      <div className="text-center">
        <p className="font-bold text-2xl text-green-600 dark:text-green-400">
          {statistics.positiveCount}
        </p>
        <p className="text-muted-foreground text-xs">Already Positive</p>
      </div>
    </div>
  );
}
