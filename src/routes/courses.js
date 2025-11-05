const express = require('express');
const router = express.Router();
const courseController = require('../app/controllers/CourseController');

router.get('/create', courseController.create.bind(courseController));
router.post('/store', courseController.store.bind(courseController));

router.get('/:id/edit', courseController.edit.bind(courseController));
router.put('/:id', courseController.update.bind(courseController));
router.delete('/:id', courseController.delete.bind(courseController));
router.patch('/:id/restore', courseController.restore.bind(courseController));
router.delete('/:id/force', courseController.forceDelete.bind(courseController));

router.get('/:slug', courseController.show.bind(courseController));


module.exports = router;






