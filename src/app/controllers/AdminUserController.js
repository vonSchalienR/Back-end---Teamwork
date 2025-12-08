const User = require('../models/User');

class AdminUserController {
    async list(req, res, next) {
        try {
            const users = await User.find({}).sort({ createdAt: -1 }).lean();
            return res.render('admin/users', { users });
        } catch (err) {
            return next(err);
        }
    }

    async makeAdmin(req, res, next) {
        try {
            const { id } = req.params;
            await User.findByIdAndUpdate(id, { role: 'admin' });
            return res.redirect('back');
        } catch (err) {
            return next(err);
        }
    }
}

module.exports = new AdminUserController();
