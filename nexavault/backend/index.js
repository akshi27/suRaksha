"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// backend/index.ts
var express_1 = require("express");
var cors_1 = require("cors");
var body_parser_1 = require("body-parser");
var dotenv_1 = require("dotenv");
var morgan_1 = require("morgan");
var cookie_parser_1 = require("cookie-parser");
var auth_1 = require("./routes/auth");
var dashboard_1 = require("./routes/dashboard");
var capsule_1 = require("./routes/capsule");
var alerts_1 = require("./routes/alerts");
var capsuleQuery_1 = require("./routes/capsuleQuery");
var anomalyDetection_1 = require("./services/anomalyDetection");
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
// ✅ Start anomaly detection service
(0, anomalyDetection_1.startAnomalyDetection)();
// ✅ Middleware
app.use((0, cors_1.default)({ origin: 'http://localhost:5173', credentials: true }));
app.use(body_parser_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// ✅ API routes
app.use('/api/auth', auth_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/capsule', capsule_1.default);
app.use('/api/alerts', alerts_1.default);
app.post('/api/capsule/query', capsuleQuery_1.default);
// ✅ Static scripts (like decryption scripts)
app.use('/scripts', express_1.default.static('public/scripts'));
// ✅ Health check
app.get('/api/health', function (req, res) {
    res.status(200).json({ status: 'OK', message: '✅ Nexavault API is running' });
});
// ✅ Server start
app.listen(PORT, function () {
    console.log("\uD83D\uDE80 Backend running at http://localhost:".concat(PORT));
});
