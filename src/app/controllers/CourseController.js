const Course = require('../models/Course');
const { multipleMongooseToObject, mongooseToObject } = require('../../util/mongoose');
const slugify = require('slugify');

class CourseController {

    async generateSlug(name, excludeId = null) {
        const baseSlug = slugify(name, { replacement: '-', trim: true, lower: true, strict: true });

        let slug = baseSlug;
        let count = 1;

        while (true) {
            const query = { slug };
            if (excludeId) {
                query._id = { $ne: excludeId }; // Loại trừ course đang edit
            }
            
            const existingCourse = await Course.findOne(query);
            if (!existingCourse) {
                break; // Slug available
            }
            
            slug = `${baseSlug}-${count}`;
            count++;
        }
        return slug;
    }

    

    // GET /courses/create
    create(req, res, next) {
        res.render('courses/create');
    }
    // POST /courses/store
    async store(req, res, next) {
        try {
            const formData = req.body;
            formData.image = `https://img.youtube.com/vi/${formData.videoId}/sddefault.jpg`;
            // formData.slug = formData.name.toLowerCase().replace(/ /g, '-');
            formData.slug = await this.generateSlug(formData.name);
            console.log('Form data before save:', formData);
            
            const course = new Course(formData);
            await course.save();
            
            console.log('Course after save:', course);
            console.log('Course slug:', course.slug);
            
            res.redirect(`/courses/${course.slug}`);
        } catch (error) {
            console.error('Error creating course:', error);
            next(error);
        }
    }

    // GET /courses/:slug
    async show(req, res, next) {
        try {
            const course = await Course.findOne({ slug: req.params.slug});
            if (!course){
                return res.status(404).send('Course not found');
            } 
            res.render('courses/show', { course: mongooseToObject(course) });
        } catch(error) {
            next(error);
        }
        
    }   
    // GET /courses/:id/edit
    async edit(req, res, next) {
        try {
            const course = await Course.findById(req.params.id)
            if (!course) {
                return res.status(404).send('Course not found');
            }
            res.render('courses/edit', { course: mongooseToObject(course) });
        } catch (error) {
            next(error);
        }
    }

    // PUT /courses/:id
    async update(req, res, next) {

        console.log('typeof this.generateSlug:', typeof this.generateSlug);

        try {
            const formData = req.body;
            
            // Update image if videoId changed
            if (formData.videoId) {
                formData.image = `https://img.youtube.com/vi/${formData.videoId}/sddefault.jpg`;
            }
            
            // Update slug if name changed
            if (formData.name) {
                formData.slug = await this.generateSlug(formData.name, req.params.id);
            }
            
            console.log('Updating course with data:', formData);
            
            const course = await Course.findByIdAndUpdate(
                req.params.id, 
                formData, 
                { new: true, runValidators: true }
            );
            
            if (!course) {
                return res.status(404).send('Course not found');
            }
            
            console.log('Course updated:', course);
            res.redirect(`/courses/${course.slug}`);
        } catch (error) {
            console.error('Error updating course:', error);
            next(error);
        }
    }

    // DELETE /courses/:id (Soft Delete)
    async delete(req, res, next) {
        try {
            await Course.delete({ _id: req.params.id });
            res.redirect('/me/stored/courses');
        } catch (error) {
            next(error);
        }
    }

    // POST /courses/:id/restore
    async restore(req, res, next) {
        try {
            await Course.restore({ _id: req.params.id });
            res.redirect('/me/stored/courses');
        } catch (error) {
            next(error);
        }
    }

    // DELETE /courses/:id/force (Hard Delete)
    async forceDelete(req, res, next) {
        try {
            await Course.deleteOne({ _id: req.params.id });
            res.redirect('/me/stored/courses');
        } catch (error) {
            next(error);
        }
    }

}

module.exports = new CourseController();
