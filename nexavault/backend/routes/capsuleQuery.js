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
var groqCapsuleHandler_1 = require("../utils/capsule/groqCapsuleHandler");
var logQuery_1 = require("../utils/capsule/logQuery");
var nexonEncryptor_1 = require("../utils/nexonEncryptor");
var fs_1 = require("fs");
var path_1 = require("path");
var approvedServices_1 = require("../data/approvedServices");
var capsuleQueryHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, serviceName, capsuleType, otp, matchedService, requestedFields, useCase, lowerQuery, isSensitive, expectedOTP, llmResponse, _b, encryptedData, key, iv, decryptScript, filePath, error_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, query = _a.query, serviceName = _a.serviceName, capsuleType = _a.capsuleType, otp = _a.otp;
                console.log('📥 Incoming capsule query:', {
                    query: query,
                    serviceName: serviceName,
                    capsuleType: capsuleType,
                    otp: otp
                });
                if (!query || !serviceName || !capsuleType) {
                    console.warn('⚠️ Missing required parameters');
                    return [2 /*return*/, res.status(400).json({ error: 'Missing parameters' })];
                }
                matchedService = approvedServices_1.approvedServices.find(function (s) { return s.service === serviceName; });
                if (!matchedService) {
                    console.error('❌ Service not found:', serviceName);
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                console.log('🔍 Matched service:', matchedService.service);
                requestedFields = matchedService.requestedFields;
                useCase = matchedService.useCase;
                lowerQuery = query.toLowerCase();
                isSensitive = lowerQuery.includes('Mobile numbers (linked)') ||
                    lowerQuery.includes('Mobile') ||
                    lowerQuery.includes('Mobile numbers') ||
                    lowerQuery.includes('Email IDs (linked)') ||
                    lowerQuery.includes('Email IDs') ||
                    lowerQuery.includes('Email ID') ||
                    lowerQuery.includes('Email') ||
                    lowerQuery.includes('Mail ID') ||
                    lowerQuery.includes('Mail') ||
                    lowerQuery.includes('Financial history (income, investments, loans)') ||
                    lowerQuery.includes('Financial history') ||
                    lowerQuery.includes('linked Email IDs') ||
                    lowerQuery.includes('Linked Email IDs') ||
                    lowerQuery.includes('Email IDs linked');
                if (capsuleType === 'real' && isSensitive) {
                    expectedOTP = process.env.SERVICE_ADMIN_OTP || '123456';
                    if (otp !== expectedOTP) {
                        console.warn('🔐 OTP required or incorrect. Provided:', otp);
                        return [2 /*return*/, res.status(403).json({ error: 'OTP required for this request' })];
                    }
                    else {
                        console.log('🔐 OTP validated successfully');
                    }
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                if (!process.env.GROQ_API_KEY) {
                    console.warn('⚠️ GROQ_API_KEY not found in environment!');
                }
                console.log('🧠 Sending query to Nexon LLM with fields:', requestedFields);
                return [4 /*yield*/, (0, groqCapsuleHandler_1.handleCapsuleLLMQuery)({
                        query: query,
                        useCase: useCase,
                        requestedFields: requestedFields,
                        serviceName: serviceName,
                        groqApiKey: process.env.GROQ_API_KEY || '',
                    })];
            case 2:
                llmResponse = _c.sent();
                console.log('✅ LLM raw response:', llmResponse);
                _b = (0, nexonEncryptor_1.encryptResponse)(llmResponse), encryptedData = _b.encryptedData, key = _b.key, iv = _b.iv;
                decryptScript = (0, nexonEncryptor_1.generateDecryptionScript)(key, iv);
                filePath = path_1.default.join(process.cwd(), 'public', 'scripts', "".concat(serviceName, "-decrypt.js"));
                fs_1.default.mkdirSync(path_1.default.dirname(filePath), { recursive: true });
                fs_1.default.writeFileSync(filePath, decryptScript);
                console.log('💾 Decryption script saved at:', filePath);
                return [4 /*yield*/, (0, logQuery_1.logCapsuleQuery)({ serviceName: serviceName, capsuleType: capsuleType, query: query, response: encryptedData })];
            case 3:
                _c.sent();
                console.log('🔐 Encrypted response ready to return');
                return [2 /*return*/, res.status(200).json({ encryptedData: encryptedData })];
            case 4:
                error_1 = _c.sent();
                console.error('💥 Capsule error:', error_1.message || error_1);
                return [2 /*return*/, res.status(500).json({ error: 'Internal error' })];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = capsuleQueryHandler;
