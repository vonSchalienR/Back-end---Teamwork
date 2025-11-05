
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');

const CourseSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  videoId: { type: String },
  level: { type: String },
  slug: { type: String, required: true, unique: true },

}, 
  { timestamps: true }
);

// Apply the plugin with overrideMethods option
CourseSchema.plugin(mongooseDelete, { 
    deletedAt: true,
    deletedBy: true,
    indexFields: ['deleted', 'deletedAt'],
    overrideMethods: 'all'
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;