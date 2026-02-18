import { Request, Response } from 'express';
import { aiToolService } from '../services/aiToolService';

// Get all AI tools
export const getAllAITools = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("Fetching tools");
        const tools = await aiToolService.getAll();
        console.log(tools);
        res.json({
            success: true,
            data: tools,
            message: 'AI tools fetched successfully',
        });
    } catch (error) {
        console.error('Error fetching AI tools:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching AI tools',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get single AI tool by ID
export const getAIToolById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const tool = await aiToolService.getById(id);

        if (!tool) {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }

        res.json({
            success: true,
            data: tool,
            message: 'AI tool fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Create new AI tool
export const createAITool = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, monthlyPrice } = req.body;

        if (!name || !monthlyPrice) {
            res.status(400).json({
                success: false,
                message: 'Name and monthly price are required',
            });
            return;
        }

        const newTool = await aiToolService.create({
            name: name.trim(),
            monthlyPrice: monthlyPrice.trim(),
        });

        res.status(201).json({
            success: true,
            data: newTool,
            message: 'AI tool created successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Update AI tool
export const updateAITool = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, monthlyPrice } = req.body;

        const updateData: { name?: string; monthlyPrice?: string } = {};
        if (name) updateData.name = name.trim();
        if (monthlyPrice) updateData.monthlyPrice = monthlyPrice.trim();

        const updatedTool = await aiToolService.update(id, updateData);

        res.json({
            success: true,
            data: updatedTool,
            message: 'AI tool updated successfully',
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'AI tool not found') {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error updating AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Delete AI tool
export const deleteAITool = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await aiToolService.delete(id);

        res.json({
            success: true,
            message: 'AI tool deleted successfully',
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'AI tool not found') {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Error deleting AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
