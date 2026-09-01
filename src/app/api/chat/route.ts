// @ts-nocheck
import { generateChatReply } from "@/lib/genai";

import rateLimit from "@/lib/rate-limit";

const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    try {
      await limiter.check(10, ip); // 10 messages per minute
    } catch {
      return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
        status: 429,
        headers: { "Content-Type": "application/json" }
      });
    }

    const { messages, locale } = await req.json();

    const stream = await generateChatReply(messages, locale || 'en');

    // Return the stream as text/plain as it was working correctly with the UI
    return new Response(stream.toReadableStream(), {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
