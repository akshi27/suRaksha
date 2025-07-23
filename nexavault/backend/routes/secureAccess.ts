import express from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'nexavault_secret_key';

// 🟢 Step 1: Generate token for a service (valid for 60 seconds)
router.post('/generate-token', (req, res) => {
  const { service } = req.body;

  if (!service) {
    return res.status(400).json({ error: 'Service name is required' });
  }

  const token = jwt.sign(
    { service, exp: Math.floor(Date.now() / 1000) + 60 },
    JWT_SECRET
  );

  return res.json({ token });
});

// 🟢 Step 2: Serve secure HTML if token is valid
router.get('/download-html', (req, res) => {
  const token = req.query.token as string;

  if (!token) return res.status(401).send('Access token required');

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const { service } = decoded;

    const secureJsonPath = path.join(__dirname, '../../data/secure-approved-services.json');
    const secureData = JSON.parse(fs.readFileSync(secureJsonPath, 'utf-8'));

    const matchedService = secureData.find((s: any) => s.service === service);
    if (!matchedService) return res.status(404).send('Service data not found');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>🔒 Secure Download - ${service}</title>
          <style>
            * { user-select: none; pointer-events: none; }
            body { font-family: sans-serif; padding: 20px; background: #f4f4f4; }
            h1 { color: #2c3e50; }
            .info { margin-top: 1rem; font-size: 14px; color: #888; }
            table { border-collapse: collapse; width: 100%; }
            th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
          </style>
          <script>
            setTimeout(() => {
              document.body.innerHTML = '<h2 style="color:red;">🔐 This file has expired.</h2>';
            }, 60000);
          </script>
        </head>
        <body>
          <h1>🔒 Secure Data: ${service}</h1>
          <div class="info">This file is protected. Copying is disabled. Will expire in 60 seconds.</div>
          <table>
            <thead><tr>
              ${Object.keys(matchedService.customers[0] || {}).map(key => `<th>${key}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${matchedService.customers.map((cust: any) => `
                <tr>
                  ${Object.values(cust).map(val => `<td>${val}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    res.setHeader('Content-Disposition', `attachment; filename="${service}-secure.html"`);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    return res.status(403).send('Invalid or expired token');
  }
});

export default router;
