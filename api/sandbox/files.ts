import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SandboxClient } from '@agent-infra/sandbox';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dirPath = "/workspace" } = req.body;
    const sandboxUrl = process.env.SANDBOX_URL || 'http://host.docker.internal:8080';
    const sandbox = new SandboxClient({ environment: sandboxUrl });
    const result = await sandbox.file.listPath({ path: dirPath });
    if (result.ok) {
      res.status(200).json({ files: (result.body as any)?.files || [] });
    } else {
      res.status(500).json({ error: "error" in result ? String((result as any).error) : "Failed to fetch files" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: String(error) });
  }
}
