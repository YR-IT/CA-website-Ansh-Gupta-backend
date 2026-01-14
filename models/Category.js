const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['faq', 'blog'],
    index: true
  },
  icon: {
    type: String,
    default: 'HelpCircle'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Compound unique index for name within type
categorySchema.index({ name: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
