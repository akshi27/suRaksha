import express, { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/fileUtils.js';
import { sendOTPEmail } from '../services/emailService.js';
import * as ms from 'ms';

console.log('📦 auth.ts loaded ✅');

const router = express.Router();

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  createdAt: string;
}

// ======================
// POST /auth/login
// ======================
router.post('/login', async (req, res) => {
  try {
    console.log('\n==============================');
    console.log('🔐 LOGIN ATTEMPT');
    console.log('🧾 Request body:', req.body);
    console.log('==============================');

    const { email, password } = req.body;

    if (!email || !password) {
      console.log('⚠️ Missing email or password');
      return res.status(400).json({ error: 'Email and password required' });
    }

    const users: User[] = await readJsonFile('data/users.json');
    console.log(`📁 Loaded ${users.length} users from users.json`);

    const sanitizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.trim().toLowerCase() === sanitizedEmail);

    if (!user) {
      console.log('❌ User not found for email:', sanitizedEmail);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('✅ Found user:', user.email);
    console.log('🔑 Stored password:', JSON.stringify(user.password));
    console.log('🔑 Entered password:', JSON.stringify(password));

    if (user.password !== password) {
      console.log('❌ Password mismatch!');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🎉 Login successful for:', user.email);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otpStore = await readJsonFile('data/otp_store.json');
    otpStore[sanitizedEmail] = {
      otp,
      expiry: otpExpiry.toISOString(),
      userId: user.id
    };
    await writeJsonFile('data/otp_store.json', otpStore);

    console.log('📧 OTP sent to:', sanitizedEmail, '| OTP:', otp);

    await sendOTPEmail(user.email, otp);

    res.json({
      message: 'OTP sent to email',
      email: sanitizedEmail.replace(/(.{2})(.*)(@.*)/, '$1***$3')
    });

  } catch (error) {
    console.error('[POST /auth/login] 💥 Error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ======================
// POST /auth/verify-otp
// ======================
router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP required' });
    }

    const otpStore = await readJsonFile('data/otp_store.json');
    const stored = otpStore[email];

    if (!stored) {
      return res.status(400).json({ error: 'OTP not found or expired' });
    }

    if (new Date() > new Date(stored.expiry)) {
      delete otpStore[email];
      await writeJsonFile('data/otp_store.json', otpStore);
      return res.status(400).json({ error: 'OTP expired' });
    }

    if (stored.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    const users: User[] = await readJsonFile('data/users.json');
    const user = users.find(u => u.id === stored.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bankData = await readJsonFile('data/user_bank_data.json');
    const userBankData = bankData[user.id] || {};

    const jwtSecret = process.env.JWT_SECRET ?? 'nexavault-secret';
    const jwtExpiresInString: ms.StringValue = (process.env.JWT_EXPIRES_IN ?? '1h') as ms.StringValue;

    const signOptions: SignOptions = {
      expiresIn: jwtExpiresInString,
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret as jwt.Secret,
      signOptions
    );

    delete otpStore[email];
    await writeJsonFile('data/otp_store.json', otpStore);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        bankData: userBankData
      }
    });
  } catch (error) {
    console.error('[POST /auth/verify-otp] Error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ======================
// POST /auth/resend-otp
// ======================
router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const users: User[] = await readJsonFile('data/users.json');
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();

    const otpStore = await readJsonFile('data/otp_store.json');
    otpStore[email] = { otp, expiry, userId: user.id };
    await writeJsonFile('data/otp_store.json', otpStore);

    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('[POST /auth/resend-otp] Error:', error);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
});

// ======================
// POST /auth/register
// ======================
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required' });

    const users: User[] = await readJsonFile('data/users.json');
    const existingUser = users.find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
    if (existingUser) return res.status(409).json({ error: 'User already exists' });

    const newUser: User = {
      id: `user_${String(users.length + 1).padStart(3, '0')}`,
      email: email.trim().toLowerCase(),
      name,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeJsonFile('data/users.json', users);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('[POST /auth/register] Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

export default router;
