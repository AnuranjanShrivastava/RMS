import { useState } from 'react';
import AITools from './admin/AITools';
import PendingRequest from './admin/PendingRequest';
import ProcessedRequest from './admin/ProcessedRequest';

function Admin() {
  const [activeTab, setActiveTab] = useState<'ai-tools' | 'pending' | 'processed'>('ai-tools');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('ai-tools')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${activeTab === 'ai-tools'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                AI Tools
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${activeTab === 'pending'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                Pending Request
              </button>
              <button
                onClick={() => setActiveTab('processed')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-all duration-300 ${activeTab === 'processed'
                  ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white border-b-2 border-pink-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
              >
                Processed Request
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'ai-tools' && <AITools />}
            {activeTab === 'pending' && <PendingRequest />}
            {activeTab === 'processed' && <ProcessedRequest />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
