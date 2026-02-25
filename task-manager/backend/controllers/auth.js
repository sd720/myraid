const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Helper to simulate Mongoose "select" behaviour
const filterUser = (user) => {
    const { password, ...rest } = user;
    return rest;
};

exports.register = async (req, res, next) => {
    // Original logic

    const User = require('../models/User');
    try {
        const { username, email, password } = req.body;
        const user = await User.create({ username, email, password });
        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    const User = require('../models/User');
    try {
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.getMe = async (req, res, next) => {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
};

const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') options.secure = true;
    res.status(statusCode).cookie('token', token, options).json({ success: true, token, data: filterUser(user) });
};
