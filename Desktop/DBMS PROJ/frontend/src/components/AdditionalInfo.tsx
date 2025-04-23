import React, { useEffect, useState } from "react";
import axios from "axios";

type Info = {
  HEIGHT: string;
  WEIGHT: string;
  BMI: string;
  AGE: number;
  GENDER: string;
  BFI: string;
};

type Props = {
  email: string;
};

const AdditionalInfo: React.FC<Props> = ({ email }) => {
  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState<Info>({
    HEIGHT: "",
    WEIGHT: "",
    BMI: "",
    AGE: 0,
    GENDER: "",
    BFI: "",
  });

  useEffect(() => {
    const fetchAdditionalInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:300/api/info/${email}`);
        if (response.data) {
          setInfo(response.data);
        } else {
          setInfo(null);
        }
      } catch (err) {
        console.log("No existing data, form will show.");
        setInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (email) fetchAdditionalInfo();
  }, [email]);

  const calculateBMI = (height: number, weight: number): string => {
    if (!height || !weight) return "";
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    return bmi.toFixed(2);
  };

  const calculateBFI = (bmi: number, age: number, gender: string): string => {
    if (!bmi || !age || !gender) return "";
    const genderFactor = gender === "MALE" ? 1 : gender === "FEMALE" ? 0 : 0.5;
    const bfi = (1.2 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
    return bfi.toFixed(2);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };

    // Auto-calculate BMI and BFI
    const height = parseFloat(updatedForm.HEIGHT);
    const weight = parseFloat(updatedForm.WEIGHT);
    const age = parseInt(updatedForm.AGE.toString());
    const gender = updatedForm.GENDER;

    const bmi = calculateBMI(height, weight);
    const bfi = bmi ? calculateBFI(parseFloat(bmi), age, gender) : "";

    updatedForm.BMI = bmi;
    updatedForm.BFI = bfi;

    setForm(updatedForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:300/api/info`, { ...form, EMAIL: email });
      alert("Information submitted successfully!");
      setInfo(form);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to submit info:", err);
      setError("Submission failed.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-xl font-bold mb-4">Your Additional Information</h2>

      {info && !editMode ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div><strong>Height:</strong> {info.HEIGHT} cm</div>
            <div><strong>Weight:</strong> {info.WEIGHT} kg</div>
            <div><strong>BMI:</strong> {info.BMI}</div>
            <div><strong>BFI:</strong> {info.BFI}</div>
            <div><strong>Age:</strong> {info.AGE}</div>
            <div><strong>Gender:</strong> {info.GENDER}</div>
          </div>
          <button
            onClick={() => {
              setForm(info);
              setEditMode(true);
            }}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Edit Info
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold">Height (cm)</label>
            <input
              name="HEIGHT"
              type="number"
              value={form.HEIGHT}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Weight (kg)</label>
            <input
              name="WEIGHT"
              type="number"
              value={form.WEIGHT}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Age</label>
            <input
              name="AGE"
              type="number"
              value={form.AGE}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block font-semibold">Gender</label>
            <select
              name="GENDER"
              value={form.GENDER}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold">Calculated BMI</label>
            <input value={form.BMI} readOnly className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <div>
            <label className="block font-semibold">Calculated BFI</label>
            <input value={form.BFI} readOnly className="w-full border p-2 rounded bg-gray-100" />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Info
          </button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      )}
    </div>
  );
};

export default AdditionalInfo;
