import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createReceipt, getReceiptsByUserId, getAllReceipts, getReceiptById as getReceiptByIdModel, deleteReceiptById } from '../models/receiptModel.js';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `receipt-${req.user.user_id}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only PDF files
  const allowedTypes = /pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1 * 1024 * 1024 // 1MB limit
  },
  fileFilter: fileFilter
});

/**
 * Upload a receipt file
 */
export async function uploadReceipt(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const receiptData = {
      user_id: req.user.user_id,
      file_path: req.file.filename,
      file_size: req.file.size,
      status: 'pending'
    };

    const receipt = await createReceipt(receiptData);

    res.status(201).json({
      success: true,
      message: 'Receipt uploaded successfully',
      data: {
        receipt_id: receipt.receipt_id,
        file_path: receipt.file_path,
        upload_date: receipt.upload_date,
        status: receipt.status,
        file_size: receipt.file_size
      }
    });
  } catch (error) {
    console.error('Error uploading receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading receipt',
      error: error.message
    });
  }
}

/**
 * Get all receipts for the authenticated user
 */
export async function getUserReceipts(req, res) {
  try {
    const receipts = await getReceiptsByUserId(req.user.user_id);

    res.status(200).json({
      success: true,
      data: receipts
    });
  } catch (error) {
    console.error('Error fetching user receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipts',
      error: error.message
    });
  }
}

/**
 * Get all receipts (Admin only)
 */
export async function fetchAllReceipts(req, res) {
  try {
    const receipts = await getAllReceipts();

    res.status(200).json({
      success: true,
      receipts: receipts,
      count: receipts.length
    });
  } catch (error) {
    console.error('Error fetching all receipts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching all receipts',
      error: error.message
    });
  }
}

/**
 * Get a single receipt by ID
 */
export async function getReceiptById(req, res) {
  try {
    const { id } = req.params;
    const receipt = await getReceiptByIdModel(id);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // Check if the user is an admin or the owner of the receipt
    if (req.user.user_role !== 'admin' && receipt.user_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this receipt'
      });
    }

    res.status(200).json({
      success: true,
      data: receipt
    });
  } catch (error) {
    console.error('Error fetching receipt by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching receipt',
      error: error.message
    });
  }
}

/**
 * Delete a receipt by ID (Admin only)
 */
export async function deleteReceiptByIdController(req, res) {
  try {
    const { id } = req.params;
    
    // 1. Get receipt details to find the file path
    const receipt = await getReceiptByIdModel(id);
    
    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: 'Receipt not found'
      });
    }

    // 2. Delete the physical file
    if (receipt.file_path) {
      const filePath = path.join('uploads', 'receipts', receipt.file_path);
      try {
        await fs.promises.unlink(filePath);
      } catch (err) {
        console.error(`Failed to delete file at ${filePath}:`, err);
        // Continue even if file delete fails (maybe file already gone)
      }
    }

    // 3. Delete the database record
    await deleteReceiptById(id);

    res.status(200).json({
      success: true,
      message: 'Receipt deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting receipt',
      error: error.message
    });
  }
}

export default {
  upload,
  uploadReceipt,
  getUserReceipts,
  fetchAllReceipts,
  getReceiptById,
  deleteReceiptByIdController
};