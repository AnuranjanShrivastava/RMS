import { Router } from 'express';
import {
    getEmployeeAllocations,
    getAllocationById,
    getActiveEmployeeAllocations,
    createAllocation,
} from '../controllers/allocationController';

const router = Router();

// Allocation routes
router.post('/', createAllocation);
router.get('/employee/:employeeId', getEmployeeAllocations);
router.get('/employee/:employeeId/active', getActiveEmployeeAllocations);
router.get('/:id', getAllocationById);

export default router;
