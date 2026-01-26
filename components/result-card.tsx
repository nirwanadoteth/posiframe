import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
      <div className="absolute inset-x-0 -top-px h-px bg-primary/20" />

      <CardHeader>
        <CardTitle>Analysis Result</CardTitle>
        <CardDescription>{result.sentiment}</CardDescription>
        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Badge
                  className={cn(
                    "cursor-help font-medium",
                    !result.isNegative &&
                      "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                  )}
                  variant={result.isNegative ? "destructive" : "default"}
                >
                  {result.isNegative ? "Negative" : "Positive"}
                </Badge>
              }
            />
            <TooltipContent>
              <p>
                {result.isNegative
                  ? "This message was flagged as having negative sentiment"
                  : "This message has positive sentiment"}
              </p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
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

        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />

          <h3 className="relative mb-2 font-semibold text-primary/80 text-sm">
            ✨ Suggested Reframing:
          </h3>
          <p className="relative font-medium text-foreground text-lg sm:text-xl">
            {result.suggestion}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="order-3 text-muted-foreground transition-transform hover:text-foreground active:scale-95 sm:order-1"
                  onClick={onKeepOriginal}
                  size="sm"
                  variant="ghost"
                >
                  Keep Original
                </Button>
              }
            />
            <TooltipContent>
              <p>Use your original text without changes</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="order-2 border-primary/20 transition-transform hover:bg-primary/5 active:scale-95"
                  onClick={onUseSuggestion}
                  size="sm"
                  variant="outline"
                >
                  Use Suggestion
                </Button>
              }
            />
            <TooltipContent>
              <p>Copy the suggested message</p>
            </TooltipContent>
          </Tooltip>
          {canPublish && onUseAndPublish && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="order-1 bg-primary text-primary-foreground transition-transform hover:bg-primary/90 active:scale-95 sm:order-3"
                    disabled={isPublishing}
                    onClick={handleUseAndPublish}
                    size="sm"
                  >
                    {isPublishing ? "Sharing..." : "Use & Share"}
                  </Button>
                }
              />
              <TooltipContent>
                <p>Use suggestion and share to Farcaster</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
