import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import AddProjectModal from '../components/AddProjectModal';

interface Project {
  _id: string;
  title: string;
  subtitle: string;
  bsl: string;
  startDate: string;
  endDate: string;
  teamMembers: string[];
  objectives: string[];
  methodology: string;
  equipment: string[];
  results: string[];
  aim: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/lab/projects');
      setProjects(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProject = (projectId: string) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to BioLedger</h1>
          <AddProjectModal />
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div
              className="p-6 cursor-pointer flex justify-between items-center"
              onClick={() => toggleProject(project._id)}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                <p className="text-gray-600 mt-1">{project.subtitle}</p>
              </div>
              {expandedProject === project._id ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </div>

            {expandedProject === project._id && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-xl mb-2">Project Details</h4>
                    <div className="space-y-2">
                      <p className='w-fit px-2 bg-green-100 rounded-md py-1'><span className="text-gray-600">Aim:</span> {project.aim}</p>
                      <p className={`w-fit px-2 py-1 rounded-md ${project.bsl==="BSL-4"? "bg-red-300": project.bsl==="BSL-3"? "bg-orange-200" : project.bsl==="BSL-2"? "bg-yellow-200": "bg-blue-200"}`}><span className={`text-gray-600`}>BSL Level:</span> {project.bsl}</p>
                        <p><span className="text-gray-600">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}</p>
                        <p><span className="text-gray-600">End Date:</span> {new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-2 text-xl">Team Members</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {project.teamMembers.map((member, index) => (
                        <li key={index} className="text-gray-600">{member}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-indigo-900 text-xl mb-2">Objectives</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="text-gray-600">{objective}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-indigo-900 text-xl mb-2">Methodology</h4>
                  <p className="text-gray-600">{project.methodology}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Equipment Used</h4>
                  <div className="flex flex-row gap-2">
                    {project.equipment.map((item, index) => (
                      <div key={index} className="text-gray-600 p-2 bg-indigo-50 rounded-md border border-indigo-200">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-indigo-900 text-xl mb-2">Results</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {project.results.map((result, index) => (
                      <li key={index} className="text-gray-600">{result}</li>
                    ))}
                  </ul>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}