import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Tutorial = {
  URL: string;
  DESCRIPTION: string;
};
type Exercise = {
  EXERCISEID: string;
  EXERCISENAME: string;
  MUSCLE: string;
  THUMNAIL: string;
};

const App: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  let { name } = useParams<{ name: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:300/api/exercise/${name}`);
        setExercises(res.data);
      } catch (err) {
        console.error("Error fetching exercises:", err);
      }
    };

    fetchData();
  }, [name]);

  const handleShowTutorial = async (exercise: Exercise) => {
    setSelectedExercise(exercise);
    try {
      const res = await axios.post("http://localhost:300/api/tutorial", {
        exerciseId: exercise.EXERCISEID,
      });
      setTutorial(res.data);
    } catch (err) {
      console.error("Error fetching tutorial:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="bg-gray-100 min-h-screen p-6 w-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {exercises.map((ex) => (
            <div
              key={ex.EXERCISEID}
              className="rounded-2xl shadow-lg overflow-hidden bg-white transition hover:shadow-xl"
            >
              <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold">{ex.EXERCISENAME}</h2>
                <span className="bg-white text-blue-700 px-4 py-1 rounded-full text-sm font-semibold capitalize">
                  {ex.MUSCLE}
                </span>
              </div>
              <div className="p-4">
                <video
                  loop
                  controls
                  autoPlay
                  muted
                  preload="auto"
                  className="rounded-lg w-full h-72 object-fill mb-4"
                >
                  <source src={ex.THUMNAIL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button
                  className="w-30 bg-gray-900 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                  onClick={() => handleShowTutorial(ex)}
                >
                  Show Tutorial
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedExercise && tutorial && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold">{selectedExercise.EXERCISENAME}</h3>
                <button
                  className="text-gray-500 hover:text-gray-800 text-xl"
                  onClick={() => {
                    setSelectedExercise(null);
                    setTutorial(null);
                  }}
                >
                  &times;
                </button>
              </div>
              <p className="text-gray-700 mb-2">
                <strong>Muscle Targeted:</strong> {selectedExercise.MUSCLE}
                </p>
               {tutorial.URL} 
              
             
             
              <p className="text-gray-600 mb-2 italic">{tutorial.DESCRIPTION}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default App;