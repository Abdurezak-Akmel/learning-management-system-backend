import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Basic health route
// app.get('/', (req, res) => {
//   res.json({ status: 'ok', message: 'TMS backend running' });
// });


// Auth routes
app.use('/api/auth', authRoutes);

// User routes (includes admin endpoints)
app.use('/api/users', userRoutes);


// If this file is run directly, start the server. When required (for tests), only export the app.
if (process.argv[1] === __filename) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
