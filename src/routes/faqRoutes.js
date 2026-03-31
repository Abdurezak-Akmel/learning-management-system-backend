import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/adminMiddleware.js';
import {
    createFAQController,
    getAllFAQsController,
    getFAQByIdController,
    updateFAQController,
    deleteFAQController
} from '../controllers/faqControllers.js';

const router = express.Router();

// User: create faq
router.post('/create-faq', authenticate, createFAQController);
// Tested and Working

// User: get faq by ID
router.get('/get-faq/:id', authenticate, getFAQByIdController);

// User: update faq
router.put('/update-faq/:id', authenticate, requireAdmin, updateFAQController);

// User: delete faq
router.delete('/delete-faq/:id', authenticate, requireAdmin, deleteFAQController);
// Tested and Working

// Public: get all courses
router.get('/get-all-faq', getAllFAQsController);

export default router;