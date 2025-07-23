import express, { Request, Response } from 'express';
import { totalapprovedServices } from '../data/approvedServices'; // Adjust path accordingly

const router = express.Router();

// POST /api/secure/get-approved-services
router.post('/get-approved-services', (req: Request, res: Response) => {
  const { otp } = req.body;

  if (otp !== '123456') {
    return res.status(401).json({ error: '❌ Invalid OTP' });
  }

  return res.json({ services: totalapprovedServices });
});

export default router;
