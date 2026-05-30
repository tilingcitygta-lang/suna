import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SandboxClient } from '@agent-infra/sandbox';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { command } = req.body;
    const sandboxUrl = process.env.SANDBOX_URL || 'http://host.docker.internal:8080';
    const sandbox = new SandboxClient({ environment: sandboxUrl });
    const result = await sandbox.shell.execCommand({ command });
    if (result.ok) {
      res.status(200).json({ output: result.body?.data?.output });
    } else {
      res.status(500).json({ error: "error" in result ? String((result as any).error) : "Unknown error" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
}
