import multer from 'multer';
import path from 'path';
import { createReceipt, getReceiptsByUserId, getAllReceipts } from '../models/receiptModel.js';

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
  // Accept only image files and PDFs
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF) and PDFs are allowed'));
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
        status: receipt.status
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

export default {
  upload,
  uploadReceipt,
  getUserReceipts,
  fetchAllReceipts
};