import { Router } from 'express';
import {
    getEmployeeAllocations,
    getAllocationById,
    getActiveEmployeeAllocations,
    createAllocation,
    getAllPendingRequests,
    getAllProcessedRequests,
    approveAllocation,
    rejectAllocation,
} from '../controllers/allocationController';

const router = Router();

// Allocation routes
router.post('/', createAllocation);
router.get('/pending', getAllPendingRequests);
router.get('/processed', getAllProcessedRequests);
router.put('/:id/approve', approveAllocation);
router.put('/:id/reject', rejectAllocation);
router.get('/employee/:employeeId', getEmployeeAllocations);
router.get('/employee/:employeeId/active', getActiveEmployeeAllocations);
router.get('/:id', getAllocationById);

export default router;
