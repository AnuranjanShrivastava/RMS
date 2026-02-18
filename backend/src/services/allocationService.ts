import pool from '../config/database';
import type { Allocation } from '../types/allocation';
import type { RowDataPacket } from 'mysql2';

export const allocationService = {
    // Get all allocations for an employee
    getByEmployeeId: async (employeeId: string): Promise<Allocation[]> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id, employee_id as employeeId, employee_name as employeeName,
        employee_email as employeeEmail, employee_department as employeeDepartment,
        ai_tool_id as aiToolId, ai_tool_name as aiToolName,
        monthly_price as monthlyPrice, start_date as startDate,
        end_date as endDate, notes, status, rejection_reason as rejectionReason
      FROM allocations 
      WHERE employee_id = ? 
      ORDER BY created_at DESC`,
            [employeeId]
        );
        return rows as Allocation[];
    },

    // Get allocation by ID
    getById: async (id: string): Promise<Allocation | null> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id, employee_id as employeeId, employee_name as employeeName,
        employee_email as employeeEmail, employee_department as employeeDepartment,
        ai_tool_id as aiToolId, ai_tool_name as aiToolName,
        monthly_price as monthlyPrice, start_date as startDate,
        end_date as endDate, notes, status, rejection_reason as rejectionReason
      FROM allocations 
      WHERE id = ?`,
            [id]
        );
        return (rows[0] as Allocation) || null;
    },

    // Get all pending approval requests
    getPendingRequests: async (): Promise<Allocation[]> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id, employee_id as employeeId, employee_name as employeeName,
        employee_email as employeeEmail, employee_department as employeeDepartment,
        ai_tool_id as aiToolId, ai_tool_name as aiToolName,
        monthly_price as monthlyPrice, start_date as startDate,
        end_date as endDate, notes, status, rejection_reason as rejectionReason
      FROM allocations 
      WHERE status = 'pending_approval'
      ORDER BY created_at DESC`
        );
        return rows as Allocation[];
    },

    // Get all processed requests (approved + rejected)
    getProcessedRequests: async (): Promise<Allocation[]> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id, employee_id as employeeId, employee_name as employeeName,
        employee_email as employeeEmail, employee_department as employeeDepartment,
        ai_tool_id as aiToolId, ai_tool_name as aiToolName,
        monthly_price as monthlyPrice, start_date as startDate,
        end_date as endDate, notes, status, rejection_reason as rejectionReason
      FROM allocations 
      WHERE status IN ('approved', 'rejected')
      ORDER BY created_at DESC`
        );
        return rows as Allocation[];
    },

    // Get active allocations for an employee
    getActiveByEmployeeId: async (employeeId: string): Promise<Allocation[]> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
        id, employee_id as employeeId, employee_name as employeeName,
        employee_email as employeeEmail, employee_department as employeeDepartment,
        ai_tool_id as aiToolId, ai_tool_name as aiToolName,
        monthly_price as monthlyPrice, start_date as startDate,
        end_date as endDate, notes, status, rejection_reason as rejectionReason
      FROM allocations 
      WHERE employee_id = ? AND status = 'approved'
      ORDER BY created_at DESC`,
            [employeeId]
        );
        return rows as Allocation[];
    },

    // Create new allocation
    create: async (allocation: Omit<Allocation, 'id'>): Promise<Allocation> => {
        const id = Date.now().toString();
        await pool.execute(
            `INSERT INTO allocations (
        id, employee_id, employee_name, employee_email, employee_department,
        ai_tool_id, ai_tool_name, monthly_price, start_date, end_date,
        notes, status, rejection_reason
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                id,
                allocation.employeeId,
                allocation.employeeName,
                allocation.employeeEmail,
                allocation.employeeDepartment,
                allocation.aiToolId,
                allocation.aiToolName,
                allocation.monthlyPrice,
                allocation.startDate,
                allocation.endDate,
                allocation.notes || null,
                allocation.status,
                allocation.rejectionReason || null,
            ]
        );
        return { id, ...allocation };
    },

    // Approve allocation
    approve: async (id: string): Promise<Allocation> => {
        await pool.execute(
            `UPDATE allocations 
       SET status = 'approved', rejection_reason = NULL 
       WHERE id = ? AND status = 'pending_approval'`,
            [id]
        );
        const updated = await allocationService.getById(id);
        if (!updated) throw new Error('Allocation not found');
        if (updated.status !== 'approved') {
            throw new Error('Only pending_approval requests can be approved');
        }
        return updated;
    },

    // Reject allocation
    reject: async (id: string, rejectionReason: string): Promise<Allocation> => {
        await pool.execute(
            `UPDATE allocations 
       SET status = 'rejected', rejection_reason = ? 
       WHERE id = ? AND status = 'pending_approval'`,
            [rejectionReason, id]
        );
        const updated = await allocationService.getById(id);
        if (!updated) throw new Error('Allocation not found');
        if (updated.status !== 'rejected') {
            throw new Error('Only pending_approval requests can be rejected');
        }
        return updated;
    },
};
