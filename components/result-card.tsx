import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card className="fade-in slide-in-from-bottom-4 animate-in duration-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Analysis Result</CardTitle>
          <Badge variant={result.isNegative ? "destructive" : "default"}>
            {result.sentiment}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-muted-foreground text-sm">
            Reasoning
          </h3>
          <p className="text-sm text-zinc-600 italic dark:text-zinc-400">
            "{result.reasoning}"
          </p>
        </div>

        <div className="rounded-md border border-blue-100 bg-blue-50 p-2 dark:border-blue-900 dark:bg-blue-900/10">
          <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">
            Suggested Rewrite:
          </h3>
          <p className="text-blue-800 text-lg dark:text-blue-200">
            {result.suggestion}
          </p>
        </div>

        <div className="flex justify-end gap-3">
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
      </CardContent>
    </Card>
  );
}
