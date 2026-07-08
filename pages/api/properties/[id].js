import { getProperty, updateProperty, deleteProperty } from '@/lib/store';

export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    const property = getProperty(id);
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json({ property });
  }

  if (req.method === 'PUT') {
    const property = updateProperty(id, req.body || {});
    if (!property) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json({ property });
  }

  if (req.method === 'DELETE') {
    const ok = deleteProperty(id);
    if (!ok) return res.status(404).json({ error: 'Property not found' });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
