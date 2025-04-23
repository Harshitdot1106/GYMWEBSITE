import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";

const ExercisesPage = () => {
  interface Exercise {
    EXERCISEID: number;
    EXERCISENAME: string;
    MUSCLE: string;
    THUMNAIL: string;
  }
  
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState("");

  useEffect(() => {
    fetch("http://localhost:300/api/exercise")
      .then(res => res.json())
      .then(data => setAllExercises(data));
  }, []);

  const uniqueMuscles = [...new Set(allExercises.map(ex => ex.MUSCLE))];

  const filtered = selectedMuscle
    ? allExercises.filter(ex => ex.MUSCLE === selectedMuscle)
    : allExercises;

  return (
    <div className="flex h-screen">
        <Sidebar />
     <div className="w-full p-6 bg-gray-100">
     <h1 className="text-2xl font-bold">Exercises</h1>

<select
  className="border p-2 my-4"
  value={selectedMuscle}
  onChange={(e) => setSelectedMuscle(e.target.value)}
>
  <option value="">All Muscles</option>
  {uniqueMuscles.map((muscle) => (
    <option key={muscle} value={muscle}>{muscle}</option>
  ))}
</select>

<div className="grid grid-cols-2 gap-4">
  {filtered.map((ex) => (
    <div key={ex.EXERCISEID} className="bg-white p-4 rounded shadow">
      <img src={ex.THUMNAIL} alt={ex.EXERCISENAME} className="w-full h-40 object-cover" />
      <h2 className="text-xl font-semibold mt-2">{ex.EXERCISENAME}</h2>
      <p className="text-sm text-gray-500">{ex.MUSCLE}</p>
    </div>
  ))}
</div>
     </div>
    </div>
  );
};

export default ExercisesPage;
