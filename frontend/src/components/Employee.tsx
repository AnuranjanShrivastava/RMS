import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewToolAllocationForm from './employee/NewToolAllocationForm';
import AllocationList from './employee/AllocationList';
import { aiToolsApi, allocationApi, type AITool, type Allocation } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

function Employee() {
    const navigate = useNavigate();
    const { employeeId } = useAuthStore();
    const [allocations, setAllocations] = useState<Allocation[]>([]);
    const [loadingAllocations, setLoadingAllocations] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showAllocationForm, setShowAllocationForm] = useState(false);
    const [aiTools, setAiTools] = useState<AITool[]>([]);
    const [loadingTools, setLoadingTools] = useState(true);
    const [activeTab, setActiveTab] = useState<'pending' | 'rejected' | 'approved'>('approved');

    // Fetch Employee Allocations from API
    const fetchAllocations = async () => {
        if (!employeeId) {
            console.error('Employee ID not found');
            return;
        }
        try {
            setLoadingAllocations(true);
            const data = await allocationApi.getEmployeeAllocations(employeeId);
            // Sort by startDate descending (most recent first) as a fallback
            // Backend already sorts by created_at DESC, but this ensures frontend sorting too
            const sortedData = [...data].sort((a, b) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateB - dateA; // Descending order (newest first)
            });
            setAllocations(sortedData);
        } catch (err) {
            console.error('Error fetching allocations:', err);
            setAllocations([]);
        } finally {
            setLoadingAllocations(false);
        }
    };

    // Handle successful form submission
    const handleAllocationSuccess = () => {
        fetchAllocations();
        setActiveTab('pending'); // Switch to pending tab after submission
    };

    // Redirect to login if employee ID is not found
    useEffect(() => {
        if (!employeeId) {
            navigate('/');
        }
    }, [employeeId, navigate]);

    useEffect(() => {
        if (employeeId) {
            fetchAllocations();
        }
    }, [employeeId]);

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

    // Don't render if employee ID is not found (will redirect)
    if (!employeeId) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-2xl p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-semibold text-gray-800">Employee Dashboard</h1>
                        <button
                            onClick={() => setShowRequestModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <span className="text-xl">+</span>
                            <span>New Request</span>
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <div className="flex">
                            <button
                                onClick={() => setActiveTab('approved')}
                                className={`px-6 py-3 text-center font-semibold transition-all duration-300 ${activeTab === 'approved'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                Approved Tools
                            </button>
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`px-6 py-3 text-center font-semibold transition-all duration-300 ${activeTab === 'pending'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                Pending Requests
                            </button>
                            <button
                                onClick={() => setActiveTab('rejected')}
                                className={`px-6 py-3 text-center font-semibold transition-all duration-300 ${activeTab === 'rejected'
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-b-2 border-indigo-600'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                            >
                                Rejected Requests
                            </button>

                        </div>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'pending' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Pending Requests</h2>
                            <AllocationList
                                allocations={allocations}
                                loading={loadingAllocations}
                                status="pending_approval"
                            />
                        </div>
                    )}

                    {activeTab === 'rejected' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rejected Requests</h2>
                            <AllocationList
                                allocations={allocations}
                                loading={loadingAllocations}
                                status="rejected"
                            />
                        </div>
                    )}

                    {activeTab === 'approved' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Approved Tools</h2>
                            <AllocationList
                                allocations={allocations}
                                loading={loadingAllocations}
                                status="approved"
                            />
                        </div>
                    )}
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
                    onSuccess={handleAllocationSuccess}
                />
            )}
        </div>
    );
}

export default Employee;
