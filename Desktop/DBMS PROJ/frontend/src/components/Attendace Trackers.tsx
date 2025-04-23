import React, { useEffect, useState } from 'react';
import axios from 'axios';

const getDaysInMonth = (month: number, year: number) => {
  const date = new Date(Date.UTC(year, month, 1));
  const days = [];
  while (date.getUTCMonth() === month) {
    days.push(new Date(date));
    date.setUTCDate(date.getUTCDate() + 1);
  }
  return days;
};

interface AttendanceRecord {
  DAY: string;      // 'YYYY-MM-DD'
  STATUS: 'Present' | 'Absent';
}

const AttendanceTracker = ({ email }: { email: string }) => {
  console.log('email', email);
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const days = getDaysInMonth(month, year);

  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [selectedDate, setSelectedDate] = useState('');
  const [status, setStatus] = useState<'Present' | 'Absent'>('Present');
  const [loading, setLoading] = useState(true);

  // Load existing records on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get<AttendanceRecord[]>(`http://localhost:300/api/attendance/${email}`);
        const map: Record<string, 'Present' | 'Absent'> = {};
        res.data.forEach(r => { map[r.DAY] = r.STATUS; });
        setAttendance(map);
      } catch (e) {
        console.error('Error fetching attendance', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  const handleSubmit = async () => {
    if (!selectedDate) return;
    try {
      await axios.post('http://localhost:300/api/attendance', {
        email,
        currentDate: selectedDate,
        status
      });
      setAttendance(prev => ({ ...prev, [selectedDate]: status }));
    } catch (e) {
      console.error('Error saving attendance', e);
    }
  };

  const formatDate = (d: Date) => d.toISOString().split('T')[0];

  if (loading) return <p>Loading attendance…</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Attendance Tracker</h1>

      <div className="mb-6 flex gap-4 items-center flex-wrap justify-center">
        <input
          type="date"
          className="border p-2 rounded"
          value={selectedDate}
          onChange={e => setSelectedDate(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={status}
          onChange={e => setStatus(e.target.value as 'Present' | 'Absent')}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="font-semibold">{d}</div>)}
        {Array(days[0].getDay()).fill('').map((_,i) => <div key={i} />)}
        {days.map(day => {
          const key = formatDate(day);
          const bg =
            attendance[key] === 'Present' ? 'bg-green-400' :
            attendance[key] === 'Absent'  ? 'bg-red-400' :
            'bg-gray-300';
          return (
            <div key={key} className={`p-3 rounded text-white ${bg}`}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AttendanceTracker;
