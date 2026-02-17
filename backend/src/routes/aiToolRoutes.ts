import { Router } from 'express';
import {
    getAllAITools,
    getAIToolById,
    createAITool,
    updateAITool,
    deleteAITool,
} from '../controllers/aiToolController';

const router = Router();

// AI Tools routes
router.get('/', getAllAITools);
router.get('/:id', getAIToolById);
router.post('/', createAITool);
router.put('/:id', updateAITool);
router.delete('/:id', deleteAITool);

export default router;
