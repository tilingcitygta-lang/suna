import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Composio } from '@composio/core';
import { GoogleProvider } from '@composio/google';
import { GoogleGenAI, type Part } from '@google/genai';
import { SandboxClient } from '@agent-infra/sandbox';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Sandbox reverse proxy
  const sandboxTarget = 'http://host.docker.internal:8080';
  app.use(['/vnc', '/code-server', '/jupyter', '/proxy'], createProxyMiddleware({
    target: sandboxTarget,
    changeOrigin: true,
    ws: true
  }));

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/composio/toolkits", async (req, res) => {
    try {
      const resp = await fetch("https://backend.composio.dev/api/v3.1/toolkits?limit=100&sort_by=usage", {
        headers: {
          "x-api-key": process.env.COMPOSIO_API_KEY!,
          "Content-Type": "application/json",
        },
      });
      const data = await resp.json();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.get("/api/composio/connected_accounts", async (req, res) => {
    try {
      const resp = await fetch("https://backend.composio.dev/api/v3.1/connected_accounts", {
        headers: {
          "x-api-key": process.env.COMPOSIO_API_KEY!,
        },
      });
      const data = await resp.json();
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  app.post("/api/composio/connect", async (req, res) => {
    try {
      const { appName } = req.body;
      // @ts-ignore - bypassing typings clash between agents and composio-core
      const client = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
      // @ts-ignore
      const connection = await client.connectedAccounts.initiate({ appName, entityId: "default" });
      
      res.json({ redirectUrl: connection.redirectUrl });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: String(e) });
    }
  });

  app.post("/api/sandbox/exec", async (req, res) => {
    try {
      const { command } = req.body;
      const sandboxUrl = 'http://host.docker.internal:8080';
      const sandbox = new SandboxClient({ environment: sandboxUrl });
      const result = await sandbox.shell.execCommand({ command });
      if (result.ok) {
        res.json({ output: result.body?.data?.output });
      } else {
        res.status(500).json({ error: "error" in result ? String((result as any).error) : "Unknown error" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/sandbox/stats", async (req, res) => {
    try {
      const sandboxUrl = 'http://host.docker.internal:8080';
      const sandbox = new SandboxClient({ environment: sandboxUrl });
      const command = "top -bn1 | grep 'Cpu(s)' && echo '----' && free -m";
      const result = await sandbox.shell.execCommand({ command });
      if (result.ok) {
        res.json({ stats: result.body?.data?.output });
      } else {
        res.status(500).json({ error: "Failed to fetch stats" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/sandbox/files", async (req, res) => {
    try {
      const { dirPath = "/workspace" } = req.body;
      const sandboxUrl = 'http://host.docker.internal:8080';
      const sandbox = new SandboxClient({ environment: sandboxUrl });
      const result = await sandbox.file.listPath({ path: dirPath });
      if (result.ok) {
        res.json({ files: (result.body as any)?.files || [] });
      } else {
        res.status(500).json({ error: "error" in result ? String((result as any).error) : "Failed to fetch files" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/sandbox/save-config", async (req, res) => {
    try {
      const { config } = req.body;
      const sandboxUrl = 'http://host.docker.internal:8080';
      const sandbox = new SandboxClient({ environment: sandboxUrl });
      
      const configStr = JSON.stringify(config).replace(/"/g, '\\\\\\"');
      const command = `echo "${configStr}" > /workspace/aio_session.json`;
      const result = await sandbox.shell.execCommand({ command });
      if (result.ok) {
        res.json({ success: true });
      } else {
        res.status(500).json({ error: "Failed to save config" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.post("/api/chat", async (req, res) => {
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

      // Create a session for your user
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

      // Agentic loop — keep executing tool calls until the model responds with text
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

      res.json({ text: response.text, usageMetadata: response.usageMetadata });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
