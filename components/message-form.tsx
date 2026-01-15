
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    <div className="space-y-2">
      <h2 className="font-semibold text-lg">Draft your message</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <Textarea
                  className="min-h-[150px] resize-y bg-white dark:bg-zinc-900"
                  placeholder="Type your message in English or Indonesian..."
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              disabled={isAnalyzing || isDisabled}
              type="submit"
              variant="outline"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze & Refine"}
            </Button>
            <Button
              disabled={isPublishing || isDisabled || !hasContext}
              onClick={onPublish}
              type="button"
            >
              {isPublishing ? "Publishing..." : "Publish to Farcaster"}
            </Button>
          </div>
        </form>
      </Form>
      {!hasContext && (
        <p className="text-right text-muted-foreground text-xs">
          💡 Open in Farcaster app to publish casts
        </p>
      )}
    </div>
  );
}
