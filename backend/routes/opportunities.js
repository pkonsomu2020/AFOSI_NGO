import express from 'express';
import {
  getAllOpportunities,
  getOpportunityById,
  getOpportunityBySlug,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  toggleOpportunityStatus
} from '../controllers/opportunitiesController.js';

const router = express.Router();

router.get('/', getAllOpportunities);
router.get('/slug/:slug', getOpportunityBySlug);
router.get('/:id', getOpportunityById);
router.post('/', createOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);
router.patch('/:id/toggle', toggleOpportunityStatus);

export default router;
