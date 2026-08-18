import { listLeads, createLead, getProperty } from '@/lib/store';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const leads = listLeads(req.query);
    return res.status(200).json({ leads });
  }

  if (req.method === 'POST') {
    const { name, phone, propertyId } = req.body || {};
    if (!name || !phone) {
      return res
        .status(400)
        .json({ error: 'name and phone are required' });
    }
    const property = propertyId ? getProperty(propertyId) : null;
    if (propertyId && !property) return res.status(404).json({ error: 'Property not found' });

    const lead = createLead({
      ...req.body,
      propertyId: property ? Number(propertyId) : null,
      agentId: property ? property.agentId : null,
    });
    return res.status(201).json({ lead });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
