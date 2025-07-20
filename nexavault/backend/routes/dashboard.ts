import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils.js';
import { generateCapsule } from '../services/capsuleService.js';

const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// GET /dashboard
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const requests = await readJsonFile('backend/data/third_party_requests.json');
    const userRequests = requests.filter((r: any) => r.userId === userId);

    const capsules = await readJsonFile('backend/data/capsules.json');
    const userCapsules = capsules.filter((c: any) => c.userId === userId);

    const capsulesWithExpiry = userCapsules.map((c: any) => ({
      ...c,
      daysToExpiry: Math.max(0, Math.ceil((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    }));

    res.json({
      requests: userRequests,
      capsules: capsulesWithExpiry,
      totalRequests: userRequests.length,
      activeCapsules: capsulesWithExpiry.filter((c: any) => c.status === 'active').length
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// POST /dashboard/approve
router.post('/approve', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { requestId, approvedFields, queryLimit } = req.body;

    if (!requestId || !Array.isArray(approvedFields) || approvedFields.length === 0 || !queryLimit) {
      return res.status(400).json({ error: 'Missing or invalid fields for approval' });
    }

    const requests = await readJsonFile('backend/data/third_party_requests.json');
    const requestIndex = requests.findIndex((r: any) => r.id === requestId && r.userId === userId);

    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const capsule = await generateCapsule(userId, approvedFields, queryLimit, requests[requestIndex]);

    requests[requestIndex].status = 'approved';
    requests[requestIndex].approvedAt = new Date().toISOString();
    requests[requestIndex].capsuleId = capsule.id;

    await writeJsonFile('backend/data/third_party_requests.json', requests);

    res.json({
      message: 'Request approved successfully',
      capsule
    });
  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to approve request' });
  }
});

// POST /dashboard/reject
router.post('/reject', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { requestId, reason } = req.body;

    if (!requestId) return res.status(400).json({ error: 'Missing requestId' });

    const requests = await readJsonFile('backend/data/third_party_requests.json');
    const requestIndex = requests.findIndex((r: any) => r.id === requestId && r.userId === userId);

    if (requestIndex === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }

    requests[requestIndex].status = 'rejected';
    requests[requestIndex].rejectedAt = new Date().toISOString();
    requests[requestIndex].rejectionReason = reason || '';

    await writeJsonFile('backend/data/third_party_requests.json', requests);

    res.json({ message: 'Request rejected successfully' });
  } catch (error) {
    console.error('Rejection error:', error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
});

export default router;
