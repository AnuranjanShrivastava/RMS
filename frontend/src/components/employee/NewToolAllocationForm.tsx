import { useState, useEffect } from 'react';

interface AITool {
    id: string;
    name: string;
    monthlyPrice: string;
}

interface NewToolAllocationFormProps {
    onClose: () => void;
    aiTools: AITool[];
}

function NewToolAllocationForm({ onClose, aiTools }: NewToolAllocationFormProps) {
    const [formData, setFormData] = useState({
        employeeName: '',
        employeeEmail: '',
        employeeDepartment: '',
        aiToolId: '',
        startDate: '',
        endDate: '',
        notes: '',
    });

    // Auto-calculate end date when start date changes
    useEffect(() => {
        if (formData.startDate) {
            const start = new Date(formData.startDate);
            const end = new Date(start);
            end.setMonth(end.getMonth() + 1);
            const endDateStr = end.toISOString().split('T')[0];
            setFormData((prev) => ({ ...prev, endDate: endDateStr }));
        }
    }, [formData.startDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission - you can add API call here
        console.log('Form submitted:', formData);
        alert('New Tool Allocation Request submitted successfully!');
        onClose();
    };

    const departments = ['PHP', '.NET', 'AI/ML', 'React JS', 'Node.js', 'Python', 'Java', 'Angular', 'Vue.js'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8 h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">New Tool Allocation Request</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Employee Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="employeeName"
                            value={formData.employeeName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter employee name"
                        />
                    </div>

                    {/* Employee Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="employeeEmail"
                            value={formData.employeeEmail}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                            placeholder="Enter employee email"
                        />
                    </div>

                    {/* Employee Department */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Employee Department <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="employeeDepartment"
                            value={formData.employeeDepartment}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                    {dept}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* AI Tool Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            AI Tool Selection <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="aiToolId"
                            value={formData.aiToolId}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        >
                            <option value="">Select AI Tool</option>
                            {aiTools.map((tool) => (
                                <option key={tool.id} value={tool.id}>
                                    {tool.name} (${tool.monthlyPrice}/month)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* End Date (Auto-assigned) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            End Date <span className="text-gray-500 text-xs">(Auto-assigned)</span>
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            End date is automatically set to 1 month after start date
                        </p>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                            placeholder="Enter any additional notes or comments"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewToolAllocationForm;
