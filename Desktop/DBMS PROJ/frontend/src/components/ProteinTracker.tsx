import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Weight } from 'lucide-react';

interface ProteinTrackerProps {
  email: string;
}

const ProteinTracker: React.FC<ProteinTrackerProps> = ({ email }) => {
  const [proteinWeight, setProteinWeight] = useState('');
  const [proteinRequired, setProteinRequired] = useState<number | null>(null);
  const [proteinConsumed, setProteinConsumed] = useState<number | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const fetchProteinData = async () => {
      try {
        const response = await axios.get(`http://localhost:300/api/protein/${email}`);
        const data = response.data;

        if (data && data.required !== undefined && data.consumed !== undefined) {
          setProteinRequired(data.required);
          setProteinConsumed(data.consumed);
          setIsNewUser(false);
        } else {
          setIsNewUser(true);
        }
      } catch (error) {
        console.error('Error fetching protein data:', error);
        setIsNewUser(true);
      }
    };

    fetchProteinData();
  }, [email]);

  const handleSaveInitial = async () => {
    const weight = parseFloat(proteinWeight);
    if (!isNaN(weight) && weight > 0) {
      const target = parseFloat((weight * 1.5).toFixed(1));

      setProteinRequired(target);
      setProteinConsumed(0);

      try {
        await axios.post(`http://localhost:300/api/protein/${email}`, {
          consumed: 0,
        });
        setIsNewUser(false);
        setProteinWeight('');
      } catch (err) {
        console.error('Error saving initial protein data:', err);
      }
    }
  };

  const handleAddProtein = async () => {
    const amount = parseFloat(proteinWeight);
    if (!isNaN(amount) && amount > 0 && proteinConsumed !== null) {
      const newConsumed = proteinConsumed + amount;
      setProteinConsumed(newConsumed);
      setProteinWeight('');

      try {
        await axios.post(`http://localhost:300/api/protein/${email}`, {
          required: proteinRequired,
          
          consumed: newConsumed,
        });
      } catch (error) {
        console.error('Error updating protein data:', error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Protein Requirement Tracker</h2>

      {isNewUser ? (
        <div className="space-y-4">
          <label className="block font-semibold mb-1">Enter your weight (kg):</label>
          <input
            type="number"
            value={proteinWeight}
            onChange={(e) => setProteinWeight(e.target.value)}
            className="border px-3 py-2 rounded-md w-full md:w-1/2"
            placeholder="e.g. 70"
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSaveInitial}
          >
            Calculate Requirement & Start Tracking
          </button>
        </div>
      ) : (
        <div>
          <p><strong>Target:</strong> {proteinRequired} grams/day</p>
          <p><strong>Consumed:</strong> {proteinConsumed} grams</p>
          <p><strong>Remaining:</strong> {Math.max((proteinRequired ?? 0) - (proteinConsumed ?? 0), 0)} grams</p>

          <div className="mt-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <input
              type="number"
              placeholder="Enter protein consumed (g)"
              className="border px-3 py-2 rounded-md w-full md:w-auto"
              value={proteinWeight}
              onChange={(e) => setProteinWeight(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleAddProtein}
            >
              Add
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={() => {
                setProteinWeight('');
                setProteinRequired(null);
                setProteinConsumed(null);
                setIsNewUser(true);
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProteinTracker;
