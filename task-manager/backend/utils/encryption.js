const CryptoJS = require('crypto-js');

const encrypt = (text) => {
    return CryptoJS.AES.encrypt(text, process.env.AES_SECRET_KEY).toString();
};

const decrypt = (ciphertext) => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.AES_SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) return ciphertext;
        return originalText;
    } catch (err) {
        console.error('Backend Decryption failed:', err);
        return ciphertext;
    }
};

module.exports = { encrypt, decrypt };
