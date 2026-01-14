const Admin = require('../models/Admin');
const crypto = require('crypto');

/**
 * Creates a default admin account if none exists
 * Uses environment variables or generates secure defaults
 */
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne();

    if (!adminExists) {
      // Get credentials from environment variables
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      const name = process.env.ADMIN_NAME || 'Admin';

      // Validate that credentials are provided in production
      if (process.env.NODE_ENV === 'production' && (!email || !password)) {
        console.error('========================================');
        console.error('ERROR: Admin credentials not set!');
        console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your .env file');
        console.error('Or run: npm run setup:admin');
        console.error('========================================');
        return;
      }

      // In development, use defaults if not provided
      const adminEmail = email || 'admin@asgupta.com';
      const adminPassword = password || 'Admin@123';

      const admin = await Admin.create({
        email: adminEmail,
        password: adminPassword,
        name: name
      });

      console.log('========================================');
      console.log('Default admin account created!');
      console.log('========================================');
      console.log(`Email: ${admin.email}`);

      if (!email || !password) {
        console.log('Password: Admin@123 (CHANGE THIS IN PRODUCTION!)');
        console.log('');
        console.log('To set custom credentials, add to .env:');
        console.log('  ADMIN_EMAIL=your_email@domain.com');
        console.log('  ADMIN_PASSWORD=YourSecurePassword123');
      } else {
        console.log('Password: (as configured in .env)');
      }
      console.log('========================================');
    } else {
      console.log(`Admin exists: ${adminExists.email}`);
    }
  } catch (error) {
    console.error('Error creating default admin:', error.message);
  }
};

/**
 * Generates a secure random JWT secret
 */
const generateJWTSecret = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = { createDefaultAdmin, generateJWTSecret };
