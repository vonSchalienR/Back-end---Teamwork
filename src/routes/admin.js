const express = require('express');
const router = express.Router();
const { requireAdmin } = require('../middleware/authorize');
const adminUserController = require('../app/controllers/AdminUserController');

router.get('/users', requireAdmin, adminUserController.list.bind(adminUserController));
router.patch('/users/:id/make-admin', requireAdmin, adminUserController.makeAdmin.bind(adminUserController));

module.exports = router;
