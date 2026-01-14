const express = require('express');
const Contact = require('../models/Contact');
const { sendUserConfirmationEmail, sendAdminNotificationEmail } = require('../utils/email');

const router = express.Router();

// @route   POST /api/contact
// @desc    Submit contact form (public)
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message
    });

    // Send confirmation email to user
    sendUserConfirmationEmail(email, name, subject);

    // Send notification email to admin
    sendAdminNotificationEmail({ name, email, phone, subject, message });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!',
      data: {
        id: contact._id
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again.'
    });
  }
});

module.exports = router;
