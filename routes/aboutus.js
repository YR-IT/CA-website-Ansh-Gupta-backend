const express = require('express');
const AboutUs = require('../models/AboutUs');

const router = express.Router();

// @route   GET /api/aboutus
// @desc    Get About Us content (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    let aboutUs = await AboutUs.findOne();

    // If no about us data exists, return default structure
    if (!aboutUs) {
      aboutUs = {
        heroTitle: 'About Us',
        heroSubtitle: 'Your Trusted Chartered Accountants',
        storyTitle: 'Our Story',
        storyContent: 'A S Gupta & Co is a professionally managed Chartered Accountancy firm providing comprehensive accounting, taxation, audit, and advisory services to businesses and individuals across India. Our firm is built on integrity, expertise, and a commitment to helping clients grow with confidence and full regulatory compliance.',
        missionTitle: 'Our Mission',
        missionContent: 'To provide exceptional financial services with integrity, expertise, and dedication. We aim to be trusted advisors helping businesses navigate complex financial landscapes while ensuring complete compliance and sustainable growth.',
        visionTitle: 'Our Vision',
        visionContent: 'To be recognized as a leading Chartered Accountancy firm known for excellence, innovation, and client satisfaction. We strive to build lasting relationships through continuous learning, professional ethics, and value-driven services.',
        coreValues: [
          { title: 'Integrity', description: 'We uphold the highest ethical standards in all our dealings', icon: 'Shield', order: 1 },
          { title: 'Excellence', description: 'We strive for excellence in every service we provide', icon: 'Award', order: 2 },
          { title: 'Client Focus', description: 'Your success is our priority - we put clients first', icon: 'Users', order: 3 },
          { title: 'Innovation', description: 'We embrace modern solutions for complex challenges', icon: 'Lightbulb', order: 4 }
        ],
        teamTitle: 'Meet Our Team',
        teamSubtitle: 'Expert Chartered Accountants dedicated to your success',
        teamMembers: [],
        whyChooseUsTitle: 'Why Choose Us',
        whyChooseUsPoints: [
          { title: 'Expert Guidance', description: 'Our team of qualified CAs brings years of industry experience', icon: 'Target' },
          { title: 'Quick Turnaround', description: 'Efficient service delivery without compromising quality', icon: 'Clock' },
          { title: 'Personalized Service', description: 'Customized solutions tailored to your specific needs', icon: 'Heart' }
        ],
        serviceAreas: [
          { city: 'Zirakpur', isActive: true },
          { city: 'Chandigarh', isActive: true },
          { city: 'Mohali', isActive: true },
          { city: 'Panchkula', isActive: true }
        ],
        address: '3A Savitry Enclave, VIP Road, Zirakpur, Punjab',
        phone: '+91 90340 59226',
        email: 'contact@asguptaco.com',
        workingHours: 'Mon - Sat: 10:00 AM - 7:00 PM'
      };
    }

    res.json({
      success: true,
      data: aboutUs
    });
  } catch (error) {
    console.error('Get About Us error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
