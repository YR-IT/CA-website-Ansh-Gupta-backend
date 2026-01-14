const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Blog content is required']
  },
  image: {
    data: String,  // Base64 encoded image
    contentType: String
  },
  author: {
    type: String,
    required: [true, 'Author name is required']
  },
  category: {
    type: String,
    default: 'Others'
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
