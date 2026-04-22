import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import pool from './config/db.js';

import accessRequestRoutes from './routes/accessRequestRoutes.js';
import authRoutes from './routes/authRoutes.js';
import courseMaterialRoutes from './routes/courseMaterialRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import landingVideoRoutes from './routes/landingVideoRoutes.js'
import receiptRoutes from './routes/receiptRoutes.js';
import roleCourseRoutes from './routes/roleCourseRoutes.js';
import roleRoutes from './routes/roleRoutes.js';
import userRoutes from './routes/userRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import faqRoutes from './routes/faqRoutes.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next();
  }
  express.json()(req, res, next);
});

// 1. Serve static files from your uploads directory
// Adjust the path if 'uploads' is at the root of your project
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// 2. Serve the React static files (Assuming your build is in a 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/access-requests', accessRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/landing-videos', landingVideoRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/role-course', roleCourseRoutes);
app.use('/api/course-materials', courseMaterialRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);

/**
 * Seeding Logic: Creates a default admin if none exists
 */
const seedAdmin = async () => {
  console.log('Starting admin seeding check...');
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminRoleId = Number(process.env.ADMIN_ROLE_ID) || 1;

    if (!adminEmail || !adminPassword) {
      console.log('Skipping seed: ADMIN_EMAIL or ADMIN_PASSWORD not set.');
      return;
    }

    const { rows } = await pool.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO "User" (name, email, password_hash, role_id, status, email_verified, device_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['System Admin', adminEmail, hashedPassword, adminRoleId, 'active', true, 'Admin Device']
      );
      console.log(`Admin user seeded: ${adminEmail}`);
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// 3. SPA Routing: Handle React routing (MUST be after API routes)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server and seed
app.listen(PORT, async () => {
  console.log(`Server listening on port ${PORT}`);
  await seedAdmin();
});

export default app;