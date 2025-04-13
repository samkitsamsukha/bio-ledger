import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

interface Incharge {
  id: string;
  name: string;
  role: string;
  department: string;
  specialization: string;
  experience: string;
  image: string;
}

const sampleIncharges: Incharge[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    role: 'Senior Research Scientist',
    department: 'Microbiology',
    specialization: 'Molecular Biology',
    experience: '12 years',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80'
  }
];

export default function Incharges() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newIncharge, setNewIncharge] = useState({
    name: '',
    role: '',
    department: '',
    specialization: '',
    experience: '',
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle incharge submission here
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lab Incharges</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Incharge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleIncharges.map((incharge) => (
          <div key={incharge.id} className="bg-white p-6 rounded-lg shadow-md">
            <img
              src={incharge.image}
              alt={incharge.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              {incharge.name}
            </h3>
            <p className="text-indigo-600 text-center mb-4">{incharge.role}</p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Department:</span>
                <span>{incharge.department}</span>
              </div>
              <div className="flex justify-between">
                <span>Specialization:</span>
                <span>{incharge.specialization}</span>
              </div>
              <div className="flex justify-between">
                <span>Experience:</span>
                <span>{incharge.experience}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lab Incharge"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={newIncharge.name}
              onChange={(e) => setNewIncharge({ ...newIncharge, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <input
              type="text"
              value={newIncharge.role}
              onChange={(e) => setNewIncharge({ ...newIncharge, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <input
                type="text"
                value={newIncharge.department}
                onChange={(e) => setNewIncharge({ ...newIncharge, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience (years)
              </label>
              <input
                type="text"
                value={newIncharge.experience}
                onChange={(e) => setNewIncharge({ ...newIncharge, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <input
              type="text"
              value={newIncharge.specialization}
              onChange={(e) => setNewIncharge({ ...newIncharge, specialization: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              value={newIncharge.image}
              onChange={(e) => setNewIncharge({ ...newIncharge, image: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Incharge
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}