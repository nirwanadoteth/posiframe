
import { Button } from "@/components/ui/button";

type RefineResult = {
  sentiment: string;
  reasoning: string;
  suggestion: string;
  isNegative: boolean;
};

type ResultCardProps = {
  result: RefineResult;
  onKeepOriginal: () => void;
  onUseSuggestion: () => void;
  onUseAndPublish?: () => void;
  isPublishing?: boolean;
  canPublish?: boolean;
};

export function ResultCard({
  result,
  onKeepOriginal,
  onUseSuggestion,
  onUseAndPublish,
  isPublishing = false,
  canPublish = false,
}: ResultCardProps) {
  return (
    <div className="fade-in slide-in-from-bottom-4 animate-in space-y-6 rounded-lg border bg-white p-6 shadow-sm duration-500 dark:bg-zinc-900">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-muted-foreground text-sm">
            Sentiment Analysis
          </h3>
          <p
            className={`font-semibold text-sm ${result.isNegative ? "text-red-500" : "text-green-500"}`}
          >
            {result.sentiment}
          </p>
        </div>

        <div>
          <h3 className="font-medium text-muted-foreground text-sm">
            Reasoning
          </h3>
          <p className="text-sm text-zinc-600 italic dark:text-zinc-400">
            "{result.reasoning}"
          </p>
        </div>

        <div className="rounded-md border border-blue-100 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/10">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Suggested Rewrite:
          </h3>
          <p className="text-blue-800 text-lg dark:text-blue-200">
            {result.suggestion}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onKeepOriginal} variant="outline">
          Keep Original
        </Button>
        <Button onClick={onUseSuggestion} variant="secondary">
          Use Suggestion
        </Button>
        {canPublish && onUseAndPublish && (
          <Button disabled={isPublishing} onClick={onUseAndPublish}>
            {isPublishing ? "Publishing..." : "Use & Publish"}
          </Button>
        )}
      </div>
    </div>
  );
}
