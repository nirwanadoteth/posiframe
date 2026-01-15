import { z } from "zod";

export const formSchemaRefine = z.object({
  text: z.string().min(1, "Text is required"),
  apiKey: z.string().min(1, "API Key is required"),
});

export const messageSchema = z.object({
  text: z.string().min(1, "Text is required"),
});

export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
});

export type RefineTypes = z.infer<typeof formSchemaRefine>;
export type MessageTypes = z.infer<typeof messageSchema>;
export type ApiKeyTypes = z.infer<typeof apiKeySchema>;
