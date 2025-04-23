import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ClassesJoinedProps = {
  email: string;
};

const ClassesJoined = ({ email }: ClassesJoinedProps) => {
  const [joinedClasses, setJoinedClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;

    const fetchClasses = async () => {
      try {
        setLoading(true);

        const response = await axios.post('http://localhost:300/api/class/joined', {
          email,
        });

        setJoinedClasses(response.data);
      } catch (err) {
        console.error('Error fetching classes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [email]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Classes Joined</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : joinedClasses.length > 0 ? (
        <ul className="space-y-2">
          {joinedClasses.map((cls, index) => (
            <li key={index} className="p-4 border rounded-md shadow-sm">
              <p className="font-semibold">{cls.CLASSNAME}</p>
              <p className="text-sm text-gray-600">Instructor: {cls.INSTRUCTOR}</p>
              <p className="text-sm text-gray-600">Time: {cls.TIME}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No classes joined yet.</p>
      )}
    </div>
  );
};

export default ClassesJoined;
