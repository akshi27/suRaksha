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
exports.handleCapsuleLLMQuery = handleCapsuleLLMQuery;
var fileUtils_1 = require("../fileUtils");
var rangeAnswerableFields = [
    'credit score', 'salary', 'balance', 'bank balance', 'income', 'transaction amount'
];
function isFieldAllowed(query, allowedFields) {
    var lowered = query.toLowerCase();
    return allowedFields.some(function (f) { return lowered.includes(f.toLowerCase()); });
}
function isRangeBasedField(query) {
    var lowered = query.toLowerCase();
    return rangeAnswerableFields.some(function (f) { return lowered.includes(f); });
}
function handleCapsuleLLMQuery(_a) {
    return __awaiter(this, arguments, void 0, function (_b) {
        var allData, approvedServices, service, targetEmails, relevantData, displayData, prompt, res, data;
        var _c, _d, _e;
        var query = _b.query, useCase = _b.useCase, requestedFields = _b.requestedFields, serviceName = _b.serviceName, groqApiKey = _b.groqApiKey;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    if (!isFieldAllowed(query, requestedFields)) {
                        return [2 /*return*/, "\u274C Access Denied: You can only ask about the approved fields.\n\nApproved fields: ".concat(requestedFields.join(', '))];
                    }
                    return [4 /*yield*/, (0, fileUtils_1.readJsonFile)('data/user_bank_data.json')];
                case 1:
                    allData = _f.sent();
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('../../data/approvedServices'); })];
                case 2:
                    approvedServices = (_f.sent()).approvedServices;
                    service = approvedServices.find(function (s) { return s.service === serviceName; });
                    if (!service)
                        return [2 /*return*/, '❌ Error: Service not recognized.'];
                    targetEmails = service.customers.map(function (c) { return c.email; });
                    relevantData = allData.filter(function (row) { return targetEmails.includes(row.email); });
                    displayData = relevantData.map(function (row) {
                        var filtered = {};
                        requestedFields.forEach(function (field) {
                            if (row[field] !== undefined)
                                filtered[field] = row[field];
                        });
                        filtered.name = row.name; // always include name for context
                        return filtered;
                    });
                    prompt = "You are Nexon \u2014 a secure AI assistant for Nexavault.\n\nYour job is to answer questions using the following customer dataset:\n\n".concat(displayData.map(function (d) { return JSON.stringify(d); }).join('\n'), "\n\nUser query: ").concat(query);
                    console.log('📦 Prompt sent to Groq:\n', prompt);
                    return [4 /*yield*/, fetch('https://api.groq.com/openai/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(groqApiKey),
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                model: 'llama-3-3b-8192',
                                temperature: isRangeBasedField(query) ? 0.3 : 0.1,
                                messages: [
                                    { role: 'system', content: 'You are a secure LLM designed for privacy-preserving query answering.' },
                                    { role: 'user', content: prompt }
                                ]
                            })
                        })];
                case 3:
                    res = _f.sent();
                    return [4 /*yield*/, res.json()];
                case 4:
                    data = _f.sent();
                    if (!res.ok || !((_e = (_d = (_c = data.choices) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content)) {
                        console.error('Groq error:', data);
                        throw new Error('LLM response error');
                    }
                    return [2 /*return*/, data.choices[0].message.content.trim()];
            }
        });
    });
}
