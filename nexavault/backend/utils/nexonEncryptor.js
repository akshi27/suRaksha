"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDecryptionScript = exports.encryptResponse = void 0;
var crypto_1 = require("crypto");
var algorithm = 'aes-256-cbc';
var encryptResponse = function (text) {
    var key = crypto_1.default.randomBytes(32);
    var iv = crypto_1.default.randomBytes(16);
    var cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    var encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    return {
        encryptedData: encrypted.toString('base64'),
        key: key.toString('base64'),
        iv: iv.toString('base64'),
    };
};
exports.encryptResponse = encryptResponse;
var generateDecryptionScript = function (key, iv) {
    return "\n    const crypto = require('crypto');\n\n    const algorithm = 'aes-256-cbc';\n    const key = Buffer.from('".concat(key, "', 'base64');\n    const iv = Buffer.from('").concat(iv, "', 'base64');\n\n    const decrypt = (encryptedTextBase64) => {\n      const encryptedText = Buffer.from(encryptedTextBase64, 'base64');\n      const decipher = crypto.createDecipheriv(algorithm, key, iv);\n      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);\n      return decrypted.toString();\n    };\n\n    module.exports = { decrypt };\n  ");
};
exports.generateDecryptionScript = generateDecryptionScript;
