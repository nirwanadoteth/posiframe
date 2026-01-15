
import { zodResolver } from "@hookform/resolvers/zod";
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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Configure API Key</CardTitle>
        <CardDescription>
          To use this feature, please enter your Google Gemini API Key. Your key
          is stored locally on your device.
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
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      placeholder="Enter Gemini API Key"
                      type="password"
                      {...field}
                    />
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <Button className="mt-4 w-full" disabled={isLoading} type="submit">
              {isLoading ? "Saving..." : "Save Key"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-xs">
          Don't have a key?{" "}
          <a
            className="underline"
            href="https://aistudio.google.com/app/apikey"
            rel="noopener noreferrer"
            target="_blank"
          >
            Get one here
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
}
