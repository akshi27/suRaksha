// routes/api/generateQueryOtp.ts
import express from 'express';

const router = express.Router();

router.get('/generate-query-otp', (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(`🟢 [Query OTP] OTP for Query Execution: ${otp}`);
  res.json({ otp });
});

export default router;