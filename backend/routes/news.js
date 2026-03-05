import express from 'express';
import {
  getAllNews,
  getAllNewsAdmin,
  getNewsBySlug,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  togglePublishStatus,
  toggleFeaturedStatus,
  getNewsStats
} from '../controllers/newsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllNews);
router.get('/slug/:slug', getNewsBySlug);

// Admin routes (protected)
router.get('/admin/all', authenticateToken, getAllNewsAdmin);
router.get('/admin/stats', authenticateToken, getNewsStats);
router.get('/admin/:id', authenticateToken, getNewsById);
router.post('/admin', authenticateToken, createNews);
router.put('/admin/:id', authenticateToken, updateNews);
router.delete('/admin/:id', authenticateToken, deleteNews);
router.patch('/admin/:id/toggle-publish', authenticateToken, togglePublishStatus);
router.patch('/admin/:id/toggle-featured', authenticateToken, toggleFeaturedStatus);

export default router;
