const express = require('express');
const multer = require('multer');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Contact = require('../models/Contact');
const FAQ = require('../models/FAQ');
const AboutUs = require('../models/AboutUs');
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// ============= SERVICES ROUTES =============

// @route   GET /api/admin/services
// @desc    Get all services (admin) with pagination
// @access  Private
router.get('/services', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Service.countDocuments();
    const services = await Service.find()
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: services.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/services/:id
// @desc    Get single service by ID (admin)
// @access  Private
router.get('/services/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/services
// @desc    Create service (admin)
// @access  Private
router.post('/services', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, shortDescription, content, icon, isActive, order, subServices, subServiceImages } = req.body;

    const serviceData = {
      title,
      shortDescription,
      content: content || '',
      icon: icon || 'FileText',
      isActive: isActive !== 'false',
      order: order || 0,
      subServices: subServices ? JSON.parse(subServices) : [],
      images: []
    };

    // Handle main service images
    if (req.files && req.files.length > 0) {
      serviceData.images = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype
      }));
      // Keep first image in legacy 'image' field for backward compatibility
      serviceData.image = serviceData.images[0];
    }

    // Handle sub-service images from base64 strings (sent from frontend)
    if (subServiceImages) {
      const subImagesData = JSON.parse(subServiceImages);
      serviceData.subServices = serviceData.subServices.map((sub, idx) => ({
        ...sub,
        images: subImagesData[idx] || []
      }));
    }

    const service = await Service.create(serviceData);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   PUT /api/admin/services/:id
