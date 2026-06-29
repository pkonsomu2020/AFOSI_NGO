import express from 'express';
import multer from 'multer';
import { submitApplication } from '../controllers/applyController.js';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

// Configure multer for document uploads on the apply route
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/jpg', 'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, Word, and image files are allowed.'), false);
    }
  }
});

// POST /api/apply — submit form data + send email via Resend
router.post('/', submitApplication);

// POST /api/apply/upload — upload a single file to Supabase and return public URL
router.post('/upload', upload.single('file'), uploadFile);

export default router;
