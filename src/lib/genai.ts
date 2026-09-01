import { GoogleGenAI } from "@google/genai";

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from process.env
const ai = new GoogleGenAI({});

export async function generateChatReply(messages: unknown[], locale: string) {
  // Instruct the model to be a census-context aware assistant and to reply in the user's locale
  const systemInstruction = `You are Bharat Census Sahayak, a helpful assistant for India's Census 2027. Answer questions strictly in the user's selected locale (detected: ${locale}). Ground claims about Census dates with official sources. Refuse misinformation politely.`;

  // Use generateContentStream for streaming responses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contents: messages as any,
    config: {
      systemInstruction,
      maxOutputTokens: 600,
    },
  });

  return stream;
}
