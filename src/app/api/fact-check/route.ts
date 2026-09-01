import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

// Initialize the SDK. It automatically picks up GEMINI_API_KEY from the environment.
const ai = new GoogleGenAI({});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: "You are a Census fact-checker. Refute myths in user language, cite Census Act 1948.",
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    factCheck: {
                        type: "STRING",
                        description: "The fact-checked response explaining why the myth is false."
                    },
                    citation: {
                        type: "STRING",
                        description: "Citation from Census Act 1948 or related laws."
                    }
                },
                required: ["factCheck", "citation"]
            }
        }
    });

    return NextResponse.json({ result: response.text });
  } catch (error) {
    console.error('Fact check error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
