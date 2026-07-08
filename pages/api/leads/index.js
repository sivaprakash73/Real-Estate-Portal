import { listLeads, createLead, getProperty } from '@/lib/store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const leads = listLeads(req.query);
    return res.status(200).json({ leads });
  }

  if (req.method === 'POST') {
    const { name, phone, propertyId } = req.body || {};
    if (!name || !phone || !propertyId) {
      return res
        .status(400)
        .json({ error: 'name, phone and propertyId are required' });
    }
    const property = getProperty(propertyId);
    if (!property) return res.status(404).json({ error: 'Property not found' });

    const lead = createLead({
      ...req.body,
      propertyId: Number(propertyId),
      agentId: property.agentId,
    });
    return res.status(201).json({ lead });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
