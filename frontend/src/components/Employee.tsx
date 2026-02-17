import { useState, useEffect } from 'react';
import NewToolAllocationForm from './employee/NewToolAllocationForm';
import { aiToolsApi, allocationApi, type AITool, type Allocation } from '../services/api';

function Employee() {
    const EMPLOYEE_ID = '1'; // Dummy employee ID
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loadingAllocations, setLoadingAllocations] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showAllocationForm, setShowAllocationForm] = useState(false);
    const [aiTools, setAiTools] = useState<AITool[]>([]);
    const [loadingTools, setLoadingTools] = useState(true);

    // Fetch Employee Allocations from API
    useEffect(() => {
        const fetchAllocations = async () => {
            try {
                setLoadingAllocations(true);
                const data = await allocationApi.getEmployeeAllocations(EMPLOYEE_ID);
                setAllocations(data);
            } catch (err) {
                console.error('Error fetching allocations:', err);
                setAllocations([]);
            } finally {
                setLoadingAllocations(false);
            }
        };

        fetchAllocations();
    }, []);

    // Fetch AI Tools from API
    useEffect(() => {
        const fetchAITools = async () => {
            try {
                setLoadingTools(true);
                const data = await aiToolsApi.getAll();
                setAiTools(data);
            } catch (err) {
                console.error('Error fetching AI tools:', err);
                setAiTools([]);
            } finally {
                setLoadingTools(false);
            }
        };

        fetchAITools();
    }, []);

    const handleRequestType = (type: 'allocation' | 'migration') => {
        if (type === 'allocation') {
            setShowRequestModal(false);
            setShowAllocationForm(true);
        } else {
            // Handle migration request
            alert('Migration Request - Coming soon!');
            setShowRequestModal(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-semibold text-gray-800">Employee Dashboard</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <span className="text-xl">+</span>
                                <span>New Request</span>
                            </button>
                            <button
                                onClick={() => setShowRequestModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <span>Pending Request</span>
                            </button>
                        </div>

                    </div>

                    {/* Assigned Tools Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Assigned Tools</h2>
                        {loadingAllocations ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-gray-600 text-lg">Loading assigned tools...</p>
                            </div>
                        ) : allocations.length === 0 ? (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                                <p className="text-gray-600 text-lg">No tools assigned yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {allocations.map((allocation) => (
                                    <div
                                        key={allocation.id}
                                        className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${allocation.status === 'approved'
                                                        ? 'bg-green-100 text-green-800'
                                                        : allocation.status === 'rejected'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Notes
                                                    </label>
                                                    <p className="text-sm text-gray-600">{allocation.notes}</p>
                                                </div>
                                            )}
                                            {allocation.rejectionReason && (
                                                <div className="md:col-span-3">
                                                    <label className="block text-sm font-medium text-red-700 mb-1">
                                                        Rejection Reason
                                                    </label>
                                                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{allocation.rejectionReason}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">New Request</h2>
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">Please select the type of request you want to raise:</p>
                        <div className="space-y-4">
                            <button
                                onClick={() => handleRequestType('allocation')}
                                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-left"
                            >
                                New Tool Allocation Request
                            </button>
                            <button
                                onClick={() => handleRequestType('migration')}
                                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg text-left"
                            >
                                Migration Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Tool Allocation Form Modal */}
            {showAllocationForm && (
                <NewToolAllocationForm
                    onClose={() => setShowAllocationForm(false)}
                    aiTools={aiTools}
                />
            )}
        </div>
    );
}

export default Employee;
