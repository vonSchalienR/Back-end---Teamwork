// Simple auth middleware: if user not authenticated, redirect to /login
module.exports = function(req, res, next) {
    // Allow static files (served earlier), login routes and public endpoints
    const whitelist = [
        '/login',
        '/logout',
        '/register',
        '/reset',
        '/favicon.ico',
    ];

    // allow AJAX health checks or API endpoints if needed (add here)

    // If request path is whitelisted, continue
    if (whitelist.includes(req.path)) {
        return next();
    }

    // Allow POST to /login (method-sensitive)
    if (req.path === '/login' && req.method === 'POST') {
        return next();
    }

    // If session has userId, allow
    if (req.session && req.session.userId) {
        return next();
    }

    // Not authenticated -> remember return URL and redirect to login
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
};
