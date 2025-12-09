const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const { loginLimiter } = require('../middleware/rateLimit');

router.get('/login', authController.showLogin.bind(authController));
router.post('/login', loginLimiter, authController.login.bind(authController));
router.get('/logout', authController.logout.bind(authController));

router.get('/register', authController.showRegister.bind(authController));
router.post('/register', authController.register.bind(authController));

router.get('/reset', authController.showReset.bind(authController));
router.post('/reset', authController.reset.bind(authController));

module.exports = router;
