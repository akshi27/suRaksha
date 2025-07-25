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
exports.writeJsonFile = exports.readJsonFile = void 0;
var promises_1 = require("fs/promises");
var path_1 = require("path");
var url_1 = require("url");
var __filename = (0, url_1.fileURLToPath)(import.meta.url);
var __dirname = path_1.default.dirname(__filename);
/**
 * Reads a JSON file and parses its contents.
 * Logs full path for debugging. If file doesn't exist, returns an empty array or object.
 * @param filePath Relative to project root (e.g., 'data/users.json')
 */
var readJsonFile = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var rootDir, fullPath, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rootDir = path_1.default.resolve(__dirname, '..');
                fullPath = path_1.default.join(rootDir, filePath);
                console.log("\uD83D\uDCC4 Reading JSON from: ".concat(fullPath));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, promises_1.default.readFile(fullPath, 'utf8')];
            case 2:
                data = _a.sent();
                return [2 /*return*/, JSON.parse(data)];
            case 3:
                error_1 = _a.sent();
                if (error_1.code === 'ENOENT') {
                    console.warn("\u26A0\uFE0F File not found: ".concat(fullPath, ", returning empty array"));
                    return [2 /*return*/, []];
                }
                console.error("\u274C Error reading ".concat(filePath, ":"), error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.readJsonFile = readJsonFile;
/**
 * Writes a JavaScript object or array as JSON to the given path.
 * Ensures the target directory exists.
 * @param filePath Relative to project root (e.g., 'data/users.json')
 */
var writeJsonFile = function (filePath, data) { return __awaiter(void 0, void 0, void 0, function () {
    var rootDir, fullPath, dir, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                rootDir = path_1.default.resolve(__dirname, '..');
                fullPath = path_1.default.join(rootDir, filePath);
                dir = path_1.default.dirname(fullPath);
                console.log("\uD83D\uDCBE Writing JSON to: ".concat(fullPath));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
            case 2:
                _a.sent();
                return [4 /*yield*/, promises_1.default.writeFile(fullPath, JSON.stringify(data, null, 2), 'utf8')];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("\u274C Error writing to ".concat(filePath, ":"), error_2);
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.writeJsonFile = writeJsonFile;
