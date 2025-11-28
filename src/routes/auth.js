const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');

router.get('/login', authController.showLogin.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/logout', authController.logout.bind(authController));

module.exports = router;
