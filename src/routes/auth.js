const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');

router.get('/login', authController.showLogin.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/logout', authController.logout.bind(authController));

router.get('/register', authController.showRegister.bind(authController));
router.post('/register', authController.register.bind(authController));

module.exports = router;
