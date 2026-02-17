import { Request, Response } from 'express';
import { aiTools } from '../data/aiToolsData';

// Get all AI tools
export const getAllAITools = (req: Request, res: Response): void => {
    try {
        res.json({
            success: true,
            data: aiTools,
            message: 'AI tools fetched successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching AI tools',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Get single AI tool by ID
export const getAIToolById = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const tool = aiTools.find((t) => t.id === id);

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
export const createAITool = (req: Request, res: Response): void => {
    try {
        const { name, monthlyPrice } = req.body;

        if (!name || !monthlyPrice) {
            res.status(400).json({
                success: false,
                message: 'Name and monthly price are required',
            });
            return;
        }

        const newTool: AITool = {
            id: Date.now().toString(),
            name: name.trim(),
            monthlyPrice: monthlyPrice.trim(),
        };

        aiTools.push(newTool);

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
export const updateAITool = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const { name, monthlyPrice } = req.body;

        const toolIndex = aiTools.findIndex((t) => t.id === id);

        if (toolIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }

        if (name) aiTools[toolIndex].name = name.trim();
        if (monthlyPrice) aiTools[toolIndex].monthlyPrice = monthlyPrice.trim();

        res.json({
            success: true,
            data: aiTools[toolIndex],
            message: 'AI tool updated successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

// Delete AI tool
export const deleteAITool = (req: Request, res: Response): void => {
    try {
        const { id } = req.params;
        const toolIndex = aiTools.findIndex((t) => t.id === id);

        if (toolIndex === -1) {
            res.status(404).json({
                success: false,
                message: 'AI tool not found',
            });
            return;
        }

        const deletedTool = aiTools.splice(toolIndex, 1)[0];

        res.json({
            success: true,
            data: deletedTool,
            message: 'AI tool deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting AI tool',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
