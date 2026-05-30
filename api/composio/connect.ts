import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Composio } from '@composio/core';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { appName } = req.body;
    // @ts-ignore
    const client = new Composio({ apiKey: process.env.COMPOSIO_API_KEY });
    // @ts-ignore
    const connection = await client.connectedAccounts.initiate({ appName, entityId: "default" });

    res.status(200).json({ redirectUrl: connection.redirectUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
}
