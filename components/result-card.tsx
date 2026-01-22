import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { minikitConfig } from "@/minikit.config";

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
  onUseAndPublish?: (shareUrl?: string) => void;
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
  const handleUseAndPublish = () => {
    if (!onUseAndPublish) {
      return;
    }

    const shareUrl = `${minikitConfig.miniapp.homeUrl}/share?text=${encodeURIComponent(
      result.suggestion
    )}`;

    onUseAndPublish(shareUrl);
  };

  return (
    <Card className="glass-card fade-in slide-in-from-bottom-8 relative animate-in overflow-hidden border-0 shadow-xl duration-500">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-heading font-semibold text-lg">
          Analysis Result
        </CardTitle>
        <Badge
          className={cn(
            "px-3 py-1 font-medium",
            !result.isNegative &&
              "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
          )}
          variant={result.isNegative ? "destructive" : "default"}
        >
          {result.sentiment}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <h3 className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
            Analysis & Reasoning
          </h3>
          <p className="text-muted-foreground/90 text-sm italic leading-relaxed">
            "{result.reasoning}"
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 p-4 shadow-sm dark:from-primary/10 dark:to-purple-500/10">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <h3 className="relative mb-2 font-semibold text-primary/80 text-sm">
            ✨ Suggested Reframing:
          </h3>
          <p className="relative font-medium text-foreground text-lg sm:text-xl">
            {result.suggestion}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Button
            className="order-3 text-muted-foreground hover:text-foreground sm:order-1"
            onClick={onKeepOriginal}
            size="sm"
            variant="ghost"
          >
            Keep Original
          </Button>
          <Button
            className="order-2 border-primary/20 hover:bg-primary/5"
            onClick={onUseSuggestion}
            size="sm"
            variant="outline"
          >
            Use Suggestion
          </Button>
          {canPublish && onUseAndPublish && (
            <Button
              className="order-1 bg-primary text-primary-foreground hover:bg-primary/90 sm:order-3"
              disabled={isPublishing}
              onClick={handleUseAndPublish}
              size="sm"
            >
              {isPublishing ? "Sharing..." : "Use & Share"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
