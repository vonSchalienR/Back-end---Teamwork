const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class SiteController {

    // GET /home
    async index(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('home', { courses: multipleMongooseToObject(courses), title: 'Home Page' });
        } catch (error) {
            next(error);
        }

        
    }

    
    // GET /search
    search(req, res) {
        res.render('search');
    }

    // POST /search
    searchResults(req, res) {
        res.send('Search results will be displayed here');
    }
}

module.exports = new SiteController();
