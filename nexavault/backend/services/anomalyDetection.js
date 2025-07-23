"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAnomalyDetection = void 0;
var fileUtils_1 = require("../utils/fileUtils");
var startAnomalyDetection = function () {
    console.log('🔍 Starting anomaly detection service...');
    setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, detectAnomalies()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5 * 60 * 1000); // every 5 minutes
};
exports.startAnomalyDetection = startAnomalyDetection;
var detectAnomalies = function () { return __awaiter(void 0, void 0, void 0, function () {
    var logs, capsules, alerts, now, tenMinutesAgo_1, recentLogs, logsByCapsule, _i, recentLogs_1, log, _loop_1, _a, _b, _c, capsuleId, capsuleLogs, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 6, , 7]);
                return [4 /*yield*/, (0, fileUtils_1.readJsonFile)('backend/data/logs.json')];
            case 1:
                logs = _d.sent();
                return [4 /*yield*/, (0, fileUtils_1.readJsonFile)('backend/data/capsules.json')];
            case 2:
                capsules = _d.sent();
                return [4 /*yield*/, (0, fileUtils_1.readJsonFile)('backend/data/alerts.json')];
            case 3:
                alerts = _d.sent();
                now = new Date();
                tenMinutesAgo_1 = new Date(now.getTime() - 10 * 60 * 1000);
                recentLogs = logs.filter(function (log) { return new Date(log.timestamp) > tenMinutesAgo_1; });
                logsByCapsule = {};
                for (_i = 0, recentLogs_1 = recentLogs; _i < recentLogs_1.length; _i++) {
                    log = recentLogs_1[_i];
                    if (!logsByCapsule[log.capsuleId]) {
                        logsByCapsule[log.capsuleId] = [];
                    }
                    logsByCapsule[log.capsuleId].push(log);
                }
                _loop_1 = function (capsuleId, capsuleLogs) {
                    var uniqueLocations = new Set(capsuleLogs.map(function (log) { return log.location; }));
                    if (capsuleLogs.length > 5 && uniqueLocations.size > 3) {
                        var capsuleIndex = capsules.findIndex(function (c) { return c.id === capsuleId; });
                        if (capsuleIndex !== -1 &&
                            capsules[capsuleIndex].status === 'active') {
                            // Suspend the capsule
                            capsules[capsuleIndex].status = 'suspended';
                            capsules[capsuleIndex].suspendedAt = now.toISOString();
                            capsules[capsuleIndex].suspensionReason = 'Anomalous query pattern detected';
                            var newAlert = {
                                id: "alert_".concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 7)),
                                userId: capsules[capsuleIndex].userId,
                                capsuleId: capsuleId,
                                type: 'anomaly_detected',
                                title: 'Suspicious Activity Detected',
                                message: "Capsule for ".concat(capsules[capsuleIndex].serviceName, " has been suspended due to unusual query patterns."),
                                severity: 'high',
                                timestamp: now.toISOString(),
                                read: false,
                                data: {
                                    queries: capsuleLogs.length,
                                    locations: uniqueLocations.size,
                                    timeWindow: '10 minutes'
                                }
                            };
                            alerts.push(newAlert);
                            console.log("\uD83D\uDEA8 Anomaly detected for capsule ".concat(capsuleId, ". Suspended."));
                        }
                    }
                };
                // Analyze for anomalies
                for (_a = 0, _b = Object.entries(logsByCapsule); _a < _b.length; _a++) {
                    _c = _b[_a], capsuleId = _c[0], capsuleLogs = _c[1];
                    _loop_1(capsuleId, capsuleLogs);
                }
                // Persist updated capsules and alerts
                return [4 /*yield*/, (0, fileUtils_1.writeJsonFile)('backend/data/capsules.json', capsules)];
            case 4:
                // Persist updated capsules and alerts
                _d.sent();
                return [4 /*yield*/, (0, fileUtils_1.writeJsonFile)('backend/data/alerts.json', alerts)];
            case 5:
                _d.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _d.sent();
                console.error('Anomaly detection error:', error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
