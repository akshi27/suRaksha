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
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_js_1 = require("../middleware/auth.js");
var fileUtils_js_1 = require("../utils/fileUtils.js");
var capsuleService_js_1 = require("../services/capsuleService.js");
var router = express_1.default.Router();
// GET /dashboard
router.get('/', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_1, requests, userRequests, capsules, userCapsules, capsulesWithExpiry, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                userId_1 = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId_1)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/third_party_requests.json')];
            case 1:
                requests = _b.sent();
                userRequests = requests.filter(function (r) { return r.userId === userId_1; });
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/capsules.json')];
            case 2:
                capsules = _b.sent();
                userCapsules = capsules.filter(function (c) { return c.userId === userId_1; });
                capsulesWithExpiry = userCapsules.map(function (c) { return (__assign(__assign({}, c), { daysToExpiry: Math.max(0, Math.ceil((new Date(c.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) })); });
                res.json({
                    requests: userRequests,
                    capsules: capsulesWithExpiry,
                    totalRequests: userRequests.length,
                    activeCapsules: capsulesWithExpiry.filter(function (c) { return c.status === 'active'; }).length
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _b.sent();
                console.error('Dashboard error:', error_1);
                res.status(500).json({ error: 'Failed to fetch dashboard data' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// POST /dashboard/approve
router.post('/approve', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_2, _a, requestId_1, approvedFields, queryLimit, requests, requestIndex, capsule, error_2;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                userId_2 = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId_2)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                _a = req.body, requestId_1 = _a.requestId, approvedFields = _a.approvedFields, queryLimit = _a.queryLimit;
                if (!requestId_1 || !Array.isArray(approvedFields) || approvedFields.length === 0 || !queryLimit) {
                    return [2 /*return*/, res.status(400).json({ error: 'Missing or invalid fields for approval' })];
                }
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/third_party_requests.json')];
            case 1:
                requests = _c.sent();
                requestIndex = requests.findIndex(function (r) { return r.id === requestId_1 && r.userId === userId_2; });
                if (requestIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ error: 'Request not found' })];
                }
                return [4 /*yield*/, (0, capsuleService_js_1.generateCapsule)(userId_2, approvedFields, queryLimit, requests[requestIndex])];
            case 2:
                capsule = _c.sent();
                requests[requestIndex].status = 'approved';
                requests[requestIndex].approvedAt = new Date().toISOString();
                requests[requestIndex].capsuleId = capsule.id;
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/third_party_requests.json', requests)];
            case 3:
                _c.sent();
                res.json({
                    message: 'Request approved successfully',
                    capsule: capsule
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _c.sent();
                console.error('Approval error:', error_2);
                res.status(500).json({ error: 'Failed to approve request' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// POST /dashboard/reject
router.post('/reject', auth_js_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId_3, _a, requestId_2, reason, requests, requestIndex, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                userId_3 = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
                if (!userId_3)
                    return [2 /*return*/, res.status(401).json({ error: 'Unauthorized' })];
                _a = req.body, requestId_2 = _a.requestId, reason = _a.reason;
                if (!requestId_2)
                    return [2 /*return*/, res.status(400).json({ error: 'Missing requestId' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('backend/data/third_party_requests.json')];
            case 1:
                requests = _c.sent();
                requestIndex = requests.findIndex(function (r) { return r.id === requestId_2 && r.userId === userId_3; });
                if (requestIndex === -1) {
                    return [2 /*return*/, res.status(404).json({ error: 'Request not found' })];
                }
                requests[requestIndex].status = 'rejected';
                requests[requestIndex].rejectedAt = new Date().toISOString();
                requests[requestIndex].rejectionReason = reason || '';
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('backend/data/third_party_requests.json', requests)];
            case 2:
                _c.sent();
                res.json({ message: 'Request rejected successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _c.sent();
                console.error('Rejection error:', error_3);
                res.status(500).json({ error: 'Failed to reject request' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
