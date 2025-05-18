import { useEffect, useState } from "react";
import EquipmentFormModal from "../components/EquipmentFormModal";


export default function Equipment() {
  interface Equipment {
    photoUrl: string;
    name: string;
    model: string;
    manufacturer: string;
    year: number;
    specifications?: { specification: string }[];
  }

  const [equipments, setEquipments] = useState<Equipment[]>([]);

  const fetchEquipments = async () => {
    const res = await fetch("http://localhost:5000/api/lab/equipments");
    const data = await res.json();
    setEquipments(data);
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Laboratory Equipment</h1>
        <EquipmentFormModal onAdd={fetchEquipments} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipments.map((eq, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={eq.photoUrl} alt={eq.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">{eq.name}</h3>
              <p className="text-gray-600 mb-2">Model: {eq.model}</p>
              <p className="text-gray-600 mb-2">Manufacturer: {eq.manufacturer}</p>
              <p className="text-gray-600 mb-2">Year: {eq.year}</p>
              <ul className="text-sm text-gray-600 mt-2">
                {eq.specifications?.map((s, i) => <li key={i}>• {s.specification}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
