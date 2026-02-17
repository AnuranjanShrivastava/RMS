import { Request, Response } from 'express';
import { allocations } from '../data/allocationsData';
import { aiTools } from '../data/aiToolsData';
import type { Allocation } from '../types/allocation';

// Get all allocations for an employee
export const getEmployeeAllocations = (req: Request, res: Response): void => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: 'Employee ID is required',
            });
            return;
        }

        const employeeAllocations = allocations.filter(
            (allocation) => allocation.employeeId === employeeId
        );

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
export const getAllocationById = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const allocation = allocations.find((a) => a.id === id);

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
export const getActiveEmployeeAllocations = (req: Request, res: Response): void => {
    try {
        const { employeeId } = req.params;

        if (!employeeId) {
            res.status(400).json({
                success: false,
                message: 'Employee ID is required',
            });
            return;
        }

        const activeAllocations = allocations.filter(
            (allocation) => allocation.employeeId === employeeId && allocation.status === 'approved'
        );

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
export const createAllocation = (req: Request, res: Response): void => {
    try {
        const { employeeName, employeeEmail, employeeDepartment, aiToolId, startDate, endDate, notes } = req.body;

        // Validate required fields
        if (!employeeName || !employeeEmail || !employeeDepartment || !aiToolId || !startDate || !endDate) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: employeeName, employeeEmail, employeeDepartment, aiToolId, startDate, and endDate are required',
            });
            return;
        }

        // Find the AI tool to get its name and price
        const aiTool = aiTools.find((tool) => tool.id === aiToolId);
        if (!aiTool) {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }

        // Create new allocation
        const newAllocation: Allocation = {
            id: Date.now().toString(),
            employeeId: '1', // Associate with employee ID 1
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
        };

        // Add to allocations array
        allocations.push(newAllocation);

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
