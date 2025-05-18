import React, { useState } from "react";
import axios from "axios";

type Project = {
  title: string;
  subtitle: string;
  bsl: string;
  startDate: string;
  endDate: string;
  aim: string;
  methodology: string;
  equipment: string[];
  objectives: string[];
  teamMembers: string[];
  results: string[];
};

const AddProjectModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [project, setProject] = useState<Project>({
    title: "",
    subtitle: "",
    bsl: "BSL-1",
    startDate: "",
    endDate: "",
    aim: "",
    methodology: "",
    equipment: [""],
    objectives: [""],
    teamMembers: [""],
    results: [""],
  });

  const handleChange = (field: keyof Project, value: string | string[], index?: number) => {
    if (Array.isArray(project[field])) {
      const updated = [...(project[field] as string[])];
      if (index !== undefined) updated[index] = value as string;
      setProject({ ...project, [field]: updated });
    } else {
      setProject({ ...project, [field]: value });
    }
  };

  const addField = (field: keyof Project) => {
    if (Array.isArray(project[field])) {
      const updated = [...(project[field] as string[]), ""];
      setProject({ ...project, [field]: updated });
    }
  };

  const removeField = (field: keyof Project, index: number) => {
    if (Array.isArray(project[field])) {
      const updated = [...(project[field] as string[])];
      updated.splice(index, 1);
      setProject({ ...project, [field]: updated });
    }
  };

  const submitProject = async () => {
    try {
      await axios.post("http://localhost:5000/api/lab/project", project);
      alert("Project added successfully!");
      setIsOpen(false);
      setProject({
        title: "",
        subtitle: "",
        bsl: "BSL-1",
        startDate: "",
        endDate: "",
        aim: "",
        methodology: "",
        equipment: [""],
        objectives: [""],
        teamMembers: [""],
        results: [""],
      });
    } catch (error) {
      alert("Failed to add project.");
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
        Add Project
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Project</h2>

            {/* Simple Inputs */}
            <input type="text" placeholder="Title" value={project.title} onChange={(e) => handleChange("title", e.target.value)} className="border w-full p-2 mb-2" />
            <input type="text" placeholder="Subtitle" value={project.subtitle} onChange={(e) => handleChange("subtitle", e.target.value)} className="border w-full p-2 mb-2" />

            <label className="block font-semibold">Biosafety Level (BSL):</label>
            <select value={project.bsl} onChange={(e) => handleChange("bsl", e.target.value)} className="border w-full p-2 mb-2">
              <option value="BSL-1">BSL-1</option>
              <option value="BSL-2">BSL-2</option>
              <option value="BSL-3">BSL-3</option>
              <option value="BSL-4">BSL-4</option>
            </select>

            <label className="block font-semibold">Start Date:</label>
            <input type="date" value={project.startDate} onChange={(e) => handleChange("startDate", e.target.value)} className="border w-full p-2 mb-2" />

            <label className="block font-semibold">End Date:</label>
            <input type="date" value={project.endDate} onChange={(e) => handleChange("endDate", e.target.value)} className="border w-full p-2 mb-2" />

            <textarea placeholder="Aim" value={project.aim} onChange={(e) => handleChange("aim", e.target.value)} className="border w-full p-2 mb-2" />
            <textarea placeholder="Methodology" value={project.methodology} onChange={(e) => handleChange("methodology", e.target.value)} className="border w-full p-2 mb-2" />

            {/* Dynamic Arrays */}
            {["equipment", "objectives", "teamMembers", "results"].map((field) => (
              <div key={field}>
                <label className="font-semibold capitalize">{field}:</label>
                {(project[field as keyof Project] as string[]).map((value: string, i: number) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={value}
                      onChange={(e) => handleChange(field as keyof Project, e.target.value, i)}
                      className="border flex-1 p-2"
                      placeholder={`${field.slice(0, -1)} ${i + 1}`}
                    />
                    <button onClick={() => removeField(field as keyof Project, i)} className="text-red-500">✕</button>
                  </div>
                ))}
                <button onClick={() => addField(field as keyof Project)} className="text-blue-500 mb-3">+ Add {field.slice(0, -1)}</button>
              </div>
            ))}

            <div className="flex justify-end gap-3">
              <button onClick={() => setIsOpen(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button onClick={submitProject} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProjectModal;
