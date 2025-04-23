import Sidebar from '@/components/Sidebar';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const MuscleComparison = () => {
  const [svgContent1, setSvgContent1] = useState('');
  const [svgContent2, setSvgContent2] = useState('');
  const [selectedMuscle1, setSelectedMuscle1] = useState('');
  const [selectedMuscle2, setSelectedMuscle2] = useState('');
const navigate=useNavigate();
  useEffect(() => {
    fetch('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1-EmESOPgmfN94Ic4AL3dAljZg7HKCDq.svg')
      .then(response => response.text())
      .then(data => setSvgContent2(data))
      .catch(error => console.error('Error fetching SVG 2:', error));
      
    fetch('2.svg')
      .then(response => response.text())
      .then(data => setSvgContent1(data))
      .catch(error => console.error('Error fetching SVG 1:', error));
  }, []);

  useEffect(() => {
    if (svgContent1) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent1, 'image/svg+xml');
      doc.querySelectorAll('path, polygon').forEach((el, i) => {
        el.setAttribute('data-muscle-id', `muscle-${i}`);
        if (!el.getAttribute('fill')) el.setAttribute('fill', '#ccc');
      });
      setSvgContent1(new XMLSerializer().serializeToString(doc));
    }
  }, [svgContent1]);

  useEffect(() => {
    if (svgContent2) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgContent2, 'image/svg+xml');
      doc.querySelectorAll('path, polygon').forEach((el, i) => {
        el.setAttribute('data-muscle-id', `muscle-${i}`);
        if (!el.getAttribute('fill')) el.setAttribute('fill', '#ccc');
      });
      setSvgContent2(new XMLSerializer().serializeToString(doc));
    }
  }, [svgContent2]);

  const handleClick1 = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLElement).getAttribute('data-muscle-id');
    const name = muscleMap1[id ?? ''] || 'Unknown Muscle';
    if (id) setSelectedMuscle1(name);
    navigate(`/exercise/${name}`); // Navigate to the exercise page with the selected muscle name
    
  };

  const handleClick2 = (e: React.MouseEvent<HTMLDivElement>) => {
    const id = (e.target as HTMLElement).getAttribute('data-muscle-id');
    const name = muscleMap2[id ?? ''] || 'Unknown Muscle';
    if (id) setSelectedMuscle2(name);
    navigate(`/exercise/${name}`);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Select Muscle Group For Finding Exercises
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center items-start">
          {/* Front View */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3 text-blue-800">Front View</h2>
            {selectedMuscle2 && (
              <div className="mb-3 px-4 py-2 bg-blue-100 text-blue-800 rounded shadow">
                Selected: {selectedMuscle2}
              </div>
            )}
            <div
              className="w-[300px] md:w-[400px] cursor-pointer shadow-lg  rounded p-2"
              onClick={handleClick2}
              dangerouslySetInnerHTML={{ __html: svgContent2 }}
            />
          </div>

          {/* Back View */}
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-3 text-green-800">Back View</h2>
            {selectedMuscle1 && (
              <div className="mb-3 px-4 py-2 bg-green-100 text-green-800 rounded shadow">
                Selected: {selectedMuscle1}
              </div>
            )}
            <div
              className="w-[300px] md:w-[400px] cursor-pointer shadow-lg rounded p-2"
              onClick={handleClick1}
              dangerouslySetInnerHTML={{ __html: svgContent1 }}
            />
          </div>
        </div>

        
      </main>
    </div>
  );
};

const muscleMap1: { [key: string]: string } = {
  'muscle-0': 'Traps', 'muscle-1': 'Calf', 'muscle-2': 'Calf',
  'muscle-3': 'Hamstring', 'muscle-4': 'Hamstring', 'muscle-5': 'Glute',
  'muscle-6': 'Glute', 'muscle-7': 'Glutes', 'muscle-8': 'Forearm',
  'muscle-9': 'Knees', 'muscle-10': 'Forearm', 'muscle-11': 'Forearm',
  'muscle-12': 'Forearm', 'muscle-13': 'Tricep', 'muscle-14': 'Tricep',
  'muscle-15': 'Lat', 'muscle-16': 'Lat', 'muscle-17': 'Lower Back',
  'muscle-18': 'Traps', 'muscle-19': 'Shoulders', 'muscle-20': 'Shoulders',
};

const muscleMap2: { [key: string]: string } = {
  'muscle-0': 'Calf', 'muscle-1': 'Calf', 'muscle-2': 'Quad',
  'muscle-3': 'Quad', 'muscle-4': 'Abs', 'muscle-5': 'Oblique',
  'muscle-6': 'Oblique', 'muscle-7': 'Oblique', 'muscle-8': 'Quadriceps',
  'muscle-9': 'Knees', 'muscle-10': 'Calves', 'muscle-11': 'Forearm',
  'muscle-12': 'Forearm', 'muscle-13': 'Bicep', 'muscle-14': 'Bicep',
  'muscle-15': 'Shoulder', 'muscle-16': 'Shoulder', 'muscle-17': 'Chest',
  'muscle-18': 'Chest', 'muscle-19': 'Traps', 'muscle-20': 'Traps',
};

export default MuscleComparison;
