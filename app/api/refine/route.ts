import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import z from "zod/v3";
import { zodToJsonSchema } from "zod-to-json-schema";

export async function POST(req: Request) {
  try {
    const { text, apiKey } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key is required" },
        { status: 401 }
      );
    }

    const ai = new GoogleGenAI({ vertexai: false, apiKey });

    const responseSchema = z.object({
      sentiment: z
        .string()
        .describe("Brief description of the detected sentiment"),
      reasoning: z
        .string()
        .describe("The internal reasoning process summarized"),
      suggestion: z.string().describe("The suggested rewritten text"),
      isNegative: z
        .boolean()
        .describe("Whether the text contains negative sentiment"),
    });

    const prompt = `<role>
You are a writing assistant specializing in emotional intelligence and constructive communication.
Your expertise is in transforming negative or hostile language into positive, empathetic alternatives while preserving the core message.
You are fluent in both English and Bahasa Indonesia languages.
</role>

<task>
Analyze the following text and provide a constructive alternative if it contains negative sentiment.
The text may be in English or Bahasa Indonesia - you must respond in the same language as the input.
</task>

<input>
${text}
</input>

<instructions>
Before providing your response, follow this step-by-step reasoning process:

1. **Language Detection**: Identify if the text is in English or Bahasa Indonesia. Your response must be in the SAME language.

2. **Sentiment Analysis**: Identify the emotional tone. Is it negative, aggressive, passive-aggressive, or neutral?

3. **Root Cause Identification**: Determine the underlying need, frustration, or concern being expressed. What does the writer actually want to communicate?

4. **Constructive Reframing**: If negative sentiment is detected, rewrite the text to:
   - Maintain the core message and intent
   - Use empathetic and professional language
   - Focus on solutions rather than blame
   - Be clear and direct without hostility
   - Use positive rephrasing strategies that transform negative tone into constructive communication

5. **Validation**: Ensure the rewritten text preserves the original meaning while improving the emotional tone.
</instructions>

<constraints>
- Keep the rewritten text approximately the same length as the original
- Do not change the fundamental meaning or request
- Maintain the writer's voice where possible
- If the text is already positive, acknowledge this and suggest minor improvements only
- CRITICAL: Respond in the same language as the input (English or Bahasa Indonesia)
</constraints>

<output_requirements>
You must provide your response in the exact JSON format specified, including:
- sentiment: A brief description of the detected emotional tone (in the same language as input)
- reasoning: Your internal analysis summarized in 2-3 sentences (in the same language as input)
- suggestion: The rewritten text (in the same language as input)
- isNegative: Boolean indicating if negative sentiment was detected
</output_requirements>`;

    const response = await ai.models
      .generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
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
    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
