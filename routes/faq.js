const express = require('express');
const FAQ = require('../models/FAQ');
const { seedFAQs } = require('../utils/seedFAQs');

const router = express.Router();

// @route   GET /api/faq
// @desc    Get all active FAQs (public)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    // Check if FAQs exist, if not seed defaults
    const count = await FAQ.countDocuments();
    if (count === 0) {
      await seedFAQs();
    }

    const query = { isActive: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const faqs = await FAQ.find(query)
      .sort({ category: 1, order: 1, createdAt: -1 });

    // Group FAQs by category
    const groupedFaqs = faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    res.json({
      success: true,
      data: faqs,
      grouped: groupedFaqs,
      categories: Object.keys(groupedFaqs)
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/faq/categories
// @desc    Get all FAQ categories with count
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await FAQ.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: categories.map(c => ({ name: c._id, count: c.count }))
    });
  } catch (error) {
    console.error('Get FAQ categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
