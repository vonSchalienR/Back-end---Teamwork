const newsRouter = require('./news');
const authRouter = require('./auth');
const siteRouter = require('./site');
const courseRouter = require('./courses');
const meRouter = require('./me');

function route(app) {
    app.use('/', siteRouter);
    app.use('/', authRouter);
    app.use('/news', newsRouter);
    app.use('/courses', courseRouter);
    app.use('/me', meRouter);
}

module.exports = route;
