import { Plus } from 'lucide-react';

export default function Equipment() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laboratory Equipment</h1>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={20} />
          Add Equipment
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Equipment Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80"
            alt="PCR Machine"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">PCR Machine</h3>
            <p className="text-gray-600 mb-4">Thermal cycler for DNA amplification</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="text-gray-900">BioRad T100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600">Operational</span>
              </div>
            </div>
          </div>
        </div>
        {/* Add more equipment cards here */}
      </div>
    </div>
  );
}