import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils.js';
import { processQuery } from '../services/queryService.js';

const router = express.Router();

// Custom user type added by auth middleware
interface CustomUser {
  userId: string;
  email: string;
}

// Extend Express's Request to include user
interface CustomRequest extends Request {
  user?: CustomUser;
}

// Query a capsule
router.post('/query/:capsuleId', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { capsuleId } = req.params;
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    const capsules = await readJsonFile('backend/data/capsules.json');
    const capsuleIndex = capsules.findIndex((c: any) => c.id === capsuleId && c.userId === user.userId);
    if (capsuleIndex === -1) return res.status(404).json({ error: 'Capsule not found' });

    const capsule = capsules[capsuleIndex];

    if (capsule.status !== 'active') return res.status(403).json({ error: `Capsule is ${capsule.status}` });
    if (capsule.queriesLeft <= 0) return res.status(403).json({ error: 'Query limit reached' });
    if (new Date() > new Date(capsule.expiryDate)) return res.status(403).json({ error: 'Capsule expired' });

    const response = await processQuery(question, capsule);

    capsule.queriesLeft -= 1;
    capsule.lastQueryAt = new Date().toISOString();
    capsules[capsuleIndex] = capsule;
    await writeJsonFile('backend/data/capsules.json', capsules);

    const logs = await readJsonFile('backend/data/logs.json');
    const logEntry = {
      id: Date.now().toString(),
      capsuleId,
      userId: user.userId,
      serviceName: capsule.serviceName,
      question,
      response: response.answer,
      timestamp: new Date().toISOString(),
      location: req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
    };

    logs.push(logEntry);
    await writeJsonFile('backend/data/logs.json', logs);

    // 🚨 Suspicious activity alert
    const recentLogs = logs.filter(
      (l: any) =>
        l.capsuleId === capsuleId &&
        new Date().getTime() - new Date(l.timestamp).getTime() < 60000
    );
    const uniqueLocations = [...new Set(recentLogs.map((l: any) => l.location))];

    if (recentLogs.length >= 3 && uniqueLocations.length >= 3) {
      const alerts = await readJsonFile('backend/data/alerts.json');
      const newAlert = {
        id: `alert_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'suspicious-activity',
        message: `Capsule for ${capsule.serviceName} suspended due to rapid queries from different locations.`,
        capsuleId,
        service: capsule.serviceName,
        userId: user.userId
      };
      alerts.push(newAlert);
      await writeJsonFile('backend/data/alerts.json', alerts);

      capsule.status = 'suspended';
      capsules[capsuleIndex] = capsule;
      await writeJsonFile('backend/data/capsules.json', capsules);
    }

    res.json({
      answer: response.answer,
      queriesLeft: capsule.queriesLeft,
      confidence: response.confidence
    });
  } catch (error) {
    console.error('Query error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

// Get capsule details
router.get('/:capsuleId', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { capsuleId } = req.params;
    const capsules = await readJsonFile('backend/data/capsules.json');
    const capsule = capsules.find((c: any) => c.id === capsuleId && c.userId === user.userId);
    if (!capsule) return res.status(404).json({ error: 'Capsule not found' });

    const logs = await readJsonFile('backend/data/logs.json');
    const capsuleLogs = logs.filter((l: any) => l.capsuleId === capsuleId);

    res.json({
      ...capsule,
      logs: capsuleLogs,
      daysToExpiry: Math.ceil((new Date(capsule.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    });
  } catch (error) {
    console.error('Capsule fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch capsule' });
  }
});

// Block capsule
router.post('/block/:capsuleId', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { capsuleId } = req.params;
    const capsules = await readJsonFile('backend/data/capsules.json');
    const capsuleIndex = capsules.findIndex((c: any) => c.id === capsuleId && c.userId === user.userId);
    if (capsuleIndex === -1) return res.status(404).json({ error: 'Capsule not found' });

    capsules[capsuleIndex].status = 'blocked';
    capsules[capsuleIndex].blockedAt = new Date().toISOString();
    await writeJsonFile('backend/data/capsules.json', capsules);

    res.json({ message: 'Capsule blocked successfully', status: 'blocked' });
  } catch (error) {
    console.error('Block error:', error);
    res.status(500).json({ error: 'Failed to block capsule' });
  }
});

// Revoke capsule
router.post('/revoke/:capsuleId', authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { capsuleId } = req.params;
    const capsules = await readJsonFile('backend/data/capsules.json');
    const capsuleIndex = capsules.findIndex((c: any) => c.id === capsuleId && c.userId === user.userId);
    if (capsuleIndex === -1) return res.status(404).json({ error: 'Capsule not found' });

    capsules[capsuleIndex].status = 'revoked';
    capsules[capsuleIndex].revokedAt = new Date().toISOString();
    await writeJsonFile('backend/data/capsules.json', capsules);

    res.json({ message: 'Capsule revoked successfully', status: 'revoked' });
  } catch (error) {
    console.error('Revoke error:', error);
    res.status(500).json({ error: 'Failed to revoke capsule' });
  }
});

export default router;
