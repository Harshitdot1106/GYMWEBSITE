import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
interface SignupProps {
  setUser: (user: any) => void;
}

export default function Signup({ setUser }: SignupProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mname: "",
    memail: "",
    password: "",
   
    // Will be formatted before submission
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    try {
      const formattedData = {
        ...formData,
       
      };
      console.log("Formatted Data:", formattedData);
      const response = await axios.post("http://localhost:300/api/member/createMember", formattedData);
      console.log("Signup Success:", response.data);
      setUser(response.data.user);
      console.log("User data:", response.data.user);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="mname"
            placeholder="Name"
            value={formData.mname}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 text-white rounded-md focus:outline-none"
            required
          />
          <input
            type="email"
            name="memail"
            placeholder="Email"
            value={formData.memail}
            onChange={handleChange}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded-md focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mt-4 bg-gray-700 text-white rounded-md focus:outline-none"
            required
          />
          
        
          <button
            type="submit"
            className="w-full mt-6 p-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
          >
            Continue
          </button>
        </form>
        <p className="text-gray-400 text-center mt-4">
          Already have an account? <a href="/login" className="text-red-400">Log in!</a>
        </p>
      </div>
    </div>
  );
}
