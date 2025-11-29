const User = require('../models/User');
const { isValidEmail, isValidPassword } = require('../../util/validators');



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
            const rawEmail = email.trim().toLowerCase();

            if (!rawEmail || !password) {
                return res.render('auth/login', { error: 'Email and password are required.', email: rawEmail });
            }

            if (!isValidEmail(rawEmail)) {
                return res.render('auth/login', { error: 'Please enter a valid email address.', email: rawEmail });
            }


            const user = await User.findOne({ email: rawEmail });
            if (!user) {
                return res.render('auth/login', { error: 'Invalid email or password.', email: rawEmail });
            }

            const matched = await user.comparePassword(password);
            if (!matched) {
                return res.render('auth/login', { error: 'Invalid email or password.', email: rawEmail });
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

    // GET /register
    showRegister(req, res) {
        res.render('auth/register', { error: req.query.error, email: req.query.email, name: req.query.name });
    }

    // POST /register
    async register(req, res, next) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            const rawEmail = email.trim().toLowerCase();

            if (!name || !email || !password || !confirmPassword) {
                return res.render('auth/register', { error: 'All fields are required.', name, email: rawEmail });
            }

            if (!isValidEmail(rawEmail)) {
                return res.render('auth/register', { error: 'Please enter a valid email address.', name, email: rawEmail });
            }

            if (password !== confirmPassword) {
                return res.render('auth/register', { error: 'Passwords do not match.', name, email: rawEmail });
            }

            if (!isValidPassword(password)) {
                return res.render('auth/register', { error: 'Password must be at least 6 characters and include letters and numbers.', name, email: rawEmail });
            }

            // Check existing user
            const exists = await User.findOne({ email: rawEmail });
            if (exists) {
                return res.render('auth/register', { error: 'Email is already registered.', name, email: rawEmail });
            }

            const user = new User({ name, email: rawEmail, password });
            await user.save();

            // Auto-login after registration
            req.session.userId = user._id;
            const redirectTo = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(redirectTo);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
