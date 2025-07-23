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
// Add this import at the top
import generateQueryOtpRoute from './routes/api/generateQueryOtp';
import secureDownloadRoute from './routes/secureDownload';
import secureAccessRoutes from './routes/secureAccess';
import filterParseRoute from './routes/api/filterParse';
import secureRoutes from './routes/secure'; // Adjust path as needed

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

app.use('/api', generateQueryOtpRoute);
app.use('/api/secure', secureDownloadRoute);
app.use('/api/secure', secureAccessRoutes);
app.use('/api/filter/parse', filterParseRoute);
app.use('/api/secure', secureRoutes);


// ✅ Server start
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
