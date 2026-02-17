const API_BASE_URL = 'http://localhost:5000/api';

export interface AITool {
    id: string;
    name: string;
    monthlyPrice: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
}

// AI Tools API
export const aiToolsApi = {
    getAll: async (): Promise<AITool[]> => {
        const response = await fetch(`${API_BASE_URL}/ai-tools`);
        const result: ApiResponse<AITool[]> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch AI tools');
        }
        return result.data;
    },

    getById: async (id: string): Promise<AITool> => {
        const response = await fetch(`${API_BASE_URL}/ai-tools/${id}`);
        const result: ApiResponse<AITool> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch AI tool');
        }
        return result.data;
    },

    create: async (tool: Omit<AITool, 'id'>): Promise<AITool> => {
        const response = await fetch(`${API_BASE_URL}/ai-tools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tool),
        });
        const result: ApiResponse<AITool> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to create AI tool');
        }
        return result.data;
    },

    update: async (id: string, tool: Partial<Omit<AITool, 'id'>>): Promise<AITool> => {
        const response = await fetch(`${API_BASE_URL}/ai-tools/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tool),
        });
        const result: ApiResponse<AITool> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to update AI tool');
        }
        return result.data;
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/ai-tools/${id}`, {
            method: 'DELETE',
        });
        const result: ApiResponse<AITool> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to delete AI tool');
        }
    },
};

// Allocation API
export interface Allocation {
    id: string;
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    employeeDepartment: string;
    aiToolId: string;
    aiToolName: string;
    monthlyPrice: string;
    startDate: string;
    endDate: string;
    notes?: string;
    status: 'pending_approval' | 'approved' | 'rejected';
    rejectionReason?: string;
}

export const allocationApi = {
    getEmployeeAllocations: async (employeeId: string): Promise<Allocation[]> => {
        const response = await fetch(`${API_BASE_URL}/allocations/employee/${employeeId}`);
        const result: ApiResponse<Allocation[]> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch employee allocations');
        }
        return result.data;
    },

    getActiveEmployeeAllocations: async (employeeId: string): Promise<Allocation[]> => {
        const response = await fetch(`${API_BASE_URL}/allocations/employee/${employeeId}/active`);
        const result: ApiResponse<Allocation[]> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch active employee allocations');
        }
        return result.data;
    },

    getAllocationById: async (id: string): Promise<Allocation> => {
        const response = await fetch(`${API_BASE_URL}/allocations/${id}`);
        const result: ApiResponse<Allocation> = await response.json();
        if (!response.ok) {
            throw new Error(result.message || 'Failed to fetch allocation');
        }
        return result.data;
    },
};
