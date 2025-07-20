
    const crypto = require('crypto');

    const algorithm = 'aes-256-cbc';
    const key = Buffer.from('dKal3b0t9pfamt1sBFI5l9rLQHinWaw7B6hh4z0SZ0I=', 'base64');
    const iv = Buffer.from('f8cl50B+zqw9E3Pd/M8rSg==', 'base64');

    const decrypt = (encryptedTextBase64) => {
      const encryptedText = Buffer.from(encryptedTextBase64, 'base64');
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
      return decrypted.toString();
    };

    module.exports = { decrypt };
  