"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
/**
 * Middleware to authenticate requests using JWT tokens.
 */
var authenticateToken = function (req, res, next) {
    try {
        var authHeader = req.headers['authorization'];
        var token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Access token required' });
        }
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '', function (err, decoded) {
            if (err || !decoded || typeof decoded === 'string') {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
            var _a = decoded, userId = _a.userId, email = _a.email;
            req.user = {
                userId: userId,
                email: email
            };
            next();
        });
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.authenticateToken = authenticateToken;
