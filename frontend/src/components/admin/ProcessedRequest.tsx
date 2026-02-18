import { useState, useEffect } from 'react';
import { allocationApi, type Allocation } from '../../services/api';

function ProcessedRequest() {
    const [processedRequests, setProcessedRequests] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProcessedRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await allocationApi.getProcessedRequests();
                setProcessedRequests(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch processed requests');
                console.error('Error fetching processed requests:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProcessedRequests();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-600">Loading processed requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (processedRequests.length === 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Processed Request</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600 text-lg">No processed requests yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Processed Request</h2>
            <div className="space-y-4">
                {processedRequests.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${request.status === 'approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                >
                                    {request.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee Name
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.employeeName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Employee Email
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.employeeEmail}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Department
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.employeeDepartment}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    AI Tool
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.aiToolName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Monthly Price
                                </label>
                                <p className="text-lg font-semibold text-gray-800">${request.monthlyPrice}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.startDate}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <p className="text-lg font-semibold text-gray-800">{request.endDate}</p>
                            </div>
                            {request.notes && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <p className="text-sm text-gray-600">{request.notes}</p>
                                </div>
                            )}
                            {request.rejectionReason && (
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                        Rejection Reason
                                    </label>
                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                        {request.rejectionReason}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProcessedRequest;
