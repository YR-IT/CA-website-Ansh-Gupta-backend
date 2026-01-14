# A S GUPTA AND CO - Backend API

Node.js/Express REST API for the A S GUPTA AND CO Chartered Accountants website.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Security Features](#security-features)
- [Scripts](#scripts)
- [File Descriptions](#file-descriptions)

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | >=18.0.0 | Runtime Environment |
| Express.js | 4.21.1 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 8.8.3 | MongoDB ODM |
| JWT | 9.0.2 | Authentication |
| Bcrypt.js | 2.4.3 | Password Hashing |
| Helmet | 8.0.0 | Security Headers |
| Express Rate Limit | 7.4.1 | Rate Limiting |
| Nodemailer | 6.9.16 | Email Service |
| Multer | 1.4.5 | File Uploads |
| Validator | - | Input Validation |
| Slugify | - | URL Slug Generation |

---

## Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB connection configuration
│
├── middleware/
│   └── auth.js               # JWT authentication middleware
│
├── models/
│   ├── Admin.js              # Admin user schema
│   ├── Blog.js               # Blog post schema
│   ├── Contact.js            # Contact form schema
│   └── Service.js            # Service with sub-services schema
│
├── routes/
│   ├── admin.js              # Admin CRUD operations (protected)
│   ├── auth.js               # Authentication routes
│   ├── blogs.js              # Public blog routes
│   ├── contact.js            # Contact form submission
│   └── services.js           # Public service routes
│
├── scripts/
│   └── setupAdmin.js         # Interactive admin setup CLI
│
├── utils/
│   ├── email.js              # Email sending utilities
│   ├── seedAdmin.js          # Auto-create default admin
│   └── seedServices.js       # Seed default services data
│
├── .env                      # Environment variables (DO NOT COMMIT)
├── .env.example              # Environment template
├── package.json              # Dependencies & scripts
└── server.js                 # Application entry point
```

---

## Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Generate JWT secret: npm run generate:secret

# Start development server
npm run dev

# Start production server
npm start
```

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Environment
NODE_ENV=development          # development | production

# Server
PORT=5000                     # Server port

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ca_project

# JWT (Generate: npm run generate:secret)
JWT_SECRET=your_64_char_secret_key_here

# Admin Credentials (for initial setup)
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@asgupta.com
ADMIN_PASSWORD=YourSecurePassword123

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_gmail_app_password

# Admin notification email
ADMIN_NOTIFICATION_EMAIL=admin@asgupta.com

# CORS
FRONTEND_URL=http://localhost:5173
```

### Gmail SMTP Setup

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate a new app password for "Mail"
5. Use this password as `SMTP_PASS`

---

## API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Public Endpoints

#### Health Check
```http
GET /api/health

Response:
{
  "status": "OK",
  "message": "A S GUPTA AND CO API Server",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

#### Services
```http
GET /api/services              # Get all active services
GET /api/services/:slug        # Get service by slug (includes sub-services)

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "International Taxation",
    "slug": "international-taxation",
    "shortDescription": "...",
    "content": "<p>HTML content</p>",
    "icon": "Globe",
    "subServices": [...]
  }
}
```

#### Blogs
```http
GET /api/blogs                 # Get all published blogs
GET /api/blogs/:slug           # Get blog by slug (increments view count)
```

#### Contact
```http
POST /api/contact

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",    // optional
  "subject": "Tax Consultation",
  "message": "I need help with..."
}

Response:
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon!"
}
```

### Authentication Endpoints

#### Login
```http
POST /api/auth/login

Body:
{
  "email": "admin@asgupta.com",
  "password": "YourPassword123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "admin": {
    "id": "...",
    "email": "admin@asgupta.com",
    "name": "Admin"
  }
}
```

#### Verify Token
```http
GET /api/auth/verify
Header: Authorization: Bearer <token>

Response:
{
  "success": true,
  "admin": { "id", "email", "name" }
}
```

#### Change Password
```http
PUT /api/auth/change-password
Header: Authorization: Bearer <token>

Body:
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword456"
}
```

### Admin Endpoints (Protected)

All admin routes require: `Authorization: Bearer <token>`

#### Dashboard Stats
```http
GET /api/admin/stats

Response:
{
  "success": true,
  "data": {
    "servicesCount": 8,
    "blogsCount": 5,
    "contactsCount": 12,
    "unreadContacts": 3,
    "recentContacts": [...],
    "recentBlogs": [...]
  }
}
```

#### Services CRUD
```http
GET    /api/admin/services           # List all services
GET    /api/admin/services/:id       # Get service by ID
POST   /api/admin/services           # Create service (multipart/form-data)
PUT    /api/admin/services/:id       # Update service (multipart/form-data)
DELETE /api/admin/services/:id       # Delete service
```

**Service Create/Update Fields (FormData):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Service name |
| shortDescription | string | Yes | Brief description (max 300 chars) |
| content | string | No | Full HTML content |
| icon | string | No | Lucide icon name (default: 'FileText') |
| image | file | No | Image file (max 5MB) |
| isActive | boolean | No | Visibility status |
| order | number | No | Display order |
| subServices | JSON string | No | Array of sub-services |

**Sub-service Structure:**
```json
{
  "title": "Sub-service Name",
  "shortDescription": "Brief description",
  "content": "<p>HTML content</p>",
  "isActive": true,
  "order": 1
}
```

#### Blogs CRUD
```http
GET    /api/admin/blogs              # List all blogs
GET    /api/admin/blogs/:id          # Get blog by ID
POST   /api/admin/blogs              # Create blog (multipart/form-data)
PUT    /api/admin/blogs/:id          # Update blog (multipart/form-data)
DELETE /api/admin/blogs/:id          # Delete blog
```

**Blog Create/Update Fields (FormData):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Blog title |
| excerpt | string | Yes | Short excerpt |
| content | string | Yes | Full HTML content |
| author | string | Yes | Author name |
| category | string | No | Income Tax, GST, Company Law, Start Up, Others |
| image | file | No | Featured image (max 5MB) |
| isPublished | boolean | No | Publication status |

#### Contacts Management
```http
GET    /api/admin/contacts           # List all contact submissions
PUT    /api/admin/contacts/:id/read  # Mark as read
DELETE /api/admin/contacts/:id       # Delete contact
```

#### Seed Services
```http
POST /api/admin/seed-services        # Seed default services data
```

---

## Database Models

### Admin Schema
```javascript
{
  email: String,        // required, unique, lowercase
  password: String,     // required, min 6 chars, hashed
  name: String,         // default: 'Admin'
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Service Schema
```javascript
{
  title: String,              // required
  slug: String,               // auto-generated, unique
  shortDescription: String,   // required, max 300 chars
  content: String,            // HTML content
  icon: String,               // Lucide icon name, default: 'FileText'
  image: {
    data: String,             // Base64 encoded
    contentType: String       // MIME type
  },
  subServices: [{
    title: String,            // required
    slug: String,             // auto-generated
    shortDescription: String, // max 300 chars
    content: String,          // required, HTML
    isActive: Boolean,        // default: true
    order: Number
  }],
  isActive: Boolean,          // default: true
  order: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Blog Schema
```javascript
{
  title: String,        // required
  slug: String,         // auto-generated, unique
  excerpt: String,      // required
  content: String,      // required, HTML
  author: String,       // required
  category: String,     // enum: Income Tax, GST, Company Law, Start Up, Others
  image: {
    data: String,       // Base64 encoded
    contentType: String // MIME type
  },
  isPublished: Boolean, // default: true
  views: Number,        // default: 0
  createdAt: Date,
  updatedAt: Date
}
```

### Contact Schema
```javascript
{
  name: String,         // required, max 100 chars
  email: String,        // required, validated
  phone: String,        // max 20 chars
  subject: String,      // required, max 200 chars
  message: String,      // required, max 5000 chars
  isRead: Boolean,      // default: false
  isReplied: Boolean,   // default: false
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authentication

### JWT Token
- Token expires in **7 days**
- Include in Authorization header: `Bearer <token>`
- Stored in client localStorage as `adminToken`
- Token payload contains: `{ id: admin._id }`

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with salt rounds (10) |
| JWT Authentication | Secure token-based auth |
| Rate Limiting | 100 requests/15min (API), 5/15min (login) |
| Security Headers | Helmet middleware |
| CORS | Configured origin restriction |
| Input Validation | Mongoose validators + validator.js |
| File Upload | 5MB limit, images only |
| Error Handling | Sanitized error messages in production |
| XSS Protection | Helmet's xssFilter |
| NoSQL Injection | Mongoose schema validation |

---

## Scripts

```bash
# Development
npm run dev              # Start with nodemon (auto-reload)

# Production
npm start                # Start production server

# Admin Setup
npm run setup:admin      # Interactive admin creation CLI

# Database
npm run seed:services    # Seed services with default data

# Utilities
npm run generate:secret  # Generate secure JWT secret (64 chars)
```

---

## File Descriptions

### `/config/db.js`
MongoDB connection using Mongoose. Handles connection events and errors. Exports async function that connects to `MONGODB_URI`.

### `/middleware/auth.js`
JWT verification middleware (`protect`). Extracts token from Bearer header, verifies with JWT_SECRET, attaches admin to `req.admin`.

### `/models/Admin.js`
Admin user model with:
- Pre-save hook for password hashing (bcrypt)
- `comparePassword(candidatePassword)` method for login verification

### `/models/Service.js`
Service model with nested subServices schema. Features:
- Auto-generates slugs using slugify on title change
- Generates slugs for sub-services in pre-save hook

### `/models/Blog.js`
Blog post model with:
- Category enum validation
- Auto-slug generation
- View counter

### `/models/Contact.js`
Contact form submissions with:
- Email validation using validator.js
- Field length limits for security
- Read/replied status tracking

### `/routes/admin.js`
Protected admin routes for CRUD operations:
- Services management with image upload
- Blogs management with image upload
- Contacts management
- Dashboard statistics
- Multer configured for memory storage

### `/routes/auth.js`
Authentication routes:
- Login with rate limiting
- Token verification
- Password change with strength validation

### `/routes/services.js`
Public routes to fetch active services by list or slug.

### `/routes/blogs.js`
Public routes to fetch published blogs. Increments view count on individual fetch.

### `/routes/contact.js`
Public contact form submission. Sends:
- Confirmation email to user
- Notification email to admin

### `/utils/email.js`
Nodemailer configuration for SMTP. Functions:
- `sendUserConfirmationEmail(email, name, subject)`
- `sendAdminNotificationEmail({ name, email, phone, subject, message })`

### `/utils/seedAdmin.js`
`createDefaultAdmin()` - Creates admin from env variables on server start if none exists.

### `/utils/seedServices.js`
`seedServices()` - Populates database with predefined CA services including:
- International Taxation (4 sub-services)
- GST (5 sub-services)
- Business Registrations (2 sub-services)
- Audit & Assurance (5 sub-services)
- Accounting & Bookkeeping
- Tax Consultancy
- Company Secretarial Services
- Advisory Services

### `/scripts/setupAdmin.js`
Interactive CLI script using readline for creating/resetting admin credentials with password validation.

### `/server.js`
Main application entry point:
- Loads environment variables
- Connects to MongoDB
- Configures security middleware (helmet, rate limit, cors)
- Mounts routes
- Error handling middleware
- Starts server and creates default admin

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized / Invalid Token |
| 404 | Not Found |
| 429 | Too Many Requests (Rate Limited) |
| 500 | Server Error |

---

## Troubleshooting

### MongoDB Connection Failed
- Verify MongoDB is running
- Check `MONGODB_URI` format
- Whitelist IP in MongoDB Atlas

### JWT Token Invalid
- Check `JWT_SECRET` is set
- Token may have expired (7 days)
- Clear localStorage and re-login

### Email Not Sending
- Enable 2FA on Gmail
- Create App Password (not regular password)
- Verify SMTP credentials

### Rate Limit Errors
- Wait 15 minutes for limit reset
- Check if behind proxy (may need trust proxy setting)

---

## License

Private - A S GUPTA AND CO
#   C A - w e b s i t e - A n s h - G u p t a - b a c k e n d  
 