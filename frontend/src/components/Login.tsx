import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleEmployeeLogin = () => {
        navigate('/employee');
    };

    const handleAdminLogin = () => {
        navigate('/admin');
    };

    return (
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
    );
}

export default Login;
