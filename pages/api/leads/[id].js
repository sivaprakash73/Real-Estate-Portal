import { updateLead, deleteLead } from '@/lib/store';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const lead = updateLead(id, req.body || {});
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    return res.status(200).json({ lead });
  }

  if (req.method === 'DELETE') {
    const ok = deleteLead(id);
    if (!ok) return res.status(404).json({ error: 'Lead not found' });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
