"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_js_1 = require("../middleware/auth.js");
var fileUtils_js_1 = require("../utils/fileUtils.js");
var queryService_js_1 = require("../services/queryService.js");
var router = express_1.default.Router();
// Query a capsule
router.post('/query/:capsuleId', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_1, capsuleId_1, question, capsules, capsuleIndex, capsule, response, logs, logEntry, recentLogs, uniqueLocations, alerts, newAlert, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 10, , 11]);
                user_1 = req.user;
                if (!user_1)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                capsuleId_1 = req.params.capsuleId;
                question = req.body.question;
                if (!question)
                    return [2 /*return*/, res.status(400).json({ error: 'Question required' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/capsules.json')];
            case 1:
                capsules = _b.sent();
                capsuleIndex = capsules.findIndex(function (c) { return c.id === capsuleId_1 && c.userId === user_1.userId; });
                if (capsuleIndex === -1)
                    return [2 /*return*/, res.status(404).json({ error: 'Capsule not found' })];
                capsule = capsules[capsuleIndex];
                if (capsule.status !== 'active')
                    return [2 /*return*/, res.status(403).json({ error: "Capsule is ".concat(capsule.status) })];
                if (capsule.queriesLeft <= 0)
                    return [2 /*return*/, res.status(403).json({ error: 'Query limit reached' })];
                if (new Date() > new Date(capsule.expiryDate))
                    return [2 /*return*/, res.status(403).json({ error: 'Capsule expired' })];
                return [4 /*yield*/, (0, queryService_js_1.processQuery)(question, capsule)];
            case 2:
                response = _b.sent();
                capsule.queriesLeft -= 1;
                capsule.lastQueryAt = new Date().toISOString();
                capsules[capsuleIndex] = capsule;
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/capsules.json', capsules)];
            case 3:
                _b.sent();
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/logs.json')];
            case 4:
                logs = _b.sent();
                logEntry = {
                    id: Date.now().toString(),
                    capsuleId: capsuleId_1,
                    userId: user_1.userId,
                    serviceName: capsule.serviceName,
                    question: question,
                    response: response.answer,
                    timestamp: new Date().toISOString(),
                    location: req.headers['x-forwarded-for'] || ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress) || 'unknown'
                };
                logs.push(logEntry);
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/logs.json', logs)];
            case 5:
                _b.sent();
                recentLogs = logs.filter(function (l) {
                    return l.capsuleId === capsuleId_1 &&
                        new Date().getTime() - new Date(l.timestamp).getTime() < 60000;
                });
                uniqueLocations = __spreadArray([], new Set(recentLogs.map(function (l) { return l.location; })), true);
                if (!(recentLogs.length >= 3 && uniqueLocations.length >= 3)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/alerts.json')];
            case 6:
                alerts = _b.sent();
                newAlert = {
                    id: "alert_".concat(Date.now()),
                    timestamp: new Date().toISOString(),
                    type: 'suspicious-activity',
                    message: "Capsule for ".concat(capsule.serviceName, " suspended due to rapid queries from different locations."),
                    capsuleId: capsuleId_1,
                    service: capsule.serviceName,
                    userId: user_1.userId
                };
                alerts.push(newAlert);
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/alerts.json', alerts)];
            case 7:
                _b.sent();
                capsule.status = 'suspended';
                capsules[capsuleIndex] = capsule;
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/capsules.json', capsules)];
            case 8:
                _b.sent();
                _b.label = 9;
            case 9:
                res.json({
                    answer: response.answer,
                    queriesLeft: capsule.queriesLeft,
                    confidence: response.confidence
                });
                return [3 /*break*/, 11];
            case 10:
                error_1 = _b.sent();
                console.error('Query error:', error_1);
                res.status(500).json({ error: 'Failed to process query' });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Get capsule details
router.get('/:capsuleId', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_2, capsuleId_2, capsules, capsule, logs, capsuleLogs, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_2 = req.user;
                if (!user_2)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                capsuleId_2 = req.params.capsuleId;
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/capsules.json')];
            case 1:
                capsules = _a.sent();
                capsule = capsules.find(function (c) { return c.id === capsuleId_2 && c.userId === user_2.userId; });
                if (!capsule)
                    return [2 /*return*/, res.status(404).json({ error: 'Capsule not found' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/logs.json')];
            case 2:
                logs = _a.sent();
                capsuleLogs = logs.filter(function (l) { return l.capsuleId === capsuleId_2; });
                res.json(__assign(__assign({}, capsule), { logs: capsuleLogs, daysToExpiry: Math.ceil((new Date(capsule.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) }));
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error('Capsule fetch error:', error_2);
                res.status(500).json({ error: 'Failed to fetch capsule' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Block capsule
router.post('/block/:capsuleId', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_3, capsuleId_3, capsules, capsuleIndex, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_3 = req.user;
                if (!user_3)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                capsuleId_3 = req.params.capsuleId;
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/capsules.json')];
            case 1:
                capsules = _a.sent();
                capsuleIndex = capsules.findIndex(function (c) { return c.id === capsuleId_3 && c.userId === user_3.userId; });
                if (capsuleIndex === -1)
                    return [2 /*return*/, res.status(404).json({ error: 'Capsule not found' })];
                capsules[capsuleIndex].status = 'blocked';
                capsules[capsuleIndex].blockedAt = new Date().toISOString();
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/capsules.json', capsules)];
            case 2:
                _a.sent();
                res.json({ message: 'Capsule blocked successfully', status: 'blocked' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Block error:', error_3);
                res.status(500).json({ error: 'Failed to block capsule' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Revoke capsule
router.post('/revoke/:capsuleId', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_4, capsuleId_4, capsules, capsuleIndex, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                user_4 = req.user;
                if (!user_4)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                capsuleId_4 = req.params.capsuleId;
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/capsules.json')];
            case 1:
                capsules = _a.sent();
                capsuleIndex = capsules.findIndex(function (c) { return c.id === capsuleId_4 && c.userId === user_4.userId; });
                if (capsuleIndex === -1)
                    return [2 /*return*/, res.status(404).json({ error: 'Capsule not found' })];
                capsules[capsuleIndex].status = 'revoked';
                capsules[capsuleIndex].revokedAt = new Date().toISOString();
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/capsules.json', capsules)];
            case 2:
                _a.sent();
                res.json({ message: 'Capsule revoked successfully', status: 'revoked' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Revoke error:', error_4);
                res.status(500).json({ error: 'Failed to revoke capsule' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
