const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: [5000, 'Message cannot exceed 5000 characters']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isReplied: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
