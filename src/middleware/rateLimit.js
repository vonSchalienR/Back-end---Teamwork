const rateLimit = require('express-rate-limit');

// Limit login attempts per IP to reduce brute-force risk
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts. Please try again later.',
});

module.exports = { loginLimiter };
