const User = require('../models/User');
const { isValidEmail, isValidPassword } = require('../../util/validators');
const crypto = require("crypto");
const nodemailer = require("nodemailer");



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

    // GET /reset
    showReset(req, res) {
        res.render('auth/reset', { error: req.query.error, email: req.query.email });
    }
    // POST /reset
    async reset(req, res, next) {
        try {
            const { email } = req.body;
            const rawEmail = email.trim().toLowerCase();
            if (!rawEmail) {
                return res.render('auth/reset', { error: 'Email is required.', email: rawEmail });
            }
            if (!isValidEmail(rawEmail)) {
                return res.render('auth/reset', { error: 'Please enter a valid email address.', email: rawEmail });
            }   
            const user = await User.findOne({ email: rawEmail });
            if (!user) {
                return res.render('auth/reset', { error: 'No account found with that email.', email: rawEmail });
            }  
             
            // generate a reset token and send an email
            // Generate reset token
            const token = crypto.randomBytes(32).toString("hex");
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiry

            await user.save();

            // Send reset email
            const resetUrl = `https://yourdomain.com/auth/reset-password?token=${token}`;

            const transporter = nodemailer.createTransport({
            host: "smtp.your-email.com",
            port: 587,
            auth: {
                user: "your-smtp-user",
                pass: "your-smtp-password"
            }
            });

            await transporter.sendMail({
            from: '"CourseSub" <no-reply@gmail.com>',
            to: user.email,
            subject: "Password Reset",
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`
            });

            return res.render('auth/reset', { error: 'If an account with that email exists, a reset link has been sent.', email: '' });

        } catch (error) {
            next(error);
        }   
    }
}

module.exports = new AuthController();
