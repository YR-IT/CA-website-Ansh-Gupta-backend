const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    data: String,
    contentType: String
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const coreValueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'Star'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const serviceAreaSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const aboutUsSchema = new mongoose.Schema({
  // Hero Section
  heroTitle: {
    type: String,
    default: 'About Us'
  },
  heroSubtitle: {
    type: String,
    default: 'Your Trusted Chartered Accountants'
  },

  // Story Section
  storyTitle: {
    type: String,
    default: 'Our Story'
  },
  storyContent: {
    type: String,
    default: ''
  },

  // Mission & Vision
  missionTitle: {
    type: String,
    default: 'Our Mission'
  },
  missionContent: {
    type: String,
    default: ''
  },
  visionTitle: {
    type: String,
    default: 'Our Vision'
  },
  visionContent: {
    type: String,
    default: ''
  },

  // Core Values
  coreValues: [coreValueSchema],

  // Team Section
  teamTitle: {
    type: String,
    default: 'Meet Our Team'
  },
  teamSubtitle: {
    type: String,
    default: 'Expert Chartered Accountants'
  },
  teamMembers: [teamMemberSchema],

  // Why Choose Us
  whyChooseUsTitle: {
    type: String,
    default: 'Why Choose Us'
  },
  whyChooseUsPoints: [{
    title: String,
    description: String,
    icon: String
  }],

  // Service Areas
  serviceAreas: [serviceAreaSchema],

  // Contact Info
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  workingHours: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AboutUs', aboutUsSchema);
