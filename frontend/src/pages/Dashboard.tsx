import { useState } from 'react';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Modal from '../components/Modal';

interface Project {
  id: string;
  title: string;
  description: string;
  bslLevel: string;
  startDate: string;
  endDate: string;
  status: string;
  team: string[];
  objectives: string[];
  methodology: string;
  equipment: string[];
}

const sampleProjects: Project[] = [
  {
    id: '1',
    title: 'Genome Sequencing',
    description: 'Analysis of bacterial genome sequences for antibiotic resistance markers.',
    bslLevel: 'BSL-2',
    startDate: 'March 1, 2024',
    endDate: 'September 1, 2024',
    status: 'In Progress',
    team: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
    objectives: [
      'Identify novel antibiotic resistance genes',
      'Map resistance patterns across bacterial strains',
      'Develop rapid screening methods'
    ],
    methodology: 'Using next-generation sequencing combined with bioinformatics analysis to identify and characterize antibiotic resistance genes in bacterial isolates.',
    equipment: ['Illumina NextSeq', 'PCR Thermocycler', 'Bioanalyzer']
  },
  {
    id: '2',
    title: 'Protein Expression Study',
    description: 'Investigation of protein expression patterns in cancer cells.',
    bslLevel: 'BSL-2',
    startDate: 'February 15, 2024',
    endDate: 'August 15, 2024',
    status: 'In Progress',
    team: ['Dr. Emily Wong', 'Dr. James Patterson'],
    objectives: [
      'Characterize protein expression profiles',
      'Identify potential therapeutic targets',
      'Validate findings using patient samples'
    ],
    methodology: 'Utilizing proteomics and mass spectrometry to analyze protein expression patterns in various cancer cell lines.',
    equipment: ['Mass Spectrometer', 'Western Blot System', 'Cell Culture Incubator']
  }
];

export default function Dashboard() {
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    bslLevel: 'BSL-1',
    startDate: '',
    endDate: '',
    methodology: '',
    objectives: ['']
  });

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle project submission here
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to BioLedger</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {sampleProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleProject(project.id)}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 mt-1">{project.description}</p>
              </div>
              {expandedProject === project.id ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </div>

            {expandedProject === project.id && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Project Details</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-600">BSL Level:</span> {project.bslLevel}</p>
                      <p><span className="text-gray-600">Start Date:</span> {project.startDate}</p>
                      <p><span className="text-gray-600">End Date:</span> {project.endDate}</p>
                      <p><span className="text-gray-600">Status:</span> {project.status}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Team Members</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {project.team.map((member, index) => (
                        <li key={index} className="text-gray-600">{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Objectives</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="text-gray-600">{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Methodology</h4>
                  <p className="text-gray-600">{project.methodology}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Equipment Used</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {project.equipment.map((item, index) => (
                      <li key={index} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Project"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                BSL Level
              </label>
              <select
                value={newProject.bslLevel}
                onChange={(e) => setNewProject({ ...newProject, bslLevel: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BSL-1">BSL-1</option>
                <option value="BSL-2">BSL-2</option>
                <option value="BSL-3">BSL-3</option>
                <option value="BSL-4">BSL-4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={newProject.startDate}
                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Methodology
            </label>
            <textarea
              value={newProject.methodology}
              onChange={(e) => setNewProject({ ...newProject, methodology: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
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
              Create Project
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}