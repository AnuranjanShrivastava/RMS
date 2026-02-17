import { useState, useEffect } from 'react';
import { aiToolsApi, type AITool } from '../../services/api';

function AITools() {
    const [tools, setTools] = useState<AITool[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newToolName, setNewToolName] = useState('');
    const [newToolPrice, setNewToolPrice] = useState('');

    // Fetch AI tools on component mount
    useEffect(() => {
        fetchAITools();
    }, []);

    const fetchAITools = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await aiToolsApi.getAll();
            setTools(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch AI tools');
            console.error('Error fetching AI tools:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTool = async () => {
        if (newToolName.trim() && newToolPrice.trim()) {
            try {
                const newTool = await aiToolsApi.create({
                    name: newToolName.trim(),
                    monthlyPrice: newToolPrice.trim(),
                });
                setTools([...tools, newTool]);
                setNewToolName('');
                setNewToolPrice('');
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to add AI tool');
                console.error('Error adding AI tool:', err);
            }
        }
    };

    const handleDeleteTool = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this AI tool?')) {
            try {
                await aiToolsApi.delete(id);
                setTools(tools.filter((tool) => tool.id !== id));
            } catch (err) {
                alert(err instanceof Error ? err.message : 'Failed to delete AI tool');
                console.error('Error deleting AI tool:', err);
            }
        }
    };

    const handleUpdateTool = (id: string, field: 'name' | 'monthlyPrice', value: string) => {
        setTools(
            tools.map((tool) => (tool.id === id ? { ...tool, [field]: value } : tool))
        );
    };

    const handleUpdateClick = async (tool: AITool) => {
        try {
            await aiToolsApi.update(tool.id, {
                name: tool.name,
                monthlyPrice: tool.monthlyPrice,
            });
            alert(`Tool "${tool.name}" updated successfully!`);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update AI tool');
            console.error('Error updating AI tool:', err);
            // Refresh tools to revert changes
            fetchAITools();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-gray-600">Loading AI tools...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600">Error: {error}</p>
                <button
                    onClick={fetchAITools}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">AI Tools</h2>

            {/* Add New Tool Form */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New AI Tool</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            AI Tool Name
                        </label>
                        <input
                            type="text"
                            value={newToolName}
                            onChange={(e) => setNewToolName(e.target.value)}
                            placeholder="Enter tool name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Monthly Price ($)
                        </label>
                        <input
                            type="number"
                            value={newToolPrice}
                            onChange={(e) => setNewToolPrice(e.target.value)}
                            placeholder="Enter price"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleAddTool}
                            className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Add Tool
                        </button>
                    </div>
                </div>
            </div>

            {/* Tools List */}
            <div className="space-y-4">
                {tools.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No AI tools added yet. Add your first tool above.</p>
                    </div>
                ) : (
                    tools.map((tool) => (
                        <div
                            key={tool.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        AI Tool Name
                                    </label>
                                    <input
                                        type="text"
                                        value={tool.name}
                                        onChange={(e) => handleUpdateTool(tool.id, 'name', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        value={tool.monthlyPrice}
                                        onChange={(e) => handleUpdateTool(tool.id, 'monthlyPrice', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                                    />
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="text-sm font-medium text-gray-700">Controls</div>
                                    <div className="flex items-end gap-3">
                                        <button
                                            onClick={() => handleUpdateClick(tool)}
                                            className="flex-1 px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTool(tool.id)}
                                            className="flex-1 px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Delete
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AITools;
