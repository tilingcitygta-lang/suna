import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const resp = await fetch("https://backend.composio.dev/api/v3.1/connected_accounts", {
      headers: {
        "x-api-key": process.env.COMPOSIO_API_KEY!,
      },
    });
    const data = await resp.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
