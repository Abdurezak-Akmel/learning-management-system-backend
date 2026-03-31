import {
    createFAQ,
    getFAQById,
    getAllFAQs,
    updateFAQById,
    deleteFAQById
} from '../models/faqModel.js';

/**
 * Controller: create a new FAQ
 */
export async function createFAQController(req, res) {
    try {
        const { question, answer } = req.body || {};

        if (!question || question.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Question is required'
            });
        }

        if (!answer || answer.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Answer is required'
            });
        }

        const faqData = {
            question: question.trim(),
            answer: answer.trim()
        };

        const newFAQ = await createFAQ(faqData);

        return res.status(201).json({
            success: true,
            message: 'FAQ created successfully',
            faq: newFAQ
        });
    } catch (err) {
        console.error('createFAQController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Public controller: get all FAQs
 */
export async function getAllFAQsController(req, res) {
    try {
        const faqs = await getAllFAQs();
        return res.json({ success: true, faqs });
    } catch (err) {
        console.error('getAllFAQsController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Controller: get FAQ by ID
 */
export async function getFAQByIdController(req, res) {
    try {
        const faqId = Number(req.params.id);
        if (!Number.isInteger(faqId) || faqId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid FAQ ID'
            });
        }

        const faq = await getFAQById(faqId);
        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        return res.json({ success: true, faq });
    } catch (err) {
        console.error('getFAQByIdController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Admin controller: update FAQ
 */
export async function updateFAQController(req, res) {
    try {
        const faqId = Number(req.params.id);
        if (!Number.isInteger(faqId) || faqId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid FAQ ID'
            });
        }

        const updates = req.body || {};
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one field must be provided for update'
            });
        }

        // Validate allowed fields
        const allowedFields = ['question', 'answer'];
        const invalidFields = Object.keys(updates).filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid fields: ${invalidFields.join(', ')}. Allowed fields: ${allowedFields.join(', ')}`
            });
        }

        // Trim string fields
        const stringFields = ['question', 'answer'];
        stringFields.forEach(field => {
            if (updates[field] !== undefined) {
                updates[field] = updates[field] ? updates[field].trim() : null;
            }
        });

        const updatedFAQ = await updateFAQById(faqId, updates);
        if (!updatedFAQ) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        return res.json({
            success: true,
            message: 'FAQ updated successfully',
            faq: updatedFAQ
        });
    } catch (err) {
        console.error('updateFAQController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

/**
 * Admin controller: delete FAQ
 */
export async function deleteFAQController(req, res) {
    try {
        const faqId = Number(req.params.id);
        if (!Number.isInteger(faqId) || faqId <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid FAQ ID'
            });
        }

        const deleted = await deleteFAQById(faqId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        return res.json({
            success: true,
            message: 'FAQ deleted successfully'
        });
    } catch (err) {
        console.error('deleteFAQController error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: err.message
        });
    }
}

export default {
    createFAQController,
    getAllFAQsController,
    getFAQByIdController,
    updateFAQController,
    deleteFAQController
};
