import express from 'express';
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  toggleFeaturedStatus
} from '../controllers/projectsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', authenticateToken, createProject);
router.put('/:id', authenticateToken, updateProject);
router.delete('/:id', authenticateToken, deleteProject);
router.patch('/:id/toggle-featured', authenticateToken, toggleFeaturedStatus);

export default router;
