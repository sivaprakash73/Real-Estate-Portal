import { listProperties, createProperty } from '@/lib/store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const properties = listProperties(req.query);
    return res.status(200).json({ properties });
  }

  if (req.method === 'POST') {
    const { title, price, city, agentId } = req.body || {};
    if (!title || !price || !city || !agentId) {
      return res
        .status(400)
        .json({ error: 'title, price, city and agentId are required' });
    }
    const property = createProperty({
      ...req.body,
      price: Number(price),
      area: Number(req.body.area) || 0,
      beds: Number(req.body.beds) || 0,
      baths: Number(req.body.baths) || 0,
      agentId: Number(agentId),
      lat: req.body.lat !== '' && req.body.lat != null ? Number(req.body.lat) : null,
      lng: req.body.lng !== '' && req.body.lng != null ? Number(req.body.lng) : null,
    });
    return res.status(201).json({ property });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
