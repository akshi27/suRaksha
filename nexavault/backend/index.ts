// backend/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import capsuleRoutes from './routes/capsule';
import alertRoutes from './routes/alerts';
import capsuleQueryHandler from './routes/capsuleQuery';

import { startAnomalyDetection } from './services/anomalyDetection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Start anomaly detection service
startAnomalyDetection();

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/capsule', capsuleRoutes);
app.use('/api/alerts', alertRoutes);
app.post('/api/capsule/query', capsuleQueryHandler);

// ✅ Static scripts (like decryption scripts)
app.use('/scripts', express.static('public/scripts'));

// ✅ Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: '✅ Nexavault API is running' });
});

// ✅ Server start
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
