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
