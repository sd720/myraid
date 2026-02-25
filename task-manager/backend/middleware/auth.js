const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    let token;
    if (req.cookies.token) token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (global.useMock) {
            const user = mockStore.users.find(u => u._id === decoded.id);
            if (!user) return res.status(401).json({ success: false });
            req.user = user;
            return next();
        }

        const User = require('../models/User');
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        return res.status(401).json({ success: false });
    }
};

module.exports = { protect };
