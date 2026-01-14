const express = require('express');
const Blog = require('../models/Blog');
const Category = require('../models/Category');

const router = express.Router();

// @route   GET /api/blogs/categories
// @desc    Get all blog categories (public)
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({ type: 'blog', isActive: true })
      .select('name')
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/blogs
// @desc    Get all published blogs (public) with pagination and category filter
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    // Build query
    const query = { isPublished: true };
    if (category) {
      query.category = category;
    }

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .select('-content')  // Keep image, exclude only full content for listing
      .sort({ isFeatured: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: blogs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get single blog by slug (public)
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      isPublished: true
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
