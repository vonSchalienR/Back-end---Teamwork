const Course = require('../models/Course');
const { multipleMongooseToObject } = require('../../util/mongoose');

class MeController {

    async storedCourses(req, res, next) {
        try {
            // Dùng findWithDeleted() để hiển thị TẤT CẢ courses (cả deleted và chưa deleted)
            const courses = await Course.findWithDeleted({});
            console.log('Found courses:', courses.length);
            res.render('me/stored-courses', { 
                courses: multipleMongooseToObject(courses), 
                title: 'My Courses' 
            });
        } catch (error) {
            console.error('Error in storedCourses:', error);
            next(error);
        }
    }
}

module.exports = new MeController();
