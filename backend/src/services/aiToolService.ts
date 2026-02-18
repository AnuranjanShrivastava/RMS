import pool from '../config/database';
import type { AITool } from '../types/aiTool';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

export const aiToolService = {
    // Get all AI tools
    getAll: async (): Promise<AITool[]> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, monthly_price as monthlyPrice FROM ai_tools ORDER BY created_at DESC'
        );
        return rows as AITool[];
    },

    // Get AI tool by ID
    getById: async (id: string): Promise<AITool | null> => {
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name, monthly_price as monthlyPrice FROM ai_tools WHERE id = ?',
            [id]
        );
        return (rows[0] as AITool) || null;
    },

    // Create new AI tool
    create: async (tool: Omit<AITool, 'id'>): Promise<AITool> => {
        const id = Date.now().toString();
        await pool.execute(
            'INSERT INTO ai_tools (id, name, monthly_price) VALUES (?, ?, ?)',
            [id, tool.name, tool.monthlyPrice]
        );
        return { id, ...tool };
    },

    // Update AI tool
    update: async (id: string, tool: Partial<Omit<AITool, 'id'>>): Promise<AITool> => {
        const updates: string[] = [];
        const values: any[] = [];

        if (tool.name) {
            updates.push('name = ?');
            values.push(tool.name);
        }
        if (tool.monthlyPrice) {
            updates.push('monthly_price = ?');
            values.push(tool.monthlyPrice);
        }

        if (updates.length === 0) {
            const existing = await aiToolService.getById(id);
            if (!existing) throw new Error('AI tool not found');
            return existing;
        }

        values.push(id);
        await pool.execute(
            `UPDATE ai_tools SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const updated = await aiToolService.getById(id);
        if (!updated) throw new Error('AI tool not found');
        return updated;
    },

    // Delete AI tool
    delete: async (id: string): Promise<void> => {
        const [result] = await pool.execute<ResultSetHeader>('DELETE FROM ai_tools WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            throw new Error('AI tool not found');
        }
    },
};
