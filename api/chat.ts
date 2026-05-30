import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Composio } from '@composio/core';
import { GoogleProvider } from '@composio/google';
import { GoogleGenAI, type Part } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId = "user_123", integrations = [], model = "gemini-3.1-pro-preview" } = req.body;

    if (!process.env.COMPOSIO_API_KEY || !process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "Missing API keys" });
    }

    const composio = new Composio({
      provider: new GoogleProvider(),
      apiKey: process.env.COMPOSIO_API_KEY,
    });
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const session = await composio.create(sessionId);
    let tools: any[] = await session.tools();

    function deepRemoveExamples(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(deepRemoveExamples);
      } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
          if (key !== 'examples') {
            newObj[key] = deepRemoveExamples(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    }

    tools = deepRemoveExamples(tools);

    let contextMsg = message;
    if (integrations && integrations.length > 0) {
      contextMsg = `[Active Integrations Context: ${integrations.join(", ")}]\n\n${message}`;
    }

    const chat = ai.chats.create({
      model: model,
      config: {
        tools: [{ functionDeclarations: tools }],
      },
    });

    let response = await chat.sendMessage({
      message: contextMsg,
    });

    while (response.functionCalls && response.functionCalls.length > 0) {
      const parts: Part[] = [];
      for (const fc of response.functionCalls) {
        const result = await composio.provider.executeToolCall(sessionId, {
          name: fc.name || '',
          args: (fc.args || {}) as Record<string, unknown>,
        });
        parts.push({
          functionResponse: {
            id: fc.id || "",
            name: fc.name || "",
            response: JSON.parse(result),
          },
        });
      }
      response = await chat.sendMessage({ message: parts });
    }

    res.status(200).json({ text: response.text, usageMetadata: response.usageMetadata });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
}
