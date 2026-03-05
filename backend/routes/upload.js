import express from 'express';
import multer from 'multer';
import { uploadFile, deleteFile } from '../controllers/uploadController.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit (increased for PDFs and large images)
  },
  fileFilter: (req, file, cb) => {
    // Accept images and PDFs
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) and PDF files are allowed!'), false);
    }
  }
});

router.post('/', upload.single('file'), uploadFile);
router.delete('/', deleteFile);

export default router;
