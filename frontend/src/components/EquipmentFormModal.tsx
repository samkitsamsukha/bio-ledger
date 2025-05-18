import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus } from "lucide-react";

interface EquipmentFormModalProps {
    onAdd: () => void;
}

export default function EquipmentFormModal({ onAdd }: EquipmentFormModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        model: "",
        manufacturer: "",
        year: "",
        photoUrl: "",
        specifications: [""],
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const updated = [...formData.specifications];
        updated[index] = e.target.value;
        setFormData({ ...formData, specifications: updated });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addSpecField = () => {
        setFormData({ ...formData, specifications: [...formData.specifications, ""] });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const payload = {
            ...formData,
            specifications: formData.specifications.map((s) => ({ specification: s })),
        };

        const res = await fetch("http://localhost:5000/api/lab/equipment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            onAdd();
            setFormData({
                name: "",
                model: "",
                manufacturer: "",
                year: "",
                photoUrl: "",
                specifications: [""],
            });
            setIsOpen(false);
        } else {
            const data = await res.json();
            setError(data.error || "Something went wrong");
        }
    };

    return (
        <>
            <button
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                onClick={() => setIsOpen(true)}
            >
                <Plus size={20} />
                Add Equipment
            </button>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <Dialog.Panel className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg">
                        <Dialog.Title className="text-xl font-bold mb-4">Add Equipment</Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input name="name" placeholder="Name" required onChange={handleInputChange} value={formData.name} className="w-full border p-2 rounded" />
                            <input name="model" placeholder="Model" required onChange={handleInputChange} value={formData.model} className="w-full border p-2 rounded" />
                            <input name="manufacturer" placeholder="Manufacturer" onChange={handleInputChange} value={formData.manufacturer} className="w-full border p-2 rounded" />
                            <input name="year" type="number" placeholder="Year" required onChange={handleInputChange} value={formData.year} className="w-full border p-2 rounded" />
                            <input name="photoUrl" placeholder="Photo URL" onChange={handleInputChange} value={formData.photoUrl} className="w-full border p-2 rounded" />

                            {formData.specifications.map((spec, i) => (
                                <input
                                    key={i}
                                    name="specification"
                                    value={spec}
                                    placeholder={`Specification ${i + 1}`}
                                    onChange={(e) => handleChange(e, i)}
                                    className="w-full border p-2 rounded"
                                />
                            ))}
                            <button type="button" onClick={addSpecField} className="text-blue-600 text-sm">+ Add Spec</button>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

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
