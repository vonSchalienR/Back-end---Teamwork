const User = require('../models/User');

class AuthController {
    // GET /login
    showLogin(req, res) {
        // show any passed error or preserved email
        res.render('auth/login', { error: req.query.error, email: req.query.email });
    }

    // POST /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.render('auth/login', { error: 'Email and password are required.', email });
            }

            const user = await User.findOne({ email: email });
            if (!user) {
                return res.render('auth/login', { error: 'Invalid email or password.', email });
            }

            const matched = await user.comparePassword(password);
            if (!matched) {
                return res.render('auth/login', { error: 'Invalid email or password.', email });
            }

            // Login success — store user id in session
            req.session.userId = user._id;
            // Redirect back to original url if present
            const redirectTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(redirectTo);
        } catch (error) {
            next(error);
        }
    }

    // GET /logout
    logout(req, res, next) {
        if (req.session) {
            req.session.destroy((err) => {
                if (err) return next(err);
                res.redirect('/');
            });
        } else {
            res.redirect('/');
        }
    }
}

module.exports = new AuthController();
