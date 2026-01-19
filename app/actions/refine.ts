"use server";

import { GoogleGenAI } from "@google/genai";
import z from "zod/v3";
import { zodToJsonSchema } from "zod-to-json-schema";
import { AI_CONFIG } from "@/lib/constants";
import { buildRefinePrompt } from "@/lib/prompt-templates";

const responseSchema = z.object({
  sentiment: z.string().describe("Brief description of the detected sentiment"),
  reasoning: z.string().describe("The internal reasoning process summarized"),
  suggestion: z.string().describe("The suggested rewritten text"),
  isNegative: z
    .boolean()
    .describe("Whether the text contains negative sentiment"),
});

export type RefineResult = z.infer<typeof responseSchema>;

export type RefineActionState = {
  success?: boolean;
  data?: RefineResult;
  error?: string;
};

export async function refineMessage(
  _prevState: RefineActionState,
  formData: FormData
): Promise<RefineActionState> {
  const text = formData.get("text") as string;
  const apiKey = formData.get("apiKey") as string;

  if (!text) {
    return { error: "Text is required" };
  }

  if (!apiKey) {
    return { error: "API Key is required" };
  }

  try {
    const ai = new GoogleGenAI({ vertexai: false, apiKey });
    const prompt = buildRefinePrompt(text);

    const response = await ai.models
      .generateContent({
        model: AI_CONFIG.MODEL,
        contents: prompt,
        config: {
          responseMimeType: AI_CONFIG.RESPONSE_MIME_TYPE,
          responseJsonSchema: zodToJsonSchema(responseSchema),
        },
      })
      .catch((error) => {
        throw new Error(`AI Generation Error: ${error.message}`);
      });

    const textResponse = response.text;

    if (!textResponse) {
      throw new Error("No response from AI");
    }

    const jsonResponse = responseSchema.parse(JSON.parse(textResponse));
    return { success: true, data: jsonResponse };
  } catch (error) {
    console.error("Refine Action Error:", error);
    return {
      error: error instanceof Error ? error.message : "Internal Server Error",
    };
  }
}
