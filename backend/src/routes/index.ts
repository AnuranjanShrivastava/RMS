import { Router } from 'express';
import aiToolRoutes from './aiToolRoutes';
import allocationRoutes from './allocationRoutes';

const router = Router();

// API routes
router.use('/ai-tools', aiToolRoutes);
router.use('/allocations', allocationRoutes);

export default router;
