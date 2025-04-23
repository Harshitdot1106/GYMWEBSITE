import Sidebar from '@/components/Sidebar';
import React, { useEffect, useState } from 'react';

type EquipmentType = {
  EQUIPMENTID: string;
  EQNAME: string;
  THUMNAIL: string;
  MUSCLE: string;
};

type ExerciseType = {
  EXERCISEID: string;
  EXERCISENAME: string;
  MUSCLE: string;
  THUMNAIL: string;
};

const Equipment = () => {
  const [equipments, setEquipments] = useState<EquipmentType[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);

  useEffect(() => {
    fetch("http://localhost:300/api/equipment")
      .then((response) => response.json())
      .then((data: EquipmentType[]) => setEquipments(data))
      .catch((error) => {
        console.error("Error fetching Equipments:", error);
      });
  }, []);
  const handleEquipmentSelect = (equipment: EquipmentType) => {
    setSelectedEquipment(equipment);
  
    fetch(`http://localhost:300/api/usage/${equipment.EQUIPMENTID}`)
      .then((res) => res.json())
      .then((data: ExerciseType[]) => setExercises(data))
      .catch((err) => console.error("Error fetching exercises:", err));
  };
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Equipments</h1>

        <div className="flex gap-6">
          {/* Equipment Grid */}
          <div className={`grid gap-6 ${selectedEquipment ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'} flex-1`}>
            {equipments.map((equipment) => (
              <div
                key={equipment.EQUIPMENTID}
                onClick={() => handleEquipmentSelect(equipment)}
                className="cursor-pointer bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <img
                  src={equipment.THUMNAIL}
                  alt={equipment.EQNAME}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">{equipment.EQNAME}</h2>
                </div>
              </div>
            ))}
          </div>

          {/* Equipment Detail Panel */}
          {selectedEquipment && (
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 relative">
              <button
                onClick={() => setSelectedEquipment(null)}
                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-lg font-bold"
              >
                ✕
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Equipment Details</h2>
              <img
                src={selectedEquipment.THUMNAIL}
                alt={selectedEquipment.EQNAME}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <p className="text-lg mb-2"><strong>ID:</strong> {selectedEquipment.EQUIPMENTID}</p>
              <p className="text-lg"><strong>Name:</strong> {selectedEquipment.EQNAME}</p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Exercises using this equipment:</h3>
<ul className="list-disc ml-5 space-y-1">
  {exercises.map((exercise) => (
    <li key={exercise.EXERCISEID} className="text-gray-700">
      {exercise.EXERCISENAME} ({exercise.MUSCLE})
    </li>
  ))}
</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Equipment;
