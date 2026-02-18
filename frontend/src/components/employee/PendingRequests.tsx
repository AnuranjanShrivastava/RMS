import { type Allocation } from '../../services/api';

interface PendingRequestsProps {
    allocations: Allocation[];
    loading: boolean;
}

function PendingRequests({ allocations, loading }: PendingRequestsProps) {
    // Filter pending_approval and rejected requests
    const pendingAndRejected = allocations.filter(
        (allocation) => allocation.status === 'pending_approval' || allocation.status === 'rejected'
    );

    if (loading) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">Loading requests...</p>
            </div>
        );
    }

    if (pendingAndRejected.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 text-lg">No pending or rejected requests.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {pendingAndRejected.map((allocation) => (
                <div
                    key={allocation.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${allocation.status === 'rejected'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}
                            >
                                {allocation.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tool Name
                            </label>
                            <p className="text-lg font-semibold text-gray-800">{allocation.aiToolName}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Monthly Price
                            </label>
                            <p className="text-lg font-semibold text-gray-800">${allocation.monthlyPrice}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department
                            </label>
                            <p className="text-lg font-semibold text-gray-800">{allocation.employeeDepartment}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <p className="text-lg font-semibold text-gray-800">{allocation.startDate}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <p className="text-lg font-semibold text-gray-800">{allocation.endDate}</p>
                        </div>
                        {allocation.notes && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                <p className="text-sm text-gray-600">{allocation.notes}</p>
                            </div>
                        )}
                        {allocation.rejectionReason && (
                            <div className="md:col-span-3">
                                <label className="block text-sm font-medium text-red-700 mb-1">
                                    Rejection Reason
                                </label>
                                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                    {allocation.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PendingRequests;
