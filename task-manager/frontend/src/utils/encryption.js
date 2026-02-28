import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.NEXT_PUBLIC_AES_SECRET_KEY;

export const encrypt = (text) => {
    if (!text) return text;
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (ciphertext) => {
    if (!ciphertext) return ciphertext;
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        if (!originalText) return ciphertext; // Fallback if result is empty
        return originalText;
    } catch (err) {
        console.error('Decryption failed:', err);
        return ciphertext; // Return original if decryption fails
    }
};
