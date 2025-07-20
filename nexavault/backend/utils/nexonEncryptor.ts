import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

export const encryptResponse = (text: string) => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);

  return {
    encryptedData: encrypted.toString('base64'),
    key: key.toString('base64'),
    iv: iv.toString('base64'),
  };
};

export const generateDecryptionScript = (key: string, iv: string) => {
  return `
    const crypto = require('crypto');

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('${key}', 'base64');
    const iv = Buffer.from('${iv}', 'base64');

    const decrypt = (encryptedTextBase64) => {
      const encryptedText = Buffer.from(encryptedTextBase64, 'base64');
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return decrypted.toString();
    };

    module.exports = { decrypt };
  `;
};

