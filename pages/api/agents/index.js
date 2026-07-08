import { listAgents } from '@/lib/store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ agents: listAgents() });
  }
  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
