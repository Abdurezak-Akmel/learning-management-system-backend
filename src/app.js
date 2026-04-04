import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';

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

// Basic health route
// app.get('/', (req, res) => {
//   res.json({ status: 'ok', message: 'TMS backend running' });
// });


// Access request routes
app.use('/api/access-requests', accessRequestRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Course Routes
app.use('/api/courses', courseRoutes);

// Course Routes
app.use('/api/faqs', faqRoutes);

// Landing Video Routes
app.use('/api/landing-videos', landingVideoRoutes);

// Project Routes
app.use('/api/projects', projectRoutes);

// Receipt routes
app.use('/api/receipts', receiptRoutes);

// Role-Course routes
app.use('/api/role-course', roleCourseRoutes);

// Course Material routes
app.use('/api/course-materials', courseMaterialRoutes);

// Role routes
app.use('/api/roles', roleRoutes);

// User routes (includes admin endpoints)
app.use('/api/users', userRoutes);

// Video routes
app.use('/api/videos', videoRoutes);

// If this file is run directly, start the server. When required (for tests), only export the app.
if (process.argv[1] === __filename) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
