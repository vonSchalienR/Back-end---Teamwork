const express = require('express');
const router = express.Router();
const newsController = require('../app/controllers/NewsController');
const { requireAdmin } = require('../middleware/authorize');

router.get('/', newsController.index.bind(newsController));
router.get('/create', requireAdmin, newsController.create.bind(newsController));
router.post('/store', requireAdmin, newsController.store.bind(newsController));
router.get('/manage', requireAdmin, newsController.manage.bind(newsController));
router.get('/:id/edit', requireAdmin, newsController.edit.bind(newsController));
router.put('/:id', requireAdmin, newsController.update.bind(newsController));
router.delete('/:id', requireAdmin, newsController.delete.bind(newsController));
router.get('/:slug', newsController.show.bind(newsController));

module.exports = router;