// @desc    Update service (admin)
// @access  Private
router.put('/services/:id', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, shortDescription, content, icon, isActive, order, subServices, subServiceImages, existingImages } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    // Update fields
    service.title = title || service.title;
    service.shortDescription = shortDescription || service.shortDescription;
    service.content = content !== undefined ? content : service.content;
    service.icon = icon || service.icon;
    service.isActive = isActive !== undefined ? isActive !== 'false' : service.isActive;
    service.order = order !== undefined ? order : service.order;

    // Update sub-services
    if (subServices) {
      service.subServices = JSON.parse(subServices);
    }

    // Handle sub-service images
    if (subServiceImages) {
      const subImagesData = JSON.parse(subServiceImages);
      service.subServices = service.subServices.map((sub, idx) => ({
        ...sub.toObject ? sub.toObject() : sub,
        images: subImagesData[idx] || []
      }));
    }

    // Handle existing images that should be kept
    let keptImages = [];
    if (existingImages) {
      keptImages = JSON.parse(existingImages);
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype
      }));
      service.images = [...keptImages, ...newImages].slice(0, 3); // Max 3 images
    } else {
      service.images = keptImages;
    }

    // Update legacy image field with first image
    if (service.images && service.images.length > 0) {
      service.image = service.images[0];
    }

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/admin/services/:id
// @desc    Delete service (admin)
// @access  Private
router.delete('/services/:id', protect, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= BLOGS ROUTES =============

// @route   GET /api/admin/blogs
// @desc    Get all blogs (admin) with pagination
// @access  Private
router.get('/blogs', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .select('-content')  // Exclude content for listing
      .sort({ createdAt: -1 })
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
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/blogs/:id
// @desc    Get single blog by ID (admin)
// @access  Private
router.get('/blogs/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/blogs
// @desc    Create blog (admin)
// @access  Private
router.post('/blogs', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, isPublished } = req.body;

    const blogData = {
      title,
      excerpt,
      content,
      author,
      category: category || 'Others',
      isPublished: isPublished !== 'false'
    };

    // Handle image upload
    if (req.file) {
      blogData.image = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   PUT /api/admin/blogs/:id
// @desc    Update blog (admin)
// @access  Private
router.put('/blogs/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, isPublished } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Update fields
    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.author = author || blog.author;
    blog.category = category || blog.category;
    blog.isPublished = isPublished !== undefined ? isPublished !== 'false' : blog.isPublished;

    // Handle image upload
    if (req.file) {
      blog.image = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    await blog.save();

    res.json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/admin/blogs/:id
// @desc    Delete blog (admin)
// @access  Private
router.delete('/blogs/:id', protect, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= CONTACTS ROUTES =============

// @route   GET /api/admin/contacts
// @desc    Get all contact submissions (admin) with pagination
// @access  Private
router.get('/contacts', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments();
    const unreadCount = await Contact.countDocuments({ isRead: false });
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: contacts.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      unreadCount,
      data: contacts
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/contacts/:id/read
// @desc    Mark contact as read (admin)
// @access  Private
router.put('/contacts/:id/read', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/admin/contacts/:id
// @desc    Delete contact (admin)
// @access  Private
router.delete('/contacts/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }
    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= DASHBOARD STATS =============

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics (admin)
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const [servicesCount, blogsCount, contactsCount, unreadContacts] = await Promise.all([
      Service.countDocuments(),
      Blog.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false })
    ]);

    const recentContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBlogs = await Blog.find()
      .select('title slug createdAt views')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        servicesCount,
        blogsCount,
        contactsCount,
        unreadContacts,
        recentContacts,
        recentBlogs
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= SEED SERVICES ROUTE =============

// @route   POST /api/admin/seed-services
// @desc    Seed services with default data
// @access  Private
router.post('/seed-services', protect, async (req, res) => {
  try {
    const { seedServices } = require('../utils/seedServices');
    await seedServices();
    res.json({ success: true, message: 'Services seeded successfully' });
  } catch (error) {
    console.error('Seed services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/seed-faqs
// @desc    Seed FAQs with default data
// @access  Private
router.post('/seed-faqs', protect, async (req, res) => {
  try {
    const { seedFAQs } = require('../utils/seedFAQs');
    const result = await seedFAQs();
    res.json(result);
  } catch (error) {
    console.error('Seed FAQs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= FAQ ROUTES =============

// @route   GET /api/admin/faqs
// @desc    Get all FAQs (admin) with pagination
// @access  Private
router.get('/faqs', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await FAQ.countDocuments();
    const faqs = await FAQ.find()
      .sort({ category: 1, order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: faqs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/admin/faqs/:id
// @desc    Get single FAQ by ID (admin)
// @access  Private
router.get('/faqs/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, data: faq });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/faqs
// @desc    Create FAQ (admin)
// @access  Private
router.post('/faqs', protect, async (req, res) => {
  try {
    const { question, answer, category, isActive, order } = req.body;

    const faq = await FAQ.create({
      question,
      answer,
      category: category || 'General',
      isActive: isActive !== false,
      order: order || 0
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   PUT /api/admin/faqs/:id
// @desc    Update FAQ (admin)
// @access  Private
router.put('/faqs/:id', protect, async (req, res) => {
  try {
    const { question, answer, category, isActive, order } = req.body;

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }

    faq.question = question || faq.question;
    faq.answer = answer || faq.answer;
    faq.category = category || faq.category;
    faq.isActive = isActive !== undefined ? isActive : faq.isActive;
    faq.order = order !== undefined ? order : faq.order;

    await faq.save();

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/admin/faqs/:id
// @desc    Delete FAQ (admin)
// @access  Private
router.delete('/faqs/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: 'FAQ not found' });
    }
    res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ============= ABOUT US ROUTES =============

// @route   GET /api/admin/aboutus
// @desc    Get About Us content (admin)
// @access  Private
router.get('/aboutus', protect, async (req, res) => {
  try {
    let aboutUs = await AboutUs.findOne();

    if (!aboutUs) {
      // Create default about us content
      aboutUs = await AboutUs.create({
        heroTitle: 'About Us',
        heroSubtitle: 'Your Trusted Chartered Accountants',
        storyTitle: 'Our Story',
        storyContent: 'A S Gupta & Co is a professionally managed Chartered Accountancy firm providing comprehensive accounting, taxation, audit, and advisory services to businesses and individuals across India.',
        missionTitle: 'Our Mission',
        missionContent: 'To provide exceptional financial services with integrity, expertise, and dedication.',
        visionTitle: 'Our Vision',
        visionContent: 'To be recognized as a leading Chartered Accountancy firm known for excellence, innovation, and client satisfaction.',
        coreValues: [
          { title: 'Integrity', description: 'We uphold the highest ethical standards', icon: 'Shield', order: 1 },
          { title: 'Excellence', description: 'We strive for excellence in every service', icon: 'Award', order: 2 },
          { title: 'Client Focus', description: 'Your success is our priority', icon: 'Users', order: 3 },
          { title: 'Innovation', description: 'Modern solutions for complex challenges', icon: 'Lightbulb', order: 4 }
        ],
        teamTitle: 'Meet Our Team',
        teamSubtitle: 'Expert Chartered Accountants',
        teamMembers: [],
        whyChooseUsTitle: 'Why Choose Us',
        whyChooseUsPoints: [
          { title: 'Expert Guidance', description: 'Years of industry experience', icon: 'Target' },
          { title: 'Quick Turnaround', description: 'Efficient service delivery', icon: 'Clock' },
          { title: 'Personalized Service', description: 'Customized solutions for you', icon: 'Heart' }
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
      });
    }

    res.json({ success: true, data: aboutUs });
  } catch (error) {
    console.error('Get About Us error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/admin/aboutus
// @desc    Update About Us content (admin)
// @access  Private
router.put('/aboutus', protect, upload.array('teamImages', 10), async (req, res) => {
  try {
    let aboutUs = await AboutUs.findOne();

    if (!aboutUs) {
      aboutUs = new AboutUs();
    }

    const {
      heroTitle, heroSubtitle,
      storyTitle, storyContent,
      missionTitle, missionContent,
      visionTitle, visionContent,
      coreValues,
      teamTitle, teamSubtitle, teamMembers,
      whyChooseUsTitle, whyChooseUsPoints,
      serviceAreas,
      address, phone, email, workingHours
    } = req.body;

    // Update simple fields
    if (heroTitle !== undefined) aboutUs.heroTitle = heroTitle;
    if (heroSubtitle !== undefined) aboutUs.heroSubtitle = heroSubtitle;
    if (storyTitle !== undefined) aboutUs.storyTitle = storyTitle;
    if (storyContent !== undefined) aboutUs.storyContent = storyContent;
    if (missionTitle !== undefined) aboutUs.missionTitle = missionTitle;
    if (missionContent !== undefined) aboutUs.missionContent = missionContent;
    if (visionTitle !== undefined) aboutUs.visionTitle = visionTitle;
    if (visionContent !== undefined) aboutUs.visionContent = visionContent;
    if (teamTitle !== undefined) aboutUs.teamTitle = teamTitle;
    if (teamSubtitle !== undefined) aboutUs.teamSubtitle = teamSubtitle;
    if (whyChooseUsTitle !== undefined) aboutUs.whyChooseUsTitle = whyChooseUsTitle;
    if (address !== undefined) aboutUs.address = address;
    if (phone !== undefined) aboutUs.phone = phone;
    if (email !== undefined) aboutUs.email = email;
    if (workingHours !== undefined) aboutUs.workingHours = workingHours;

    // Update array fields (JSON strings from form)
    if (coreValues) aboutUs.coreValues = JSON.parse(coreValues);
    if (teamMembers) aboutUs.teamMembers = JSON.parse(teamMembers);
    if (whyChooseUsPoints) aboutUs.whyChooseUsPoints = JSON.parse(whyChooseUsPoints);
    if (serviceAreas) aboutUs.serviceAreas = JSON.parse(serviceAreas);

    // Handle team member images if uploaded
    if (req.files && req.files.length > 0) {
      const members = aboutUs.teamMembers || [];
      req.files.forEach((file, index) => {
        if (members[index]) {
          members[index].image = {
            data: file.buffer.toString('base64'),
            contentType: file.mimetype
          };
        }
      });
      aboutUs.teamMembers = members;
    }

    await aboutUs.save();

    res.json({
      success: true,
      message: 'About Us updated successfully',
      data: aboutUs
    });
  } catch (error) {
    console.error('Update About Us error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// ============= CATEGORY ROUTES =============

// Default categories for seeding
const defaultFAQCategories = [
  { name: 'General', icon: 'HelpCircle', order: 1 },
  { name: 'Income Tax', icon: 'FileText', order: 2 },
  { name: 'GST', icon: 'Receipt', order: 3 },
  { name: 'Company & Startup', icon: 'Building', order: 4 },
  { name: 'Audit & Accounting', icon: 'Users', order: 5 }
];

const defaultBlogCategories = [
  { name: 'All', icon: 'BookOpen', order: 0 },
  { name: 'Income Tax', icon: 'FileText', order: 1 },
  { name: 'GST', icon: 'TrendingUp', order: 2 },
  { name: 'Company Law', icon: 'FileText', order: 3 },
  { name: 'Startups', icon: 'TrendingUp', order: 4 }
];

// @route   GET /api/admin/categories
// @desc    Get all categories (admin) - filter by type
// @access  Private
router.get('/categories', protect, async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });

    // If no categories found for a type, seed defaults
    if (categories.length === 0 && type) {
      const defaults = type === 'faq' ? defaultFAQCategories : defaultBlogCategories;
      const seeded = await Category.insertMany(
        defaults.map(cat => ({ ...cat, type }))
      );
      return res.json({ success: true, data: seeded });
    }

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/admin/categories
// @desc    Create category (admin)
// @access  Private
router.post('/categories', protect, async (req, res) => {
  try {
    const { name, type, icon, order, isActive } = req.body;

    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }

    const category = await Category.create({
      name,
      type,
      icon: icon || 'HelpCircle',
      order: order || 0,
      isActive: isActive !== false
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category already exists for this type' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   PUT /api/admin/categories/:id
// @desc    Update category (admin)
// @access  Private
router.put('/categories/:id', protect, async (req, res) => {
  try {
    const { name, icon, order, isActive } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Update FAQs/Blogs with old category name to new name
    if (name && name !== category.name) {
      if (category.type === 'faq') {
        await FAQ.updateMany({ category: category.name }, { category: name });
      } else if (category.type === 'blog') {
        await Blog.updateMany({ category: category.name }, { category: name });
      }
    }

    category.name = name || category.name;
    category.icon = icon || category.icon;
    category.order = order !== undefined ? order : category.order;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Category name already exists for this type' });
    }
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

// @route   DELETE /api/admin/categories/:id
// @desc    Delete category (admin)
// @access  Private
router.delete('/categories/:id', protect, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category is in use
    let inUseCount = 0;
    if (category.type === 'faq') {
      inUseCount = await FAQ.countDocuments({ category: category.name });
    } else if (category.type === 'blog') {
      inUseCount = await Blog.countDocuments({ category: category.name });
    }

    if (inUseCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. This category is used by ${inUseCount} ${category.type === 'faq' ? 'FAQs' : 'blogs'}.`
      });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
