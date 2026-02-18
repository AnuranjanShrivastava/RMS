import { useState, useEffect } from 'react';
import { allocationApi, type Allocation } from '../../services/api';

function PendingRequest() {
    const [pendingRequests, setPendingRequests] = useState<Allocation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchPendingRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await allocationApi.getPendingRequests();
            setPendingRequests(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch pending requests');
            console.error('Error fetching pending requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            setProcessing(id);
            await allocationApi.approveAllocation(id);
            // Refresh the list
            await fetchPendingRequests();
            alert('Request approved successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to approve request');
            console.error('Error approving request:', err);
        } finally {
            setProcessing(null);
        }
    };

    const handleRejectClick = (id: string) => {
        setSelectedRequestId(id);
        setShowRejectModal(true);
        setRejectionReason('');
    };

    const handleRejectConfirm = async () => {
        if (!selectedRequestId || !rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            setProcessing(selectedRequestId);
            await allocationApi.rejectAllocation(selectedRequestId, rejectionReason);
            setShowRejectModal(false);
            setSelectedRequestId(null);
            setRejectionReason('');
            // Refresh the list
            await fetchPendingRequests();
            alert('Request rejected successfully!');
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to reject request');
            console.error('Error rejecting request:', err);
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-600">Loading pending requests...</p>
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

    if (pendingRequests.length === 0) {
        return (
            <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Pending Request</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                    <p className="text-gray-600 text-lg">No pending requests at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Pending Request</h2>
            <div className="space-y-4">
                {pendingRequests.map((request) => (
                    <div
                        key={request.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                                    PENDING APPROVAL
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
                        </div>
                        <div className="mt-6 flex gap-4 justify-end border-t pt-4">
                            <button
                                onClick={() => handleApprove(request.id)}
                                disabled={processing === request.id}
                                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing === request.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                                onClick={() => handleRejectClick(request.id)}
                                disabled={processing === request.id}
                                className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Reject Request</h2>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedRequestId(null);
                                    setRejectionReason('');
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none"
                                placeholder="Please provide a reason for rejection..."
                            />
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedRequestId(null);
                                    setRejectionReason('');
                                }}
                                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectConfirm}
                                disabled={!rejectionReason.trim() || processing !== null}
                                className="flex-1 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Processing...' : 'Confirm Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PendingRequest;
