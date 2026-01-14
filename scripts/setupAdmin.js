#!/usr/bin/env node
/**
 * Admin Setup Script
 * Run this script to create or reset the admin account
 *
 * Usage:
 *   node scripts/setupAdmin.js
 *
 * Or with npm script:
 *   npm run setup:admin
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Admin = require('../models/Admin');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const setupAdmin = async () => {
  console.log('\n========================================');
  console.log('   A S GUPTA AND CO - Admin Setup');
  console.log('========================================\n');

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully!\n');

    // Check if admin exists
    const existingAdmin = await Admin.findOne();

    if (existingAdmin) {
      console.log(`An admin account already exists: ${existingAdmin.email}`);
      const resetChoice = await question('\nDo you want to reset the admin account? (yes/no): ');

      if (resetChoice.toLowerCase() !== 'yes' && resetChoice.toLowerCase() !== 'y') {
        console.log('\nSetup cancelled. Existing admin account preserved.');
        await cleanup();
        return;
      }

      // Delete existing admin
      await Admin.deleteMany({});
      console.log('\nExisting admin account deleted.');
    }

    // Get admin details
    console.log('\n--- Create New Admin Account ---\n');

    // Name
    let name = await question('Admin Name (default: Admin): ');
    name = name.trim() || 'Admin';

    // Email
    let email;
    while (true) {
      email = await question('Admin Email: ');
      email = email.trim().toLowerCase();

      if (!email) {
        console.log('Email is required. Please try again.');
        continue;
      }

      if (!validateEmail(email)) {
        console.log('Invalid email format. Please try again.');
        continue;
      }

      break;
    }

    // Password
    let password;
    while (true) {
      password = await question('Admin Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number): ');

      if (!password) {
        console.log('Password is required. Please try again.');
        continue;
      }

      if (!validatePassword(password)) {
        console.log('Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number.');
        continue;
      }

      const confirmPassword = await question('Confirm Password: ');

      if (password !== confirmPassword) {
        console.log('Passwords do not match. Please try again.');
        continue;
      }

      break;
    }

    // Create admin
    console.log('\nCreating admin account...');
    const admin = await Admin.create({
      name,
      email,
      password
    });

    console.log('\n========================================');
    console.log('   Admin Account Created Successfully!');
    console.log('========================================');
    console.log(`\n   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log('\n   Login URL: /admin/login');
    console.log('\n========================================\n');

    // Update .env suggestion
    console.log('TIP: Update your .env file with these credentials for reference:');
    console.log(`   ADMIN_EMAIL=${email}`);
    console.log('   ADMIN_PASSWORD=<your_password>\n');

  } catch (error) {
    console.error('\nError during setup:', error.message);
    process.exit(1);
  }

  await cleanup();
};

const cleanup = async () => {
  rl.close();
  await mongoose.connection.close();
  console.log('Setup complete. Database connection closed.');
  process.exit(0);
};

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n\nSetup interrupted.');
  await cleanup();
});

// Run setup
setupAdmin();
