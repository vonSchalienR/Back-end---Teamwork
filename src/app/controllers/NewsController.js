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
            const item = await News.findOne({ slug: req.params.slug });
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
}

module.exports = new NewsController();
