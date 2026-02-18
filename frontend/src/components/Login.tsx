import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

function Login() {
    const navigate = useNavigate();
    const { setUserType, setEmployeeId } = useAuthStore();
    const [showEmployeeIdModal, setShowEmployeeIdModal] = useState(false);
    const [employeeId, setEmployeeIdInput] = useState('');

    const handleEmployeeLogin = () => {
        setShowEmployeeIdModal(true);
    };

    const handleEmployeeIdSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (employeeId.trim()) {
            setEmployeeId(employeeId.trim());
            setUserType('employee');
            navigate('/employee');
        }
    };

    const handleAdminLogin = () => {
        setUserType('admin');
        navigate('/admin');
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 p-5">
                <div className="bg-white rounded-xl p-10 shadow-2xl text-center max-w-md w-full">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to RMS</h1>
                    <p className="text-gray-600 mb-8 text-base">Please select your login type:</p>
                    <div className="flex flex-col gap-4">
                        <button
                            className="px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={handleEmployeeLogin}
                        >
                            Login as Employee
                        </button>
                        <button
                            className="px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-pink-400 to-red-500 rounded-lg hover:from-pink-500 hover:to-red-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                            onClick={handleAdminLogin}
                        >
                            Login as Admin
                        </button>
                    </div>
                </div>
            </div>

            {/* Employee ID Modal */}
            {showEmployeeIdModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Enter Employee ID</h2>
                            <button
                                onClick={() => {
                                    setShowEmployeeIdModal(false);
                                    setEmployeeIdInput('');
                                }}
                                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <form onSubmit={handleEmployeeIdSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Employee ID <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeIdInput(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                    placeholder="Enter your Employee ID"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEmployeeIdModal(false);
                                        setEmployeeIdInput('');
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Login;
