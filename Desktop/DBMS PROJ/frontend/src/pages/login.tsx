import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: (user: any) => void;
}

export default function Login({ setUser }: LoginProps) {
  const navigate = useNavigate();
  const [memail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:300/api/member/login", { memail, password });
      console.log("Login Response:", response.data);
      if (response) {
        console.log("Login successful:", response.data);
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data in local storage
        console.log("User set:", response.data.user);
        console.log("User ", response.data);
        alert("Login successful!");
        navigate("/home"); // Redirect to HomePage
      } else {
        console.log("Login failed:", response);
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="bg-gray-800 p-8 rounded-xl shadow-md w-96">
        <h2 className="text-white text-2xl font-semibold text-center mb-4">Log in</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              value={memail}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
          >
            Log in
          </button>
        </form>
        <div className="text-center mt-4 text-gray-400 text-sm">
          <button  onClick={()=>{alert("Please contact admin")}} className="hover:underline">Forgot your password?</button>
        </div>
        <div className="text-center mt-2 text-gray-400 text-sm">
          First time here? <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
}
