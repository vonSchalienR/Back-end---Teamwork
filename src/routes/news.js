const express = require('express');
const router = express.Router();
const newsController = require('../app/controllers/NewsController');
const { requireAdmin } = require('../middleware/authorize');

router.get('/', newsController.index.bind(newsController));
router.get('/create', requireAdmin, newsController.create.bind(newsController));
router.post('/store', requireAdmin, newsController.store.bind(newsController));
router.get('/:slug', newsController.show.bind(newsController));

module.exports = router;
