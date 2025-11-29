const News = require('../models/News');
const slugify = require('slugify');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');

class NewsController {
    async generateSlug(title, excludeId = null) {
        const baseSlug = slugify(title, { replacement: '-', trim: true, lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;
        while (true) {
            const query = { slug };
            if (excludeId) query._id = { $ne: excludeId };
            const existing = await News.findOne(query);
            if (!existing) break;
            slug = `${baseSlug}-${count}`;
            count++;
        }
        return slug;
    }

    // GET /news
    async index(req, res, next) {
        try {
            const items = await News.find({ published: true }).sort({ createdAt: -1 }).limit(20);
            res.render('news', { news: multipleMongooseToObject(items) });
        } catch (err) {
            next(err);
        }
    }

    // GET /news/:slug
    async show(req, res, next) {
        try {
            const item = await News.findOne({ slug: req.params.slug }).populate('author');
            if (!item) return res.status(404).send('News not found');
            res.render('news/show', { news: mongooseToObject(item) });
        } catch (err) {
            next(err);
        }
    }

    // GET /news/create
    create(req, res) {
        res.render('news/create');
    }

    // POST /news/store
    async store(req, res, next) {
        try {
            const { title, content, image, published } = req.body;
            if (!title) return res.render('news/create', { error: 'Title is required.', title, content });

            const slug = await this.generateSlug(title);
            const news = new News({
                title,
                content,
                image,
                slug,
                published: published === 'on' || published === 'true',
                author: req.session.userId,
            });

            await news.save();
            res.redirect(`/news/${news.slug}`);
        } catch (err) {
            next(err);
        }
    }

    // GET /news/manage (admin)
    async manage(req, res, next) {
        try {
            const items = await News.find({}).sort({ createdAt: -1 });
            res.render('news/manage', { news: multipleMongooseToObject(items) });
        } catch (err) {
            next(err);
        }
    }

    // GET /news/:id/edit (admin)
    async edit(req, res, next) {
        try {
            const item = await News.findById(req.params.id);
            if (!item) return res.status(404).send('News not found');
            res.render('news/edit', { news: mongooseToObject(item) });
        } catch (err) {
            next(err);
        }
    }

    // PUT /news/:id (admin)
    async update(req, res, next) {
        try {
            const { title, content, image, published } = req.body;
            const update = { title, content, image, published: published === 'on' || published === 'true' };
            // regenerate slug if title changed
            const existing = await News.findById(req.params.id);
            if (!existing) return res.status(404).send('News not found');
            if (title && title !== existing.title) {
                update.slug = await this.generateSlug(title, req.params.id);
            }
            const item = await News.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
            res.redirect(`/news/${item.slug}`);
        } catch (err) {
            next(err);
        }
    }

    // DELETE /news/:id (admin)
    async delete(req, res, next) {
        try {
            await News.deleteOne({ _id: req.params.id });
            res.redirect('/news/manage');
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new NewsController();
