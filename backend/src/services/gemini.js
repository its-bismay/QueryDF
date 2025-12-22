import { GoogleGenAI } from "@google/genai";
import ENV from "../lib/envConfig";

const ai = new GoogleGenAI({apiKey: ENV.geminiApiKey})

export async function generateAnswer({ query, contexts }) {

  const contextText = contexts
    .map((c, i) => `Source ${i + 1}:\n${c.text}`)
    .join("\n\n");

  const prompt = `
You are a helpful assistant.

Rules:
- Answer ONLY using the provided sources.
- If the answer is not present in the sources, respond with: "I don't know."
- Be concise and factual.

Question:
${query}

Sources:
${contextText}
`;


  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  })

  return response.text;
}