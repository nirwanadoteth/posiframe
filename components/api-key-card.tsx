import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type ApiKeyTypes, apiKeySchema } from "@/lib/schema";

type ApiKeyCardProps = {
  onSave: (data: ApiKeyTypes) => Promise<void>;
  isLoading?: boolean;
};

export function ApiKeyCard({ onSave, isLoading = false }: ApiKeyCardProps) {
  const form = useForm<ApiKeyTypes>({
    defaultValues: {
      apiKey: "",
    },
    resolver: zodResolver(apiKeySchema),
  });

  const handleSubmit = async (data: ApiKeyTypes) => {
    await onSave(data);
    form.reset();
  };

  return (
    <Card className="glass w-full max-w-md border-0 bg-white/50 shadow-2xl backdrop-blur-xl dark:bg-black/50">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="font-bold font-heading text-3xl tracking-tight">
          Welcome to <span className="text-primary">PosiFrame</span>
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground/80">
          Enter your Gemini API Key to start transforming your framing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <div className="grid gap-2">
                  <FormItem>
                    <Label
                      className="font-medium text-foreground"
                      htmlFor="apiKey"
                    >
                      API Key
                    </Label>
                    <Input
                      className="h-11 border-primary/20 bg-background/50 text-base transition-all focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10"
                      placeholder="Enter Gemini API Key"
                      type="password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button
              className="h-11 w-full bg-gradient-to-r from-primary to-purple-600 font-medium text-lg tracking-wide shadow-lg transition-all hover:scale-[1.02] hover:from-primary/90 hover:to-purple-600/90 hover:shadow-primary/25"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Validating..." : "Get Started"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center border-border/10 border-t bg-muted/20 pt-4 pb-6">
        <p className="text-muted-foreground text-sm">
          Don't have a key?{" "}
          <a
            className="inline-flex items-center gap-1 font-semibold text-primary decoration-2 underline-offset-2 hover:underline"
            href="https://aistudio.google.com/app/apikey"
            rel="noopener noreferrer"
            target="_blank"
          >
            Get one here
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}
