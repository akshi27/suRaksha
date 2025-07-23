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
exports.processQuery = void 0;
var fileUtils_1 = require("../utils/fileUtils");
/**
 * Main entry to process a capsule-based query.
 */
var processQuery = function (question, capsule) { return __awaiter(void 0, void 0, void 0, function () {
    var bankData, userBankData, answer, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, fileUtils_1.readJsonFile)('data/user_bank_data.json')];
            case 1:
                bankData = _a.sent();
                userBankData = bankData[capsule.userId] || {};
                answer = generateMaskedResponse(question, userBankData, capsule.approvedFields);
                return [2 /*return*/, {
                        answer: answer,
                        confidence: 0.85 + Math.random() * 0.15 // Mock confidence
                    }];
            case 2:
                error_1 = _a.sent();
                console.error('Query processing error:', error_1);
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.processQuery = processQuery;
/**
 * Generates a privacy-preserving response based on approved fields and user data.
 */
var generateMaskedResponse = function (question, bankData, approvedFields) {
    var lowerQuestion = question.toLowerCase();
    var relevantFields = approvedFields.filter(function (field) {
        return lowerQuestion.includes(field.toLowerCase()) ||
            lowerQuestion.includes(field.replace(/([A-Z])/g, ' $1').toLowerCase());
    });
    if (relevantFields.length === 0) {
        return "I can't provide information about that field as it's not in your approved data scope.";
    }
    var responses = relevantFields.map(function (field) {
        var value = bankData[field];
        if (!value)
            return null;
        switch (field) {
            case 'salary': {
                var salaryRange = getSalaryRange(value);
                return "The salary range is approximately \u20B9".concat(salaryRange.min, "k - \u20B9").concat(salaryRange.max, "k per month.");
            }
            case 'creditScore': {
                var scoreRange = getCreditScoreRange(value);
                return "The credit score falls in the ".concat(scoreRange, " category.");
            }
            case 'emiHistory': {
                return "EMI payment history shows ".concat(value.length, " active EMIs with consistent payment patterns.");
            }
            case 'accountBalance': {
                var balanceRange = getBalanceRange(value);
                return "Account balance is in the ".concat(balanceRange, " range.");
            }
            default: {
                return "Information about ".concat(field, " is available but abstracted for privacy.");
            }
        }
    }).filter(Boolean);
    return responses.length > 0
        ? responses.join(' ')
        : "I can provide information about your approved fields, but the specific data you're asking about isn't available.";
};
/**
 * Approximates salary into a descriptive range.
 */
var getSalaryRange = function (salary) {
    var ranges = [
        { min: 20, max: 35, actual: [20000, 35000] },
        { min: 35, max: 50, actual: [35000, 50000] },
        { min: 50, max: 75, actual: [50000, 75000] },
        { min: 75, max: 100, actual: [75000, 100000] },
        { min: 100, max: 150, actual: [100000, 150000] }
    ];
    return (ranges.find(function (range) { return salary >= range.actual[0] && salary <= range.actual[1]; }) ||
        ranges[ranges.length - 1]);
};
/**
 * Converts a raw credit score into a descriptive label.
 */
var getCreditScoreRange = function (score) {
    if (score >= 750)
        return 'Excellent (750+)';
    if (score >= 700)
        return 'Good (700-749)';
    if (score >= 650)
        return 'Fair (650-699)';
    return 'Needs Improvement (below 650)';
};
/**
 * Maps bank balance to a privacy-safe label.
 */
var getBalanceRange = function (balance) {
    if (balance >= 100000)
        return 'High (₹1L+)';
    if (balance >= 50000)
        return 'Medium-High (₹50k–₹1L)';
    if (balance >= 20000)
        return 'Medium (₹20k–₹50k)';
    return 'Low (below ₹20k)';
};
