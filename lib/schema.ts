import { z } from "zod";

export const formSchemaRefine = z.object({
  text: z.string().min(1, "Teks tidak boleh kosong"),
  apiKey: z.string().min(1, "API Key diperlukan"),
});

export const messageSchema = z.object({
  text: z.string().min(1, "Teks tidak boleh kosong"),
});

export const apiKeySchema = z.object({
  apiKey: z.string().min(1, "API Key diperlukan"),
});

export type RefineTypes = z.infer<typeof formSchemaRefine>;
export type MessageTypes = z.infer<typeof messageSchema>;
export type ApiKeyTypes = z.infer<typeof apiKeySchema>;
