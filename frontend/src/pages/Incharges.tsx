import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axios from 'axios';
import Modal from '../components/Modal';

interface Qualification {
  degree: string;
  institution: string;
  year: number | string;
}

interface Assistant {
  name: string;
  email: string;
  photoUrl: string;
  designation: 'Dr' | 'Mr' | 'Ms' | 'Mrs' | 'Prof' | 'Assoc Prof' | 'Asst Prof' | '';
  role: string;
  department: string;
  specialization: string;
  experience: string;
  qualification: Qualification[];
}

interface Incharge {
  id: string;
  name: string;
  role: string;
  department: string;
  specialization: string;
  experience: string;
  qualification: Qualification[];
}

export default function Incharges() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [incharges, setIncharges] = useState<Incharge[]>([]);
  const [newIncharge, setNewIncharge] = useState({
    name: '',
    role: '',
    department: '',
    specialization: '',
    experience: ''
  });

  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      name: '',
      email: '',
      photoUrl: '',
      designation: '',
      role: '',
      department: '',
      specialization: '',
      experience: '',
      qualification: [{ degree: '', institution: '', year: '' }]
    }
  ]);

  const handleAssistantChange = (i: number, key: keyof Assistant, value: any) => {
    const updated = [...assistants];
    updated[i][key] = value;
    setAssistants(updated);
  };

  const handleQualificationChange = (
    aIdx: number,
    qIdx: number,
    key: keyof Qualification,
    value: any
  ) => {
    const updated = [...assistants];
    updated[aIdx].qualification[qIdx][key] = value;
    setAssistants(updated);
  };

  const addAssistant = () => {
    setAssistants([
      ...assistants,
      {
        name: '',
        email: '',
        photoUrl: '',
        designation: '',
        role: '',
        department: '',
        specialization: '',
        experience: '',
        qualification: [{ degree: '', institution: '', year: '' }]
      }
    ]);
  };

  const addQualification = (aIdx: number) => {
    const updated = [...assistants];
    updated[aIdx].qualification.push({ degree: '', institution: '', year: '' });
    setAssistants(updated);
  };

  const fetchIncharges = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lab/assistants');
      setIncharges(res.data);
    } catch (err) {
      console.error('Failed to fetch assistants:', err);
    }
  };

  useEffect(() => {
    fetchIncharges();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...newIncharge,
      assistants
    };

    axios
      .post('http://localhost:5000/api/lab/assistants', payload)
      .then(() => {
        setIsAddModalOpen(false);
        fetchIncharges();
      })
      .catch((err) => console.error('Submission error:', err));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lab Incharges</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <Plus size={20} />
          Add Incharge
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {incharges.map((incharge) => (
          <div key={incharge.id} className="bg-white p-6 rounded-full shadow-md">
            <img
              src={incharge.photoUrl || 'https://via.placeholder.com/150'}
              alt={incharge.name}
              className="w-full h-32 object-cover mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              {incharge.name}
            </h3>
            <p className="text-indigo-600 text-center mb-4 italic font-bold">{incharge.role}</p>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Department:</strong> {incharge.department}</p>
              <p><strong>Specialization:</strong> {incharge.specialization}</p>
              <p><strong>Experience:</strong> {incharge.experience}</p>
            </div>
            <div className="mt-1">
              <h4 className="text-sm font-bold text-gray-600 mb-2">Qualifications</h4>
              {incharge.qualification?.map((item, idx) => (
                <div key={idx} className="border p-3 rounded-md mb-3 bg-gray-50 text-sm">
                  <p><strong>Degree:</strong> {item.degree}</p>
                  <p><strong>Institution:</strong> {item.institution}</p>
                  <p><strong>Year:</strong> {item.year}</p>
                </div>
              ))}
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
          <div className="grid grid-cols-2 gap-4">
            {['name', 'role', 'department', 'specialization', 'experience'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {key}
                </label>
                <input
                  type="text"
                  value={(newIncharge as any)[key]}
                  onChange={(e) =>
                    setNewIncharge((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            ))}
          </div>

          {assistants.map((assistant, aIdx) => (
            <div key={aIdx} className="border p-4 rounded-md mb-6 bg-gray-50">
              <h3 className="font-semibold text-lg mb-4">Assistant #{aIdx + 1}</h3>

              {[
                { label: 'Name', key: 'name' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Photo URL', key: 'photoUrl', type: 'url' },
                { label: 'Role', key: 'role' },
                { label: 'Department', key: 'department' },
                { label: 'Specialization', key: 'specialization' },
                { label: 'Experience', key: 'experience' }
              ].map(({ label, key, type = 'text' }) => (
                <div key={key} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={(assistant as any)[key]}
                    onChange={(e) => handleAssistantChange(aIdx, key as keyof Assistant, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <select
                  value={assistant.designation}
                  onChange={(e) => handleAssistantChange(aIdx, 'designation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select</option>
                  {['Dr', 'Mr', 'Ms', 'Mrs', 'Prof', 'Assoc Prof', 'Asst Prof'].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">Qualifications</h4>
                {assistant.qualification.map((q, qIdx) => (
                  <div key={qIdx} className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Degree', key: 'degree' },
                      { label: 'Institution', key: 'institution' },
                      { label: 'Year', key: 'year', type: 'number' }
                    ].map(({ label, key, type = 'text' }) => (
                      <div key={key}>
                        <label className="block text-sm text-gray-600 mb-1">{label}</label>
                        <input
                          type={type}
                          value={(q as any)[key]}
                          onChange={(e) =>
                            handleQualificationChange(aIdx, qIdx, key as keyof Qualification, e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md"
                          required
                        />
                      </div>
                    ))}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addQualification(aIdx)}
                  className="text-sm text-indigo-600 underline"
                >
                  + Add Qualification
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAssistant}
            className="text-indigo-600 underline"
          >
            + Add Another Assistant
          </button>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Incharge
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
