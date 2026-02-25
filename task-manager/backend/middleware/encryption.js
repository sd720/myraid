const { encrypt, decrypt } = require('../utils/encryption');

// Middleware to decrypt specific fields in req.body
const decryptBody = (fields) => (req, res, next) => {
    if (req.body) {
        fields.forEach(field => {
            if (req.body[field]) {
                try {
                    req.body[field] = decrypt(req.body[field]);
                } catch (err) {
                    // If decryption fails, maybe it wasn't encrypted or key is wrong
                    // Depending on security policy, we might error out or ignore
                }
            }
        });
    }
    next();
};

// Middleware to encrypt specific fields in response data
// This is a bit more complex as it needs to intercept res.json
const encryptResponse = (fields) => (req, res, next) => {
    const originalJson = res.json;
    res.json = function (data) {
        if (data && data.success && data.data) {
            const transform = (obj) => {
                fields.forEach(field => {
                    if (obj[field]) {
                        obj[field] = encrypt(obj[field]);
                    }
                });
            };

            if (Array.isArray(data.data)) {
                data.data.forEach(item => transform(item));
            } else {
                transform(data.data);
            }
        }
        return originalJson.call(this, data);
    };
    next();
};

module.exports = { decryptBody, encryptResponse };
