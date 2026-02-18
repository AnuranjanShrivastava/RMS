import { Request, Response } from 'express';
import { allocationService } from '../services/allocationService';
import { aiToolService } from '../services/aiToolService';

// Get all allocations for an employee
export const getEmployeeAllocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: 'Employee ID is required',
            });
            return;
        }

        const employeeAllocations = await allocationService.getByEmployeeId(employeeId);

        res.json({
            success: true,
            data: employeeAllocations,
            message: 'Employee allocations fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employee allocations',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get single allocation by ID
export const getAllocationById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const allocation = await allocationService.getById(id);

        if (!allocation) {
            res.status(404).json({
                success: false,
                message: 'Allocation not found',
            });
            return;
        }

        res.json({
            success: true,
            data: allocation,
            message: 'Allocation fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching allocation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get active allocations for an employee
export const getActiveEmployeeAllocations = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: 'Employee ID is required',
            });
            return;
        }

        const activeAllocations = await allocationService.getActiveByEmployeeId(employeeId);

        res.json({
            success: true,
            data: activeAllocations,
            message: 'Active employee allocations fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching active employee allocations',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Create new allocation request
export const createAllocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { employeeId, employeeName, employeeEmail, employeeDepartment, aiToolId, startDate, endDate, notes } = req.body;

        // Validate required fields
        if (!employeeId || !employeeName || !employeeEmail || !employeeDepartment || !aiToolId || !startDate || !endDate) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: employeeId, employeeName, employeeEmail, employeeDepartment, aiToolId, startDate, and endDate are required',
            });
            return;
        }

        // Find the AI tool to get its name and price
        const aiTool = await aiToolService.getById(aiToolId);
        if (!aiTool) {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }

        // Create new allocation
        const newAllocation = await allocationService.create({
            employeeId: employeeId.trim(),
            employeeName: employeeName.trim(),
            employeeEmail: employeeEmail.trim(),
            employeeDepartment: employeeDepartment.trim(),
            aiToolId: aiToolId,
            aiToolName: aiTool.name,
            monthlyPrice: aiTool.monthlyPrice,
            startDate: startDate,
            endDate: endDate,
            notes: notes ? notes.trim() : undefined,
            status: 'pending_approval', // Set status as pending_approval initially
        });

        res.status(201).json({
            success: true,
            data: newAllocation,
            message: 'Allocation request created successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating allocation request',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get all pending approval requests (for admin)
export const getAllPendingRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const pendingRequests = await allocationService.getPendingRequests();

        res.json({
            success: true,
            data: pendingRequests,
            message: 'Pending requests fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching pending requests',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get all processed requests (approved + rejected) (for admin)
export const getAllProcessedRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const processedRequests = await allocationService.getProcessedRequests();

        res.json({
            success: true,
            data: processedRequests,
            message: 'Processed requests fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching processed requests',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Approve allocation request
export const approveAllocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const approvedAllocation = await allocationService.approve(id);

        res.json({
            success: true,
            data: approvedAllocation,
            message: 'Allocation approved successfully',
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Allocation not found') {
                res.status(404).json({
                    success: false,
                    message: 'Allocation not found',
                });
                return;
            }
            if (error.message === 'Only pending_approval requests can be approved') {
                res.status(400).json({
                    success: false,
                    message: 'Only pending_approval requests can be approved',
                });
                return;
            }
        }
        res.status(500).json({
            success: false,
            message: 'Error approving allocation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Reject allocation request
export const rejectAllocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        if (!rejectionReason || rejectionReason.trim() === '') {
            res.status(400).json({
                success: false,
                message: 'Rejection reason is required',
            });
            return;
        }

        const rejectedAllocation = await allocationService.reject(id, rejectionReason);

        res.json({
            success: true,
            data: rejectedAllocation,
            message: 'Allocation rejected successfully',
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Allocation not found') {
                res.status(404).json({
                    success: false,
                    message: 'Allocation not found',
                });
                return;
            }
            if (error.message === 'Only pending_approval requests can be rejected') {
                res.status(400).json({
                    success: false,
                    message: 'Only pending_approval requests can be rejected',
                });
                return;
            }
        }
        res.status(500).json({
            success: false,
            message: 'Error rejecting allocation',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
