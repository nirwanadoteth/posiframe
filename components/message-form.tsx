import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { type MessageTypes, messageSchema } from "@/lib/schema";

type MessageFormProps = {
  onSubmit: (data: MessageTypes) => Promise<void>;
  onPublish: () => Promise<void>;
  isAnalyzing?: boolean;
  isPublishing?: boolean;
  hasContext?: boolean;
};

export function MessageForm({
  onSubmit,
  onPublish,
  isAnalyzing = false,
  isPublishing = false,
  hasContext = false,
}: MessageFormProps) {
  const form = useForm<MessageTypes>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(messageSchema),
  });

  const textValue = form.watch("text");
  const isDisabled = !textValue.trim();

  const handleSubmit = async (data: MessageTypes) => {
    await onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading font-semibold text-foreground text-xl">
          Draft your message
        </h2>
        {!hasContext && (
          <Badge
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-500"
            variant="secondary"
          >
            Preview Mode
          </Badge>
        )}
      </div>

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <Textarea
                  className="min-h-[120px] resize-y border-border bg-white/50 text-base shadow-inner backdrop-blur-sm transition-all focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 sm:min-h-[150px] dark:bg-zinc-900/50 dark:focus:bg-zinc-900"
                  placeholder="Type your message here..."
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary"
              disabled={isAnalyzing || isDisabled}
              type="submit"
              variant="outline"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze & Refine"}
            </Button>
            <Button
              className="bg-gradient-to-r from-primary to-purple-600 shadow-md transition-all hover:from-primary/90 hover:to-purple-600/90 hover:shadow-primary/25"
              disabled={isPublishing || isDisabled || !hasContext}
              onClick={onPublish}
              type="button"
            >
              {isPublishing ? "Publishing..." : "Share to Feed"}
            </Button>
          </div>
        </form>
      </Form>
      {!hasContext && (
        <p className="flex items-center justify-end gap-1 text-muted-foreground text-xs italic">
          💡 Open in Farcaster/Base app to share directly
        </p>
      )}
    </div>
  );
}
