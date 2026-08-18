import { createBackup, restoreBackup } from '@/lib/store';

// This route must be protected by real authentication before a public
// deployment. The current project dashboard is a local/demo admin area.
export default function handler(req, res) {
  if (req.method === 'GET') {
    const backup = createBackup();
    const date = backup.exportedAt.slice(0, 10);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="vetrivelan-realty-backup-${date}.json"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(JSON.stringify(backup, null, 2));
  }

  if (req.method === 'POST') {
    try {
      const counts = restoreBackup(req.body);
      return res.status(200).json({
        message: 'Backup restored successfully.',
        counts,
      });
    } catch (error) {
      return res.status(400).json({ error: error.message || 'Unable to restore this backup.' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}
