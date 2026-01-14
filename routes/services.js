const express = require('express');
const Service = require('../models/Service');

const router = express.Router();

// @route   GET /api/services
// @desc    Get all active services (public) with optional pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0; // 0 means no limit (all services)
    const skip = limit > 0 ? (page - 1) * limit : 0;

    const total = await Service.countDocuments({ isActive: true });

    let query = Service.find({ isActive: true })
      .select('-image.data')  // Exclude image data for listing
      .sort({ order: 1, createdAt: -1 });

    if (limit > 0) {
      query = query.skip(skip).limit(limit);
    }

    const services = await query;

    res.json({
      success: true,
      count: services.length,
      total,
      page: limit > 0 ? page : 1,
      pages: limit > 0 ? Math.ceil(total / limit) : 1,
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/services/:slug
// @desc    Get single service by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
