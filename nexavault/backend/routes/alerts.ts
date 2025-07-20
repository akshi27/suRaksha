import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils.js';

const router = express.Router();

interface CustomUser {
  userId: string;
  email: string;
}

interface AuthenticatedRequest extends Request {
  user?: CustomUser;
}

// GET /api/alerts — Fetch all alerts for the authenticated user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const alerts = await readJsonFile('backend/data/alerts.json');
    const userAlerts = alerts.filter((alert: any) => alert.userId === user.userId);

    res.json({
      alerts: userAlerts,
      totalAlerts: userAlerts.length,
      unreadAlerts: userAlerts.filter((a: any) => !a.read).length
    });
  } catch (error) {
    console.error('[GET /alerts] Error:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// POST /api/alerts/:alertId/read — Mark alert as read
router.post('/:alertId/read', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { alertId } = req.params;
    const alerts = await readJsonFile('backend/data/alerts.json');

    const index = alerts.findIndex(
      (a: any) => a.id === alertId && a.userId === user.userId
    );

    if (index === -1) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    alerts[index].read = true;
    alerts[index].readAt = new Date().toISOString();

    await writeJsonFile('backend/data/alerts.json', alerts);

    res.json({ message: 'Alert marked as read' });
  } catch (error) {
    console.error('[POST /alerts/:id/read] Error:', error);
    res.status(500).json({ error: 'Failed to update alert status' });
  }
});

export default router;
