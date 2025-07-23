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
var express_1 = require("express");
var jsonwebtoken_1 = require("jsonwebtoken");
var fileUtils_js_1 = require("../utils/fileUtils.js");
var emailService_js_1 = require("../services/emailService.js");
console.log('📦 auth.ts loaded ✅');
var router = express_1.default.Router();
// ======================
// POST /auth/login
// ======================
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, users, sanitizedEmail_1, user, otp, otpExpiry, otpStore, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                console.log('\n==============================');
                console.log('🔐 LOGIN ATTEMPT');
                console.log('🧾 Request body:', req.body);
                console.log('==============================');
                _a = req.body, email = _a.email, password = _a.password;
                if (!email || !password) {
                    console.log('⚠️ Missing email or password');
                    return [2 /*return*/, res.status(400).json({ error: 'Email and password required' })];
                }
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/users.json')];
            case 1:
                users = _b.sent();
                console.log("\uD83D\uDCC1 Loaded ".concat(users.length, " users from users.json"));
                sanitizedEmail_1 = email.trim().toLowerCase();
                user = users.find(function (u) { return u.email.trim().toLowerCase() === sanitizedEmail_1; });
                if (!user) {
                    console.log('❌ User not found for email:', sanitizedEmail_1);
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                console.log('✅ Found user:', user.email);
                console.log('🔑 Stored password:', JSON.stringify(user.password));
                console.log('🔑 Entered password:', JSON.stringify(password));
                if (user.password !== password) {
                    console.log('❌ Password mismatch!');
                    return [2 /*return*/, res.status(401).json({ error: 'Invalid credentials' })];
                }
                console.log('🎉 Login successful for:', user.email);
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/otp_store.json')];
            case 2:
                otpStore = _b.sent();
                otpStore[sanitizedEmail_1] = {
                    otp: otp,
                    expiry: otpExpiry.toISOString(),
                    userId: user.id
                };
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('data/otp_store.json', otpStore)];
            case 3:
                _b.sent();
                console.log('📧 OTP sent to:', sanitizedEmail_1, '| OTP:', otp);
                return [4 /*yield*/, (0, emailService_js_1.sendOTPEmail)(user.email, otp)];
            case 4:
                _b.sent();
                res.json({
                    message: 'OTP sent to email',
                    email: sanitizedEmail_1.replace(/(.{2})(.*)(@.*)/, '$1***$3')
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error('[POST /auth/login] 💥 Error:', error_1);
                res.status(500).json({ error: 'Login failed' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// ======================
// POST /auth/verify-otp
// ======================
router.post('/verify-otp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, otpStore, stored_1, users, user, bankData, userBankData, jwtSecret, jwtExpiresInString, signOptions, token, error_2;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                _a = req.body, email = _a.email, otp = _a.otp;
                if (!email || !otp) {
                    return [2 /*return*/, res.status(400).json({ error: 'Email and OTP required' })];
                }
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/otp_store.json')];
            case 1:
                otpStore = _d.sent();
                stored_1 = otpStore[email];
                if (!stored_1) {
                    return [2 /*return*/, res.status(400).json({ error: 'OTP not found or expired' })];
                }
                if (!(new Date() > new Date(stored_1.expiry))) return [3 /*break*/, 3];
                delete otpStore[email];
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('data/otp_store.json', otpStore)];
            case 2:
                _d.sent();
                return [2 /*return*/, res.status(400).json({ error: 'OTP expired' })];
            case 3:
                if (stored_1.otp !== otp) {
                    return [2 /*return*/, res.status(400).json({ error: 'Invalid OTP' })];
                }
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/users.json')];
            case 4:
                users = _d.sent();
                user = users.find(function (u) { return u.id === stored_1.userId; });
                if (!user)
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/user_bank_data.json')];
            case 5:
                bankData = _d.sent();
                userBankData = bankData[user.id] || {};
                jwtSecret = (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : 'nexavault-secret';
                jwtExpiresInString = ((_c = process.env.JWT_EXPIRES_IN) !== null && _c !== void 0 ? _c : '1h');
                signOptions = {
                    expiresIn: jwtExpiresInString,
                };
                token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, jwtSecret, signOptions);
                delete otpStore[email];
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('data/otp_store.json', otpStore)];
            case 6:
                _d.sent();
                res.json({
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        bankData: userBankData
                    }
                });
                return [3 /*break*/, 8];
            case 7:
                error_2 = _d.sent();
                console.error('[POST /auth/verify-otp] Error:', error_2);
                res.status(500).json({ error: 'OTP verification failed' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// ======================
// POST /auth/resend-otp
// ======================
router.post('/resend-otp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email_1, users, user, otp, expiry, otpStore, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                email_1 = req.body.email;
                if (!email_1)
                    return [2 /*return*/, res.status(400).json({ error: 'Email required' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/users.json')];
            case 1:
                users = _a.sent();
                user = users.find(function (u) { return u.email === email_1; });
                if (!user)
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                otp = Math.floor(100000 + Math.random() * 900000).toString();
                expiry = new Date(Date.now() + 5 * 60 * 1000).toISOString();
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/otp_store.json')];
            case 2:
                otpStore = _a.sent();
                otpStore[email_1] = { otp: otp, expiry: expiry, userId: user.id };
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('data/otp_store.json', otpStore)];
            case 3:
                _a.sent();
                return [4 /*yield*/, (0, emailService_js_1.sendOTPEmail)(email_1, otp)];
            case 4:
                _a.sent();
                res.json({ message: 'OTP resent successfully' });
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('[POST /auth/resend-otp] Error:', error_3);
                res.status(500).json({ error: 'Failed to resend OTP' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// ======================
// POST /auth/register
// ======================
router.post('/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, email_2, password, users, existingUser, newUser, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, email_2 = _a.email, password = _a.password;
                if (!name_1 || !email_2 || !password)
                    return [2 /*return*/, res.status(400).json({ error: 'Name, email, and password are required' })];
                return [4 /*yield*/, (0, fileUtils_js_1.readJsonFile)('data/users.json')];
            case 1:
                users = _b.sent();
                existingUser = users.find(function (u) { return u.email.trim().toLowerCase() === email_2.trim().toLowerCase(); });
                if (existingUser)
                    return [2 /*return*/, res.status(409).json({ error: 'User already exists' })];
                newUser = {
                    id: "user_".concat(String(users.length + 1).padStart(3, '0')),
                    email: email_2.trim().toLowerCase(),
                    name: name_1,
                    password: password,
                    createdAt: new Date().toISOString()
                };
                users.push(newUser);
                return [4 /*yield*/, (0, fileUtils_js_1.writeJsonFile)('data/users.json', users)];
            case 2:
                _b.sent();
                res.status(201).json({ message: 'User registered successfully' });
                return [3 /*break*/, 4];
            case 3:
                error_4 = _b.sent();
                console.error('[POST /auth/register] Error:', error_4);
                res.status(500).json({ error: 'Registration failed' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
