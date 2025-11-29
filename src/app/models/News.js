const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String },
  image: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('News', NewsSchema);
