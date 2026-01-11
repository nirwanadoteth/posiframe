import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

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

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
      You are an intelligent writing assistant designed to help users manage emotions and maintain positive social interactions.
      Your task is to analyze the following text and offer a more positive and constructive alternative if it contains negative sentiment.

      Text to analyze: "${text}"

      Please follow this "Socratic Reasoning" process:
      1. Analyze the sentiment of the text. Is it negative, aggressive, or passive-aggressive?
      2. Ask yourself: What is the underlying frustration or need? How can this be expressed more constructively without changing the core meaning?
      3. Draft a rewrite that is empathetic, professional, and clear.

      Return the response in the following JSON format:
      {
        "sentiment": "Brief description of the detected sentiment",
        "reasoning": "Your internal reasoning process summarized",
        "suggestion": "The suggested rewritten text",
        "isNegative": true/false
      }
      Only return the JSON object, no markdown formatting.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
    });

    const textResponse = response.text;

    if (!textResponse) {
      throw new Error("No response from AI");
    }

    // Clean up potential markdown code blocks in response if Gemini adds them
    const cleanJson = textResponse.replace(/^```json\n|\n```$/g, "").trim();

    try {
      const jsonResponse = JSON.parse(cleanJson);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse AI response",
          raw: textResponse,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
