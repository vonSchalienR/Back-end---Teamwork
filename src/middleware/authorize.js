// Authorization helpers
const User = require('../app/models/User');

async function requireAuth(req, res, next) {
    if (req.session && req.session.userId) return next();
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
}

async function requireAdmin(req, res, next) {
    try {
        if (!req.session || !req.session.userId) {
            req.session.returnTo = req.originalUrl;
            return res.redirect('/login');
        }
        const user = await User.findById(req.session.userId).lean();
        if (!user) return res.status(403).send('Forbidden');
        if (user.role !== 'admin') return res.status(403).send('Forbidden');
        return next();
    } catch (err) {
        next(err);
    }
}

module.exports = { requireAuth, requireAdmin };
