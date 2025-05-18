import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus } from "lucide-react";

interface AssistantFormModalProps {
    onAdd: () => void;
}

export default function AssistantFormModal({ onAdd }: AssistantFormModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        photoUrl: "",
        designation: "Mr",
        role: "",
        department: "",
        specialization: "",
        experience: "",
        qualification: [{ degree: "", institution: "", year: "" }],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
        const { name, value } = e.target;

        if (name.startsWith("qualification") && typeof index === "number") {
            const updatedQualifications = [...formData.qualification];
            const field = name.split(".")[1] as keyof typeof updatedQualifications[number];
            updatedQualifications[index][field] = value;
            setFormData({ ...formData, qualification: updatedQualifications });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addQualification = () => {
        setFormData({ ...formData, qualification: [...formData.qualification, { degree: "", institution: "", year: "" }] });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            ...formData,
            qualification: formData.qualification.map(q => ({
                ...q,
                year: Number(q.year),
            })),
        };

        const res = await fetch("http://localhost:5000/api/lab/assistant", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            onAdd();
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                <Plus size={18} /> Add Assistant
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                        <Dialog.Title className="text-xl font-bold mb-4">Add Assistant</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" placeholder="Name" required className="input" onChange={handleInputChange} />
                            <input name="email" placeholder="Email" required className="input" onChange={handleInputChange} />
                            <input name="photoUrl" placeholder="Photo URL" required className="input" onChange={handleInputChange} />
                            <select name="designation" className="input" value={formData.designation} onChange={handleInputChange}>
                                <option>Dr</option>
                                <option>Mr</option>
                                <option>Ms</option>
                                <option>Mrs</option>
                                <option>Prof</option>
                                <option>Assoc Prof</option>
                                <option>Asst Prof</option>
                            </select>
                            <input name="role" placeholder="Role" required className="input" onChange={handleInputChange} />
                            <input name="department" placeholder="Department" required className="input" onChange={handleInputChange} />
                            <input name="specialization" placeholder="Specialization" required className="input" onChange={handleInputChange} />
                            <input name="experience" placeholder="Experience" required className="input" onChange={handleInputChange} />

                            <p className="text-gray-700 font-medium">Qualifications:</p>
                            {formData.qualification.map((q, index) => (
                                <div key={index} className="grid grid-cols-3 gap-2">
                                    <input
                                        name="qualification.degree"
                                        placeholder="Degree"
                                        className="input"
                                        value={q.degree}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                    <input
                                        name="qualification.institution"
                                        placeholder="Institution"
                                        className="input"
                                        value={q.institution}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                    <input
                                        name="qualification.year"
                                        placeholder="Year"
                                        type="number"
                                        className="input"
                                        value={q.year}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                </div>
                            ))}
                            <button type="button" onClick={addQualification} className="text-blue-600 text-sm">
                                + Add Qualification
                            </button>

                            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Submit
                            </button>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}
