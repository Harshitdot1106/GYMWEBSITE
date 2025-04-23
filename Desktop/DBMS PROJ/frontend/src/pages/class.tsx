import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { User } from "@/types/user";


interface HomePageProps {
  user: User | null; // Allowing the user to be null initially
}

const Class = ({ user }: HomePageProps) => {
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:300/api/class")
      .then((response) => {
        console.log("Response:", response);
        console.log("Fetched classes:", response.data);
        console.log("User:", user);
        setClasses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
      });
  }, []);
  console.log("User:", user);
  const handleClick = async (classId: string) => {
    console.log("Class I:", classId);
    
   // Log the user to check its structure
    if (!user || !user.MEMAIL) {
      alert("Please log in first.");
      return;
    }
    console.log()
  console.log("User email:", user.MEMAIL); // Log the user email to check its structure
    console.log("User in handleClick:", user); // Log the user object to check its structure
    try {
      axios.post("http://localhost:300/api/class/join", {
        classId:String(classId),
        email: user.MEMAIL, // Sending email from the user prop
      })
      .then((response) => {
        console.log( response.data);
        alert(response.data.message); // Display the response message
        // You can redirect or update UI here after joining
      })
      
    } catch(error) {
      console.error("Error joining class:", error);
    };
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full px-10 py-8 bg-gray-100 overflow-auto">
        <h1 className="text-4xl font-bold mb-6">Most Popular Classes</h1>
        <p className="text-gray-600 mb-10 text-lg">
          Explore our most popular classes, learn new skills and grow your knowledge.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem: any) => (
            <div
              key={classItem.CLASSID}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
            >
              <div className="relative">
                <img
                  src={classItem.THUMNAIL}
                  alt={classItem.CLASSNAME}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold shadow">
                  ⭐ Popular
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
              <img src="https://img.icons8.com/ios/50/000000/iron-addicts.png"        alt="Iron Addicts"
                      className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-gray-700">Iron Addicts</span>
                  </div>
                  <h2 className="text-lg font-bold mt-2">{classItem.CLASSNAME}</h2>
                  <p className="text-sm text-gray-600 mb-1">{classItem.TIME}</p>
                  <p className="text-sm text-gray-500">{classItem.DESCRIPTION}</p>
                  <div></div>
                  <p className="text-sm text-gray-500 mt-1"> With Trainer {classItem.TRAINER}</p>
                </div>
                <button
                  onClick={() => handleClick(classItem.CLASSID)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium"
                >
                  Join Class
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Class;
