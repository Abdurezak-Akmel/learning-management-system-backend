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

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware
app.use(cors());
app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    return next(); // skip JSON parser
  }
  express.json()(req, res, next);
});

// Routes
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
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@tms.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
    const adminRoleId = Number(process.env.ADMIN_ROLE_ID) || 1;

    // Check if any admin exists (adjust query based on your schema)
    const { rows } = await pool.query('SELECT * FROM "User" WHERE email = $1', [adminEmail]);

    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO "User" (name, email, password_hash, role_id, status, email_verified, registration_device) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        ['System Admin', adminEmail, hashedPassword, adminRoleId, 'active', true, 'Admin Device']
      );
      console.log(`Admin user seeded: ${adminEmail}`);
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// If this file is run directly, start the server.
if (process.argv[1] === __filename) {
  app.listen(PORT, async () => {
    console.log(`Server listening on port ${PORT}`);

    // Run the seed function on startup
    await seedAdmin();
  });
}

export default app;