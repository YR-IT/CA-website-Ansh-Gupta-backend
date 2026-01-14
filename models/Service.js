const mongoose = require('mongoose');
const slugify = require('slugify');

// Image schema for reuse
const imageSchema = new mongoose.Schema({
  data: String,  // Base64 encoded image
  contentType: String
}, { _id: false });

// Sub-service schema
const subServiceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Sub-service title is required'],
    trim: true
  },
  slug: {
    type: String
  },
  shortDescription: {
    type: String,
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Sub-service content is required']
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
});

// Validate max 3 images
function arrayLimit(val) {
  return val.length <= 3;
}

// Generate slug for sub-service
subServiceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: 300
  },
  content: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'FileText'
  },
  image: {
    data: String,  // Base64 encoded image (kept for backward compatibility)
    contentType: String
  },
  images: {
    type: [imageSchema],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    default: []
  },
  subServices: [subServiceSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Generate slug before saving
serviceSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  // Generate slugs for sub-services
  if (this.subServices && this.subServices.length > 0) {
    this.subServices.forEach(sub => {
      if (!sub.slug) {
        sub.slug = slugify(sub.title, { lower: true, strict: true });
      }
    });
  }
  next();
});

module.exports = mongoose.model('Service', serviceSchema);
