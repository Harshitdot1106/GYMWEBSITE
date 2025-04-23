// pages/HomePage.tsx
import React from "react";
import { User } from "../types/user"; // Import the User type
import Sidebar from "../components/Sidebar"; // Adjusted import for .tsx file extension
import AttendanceTracker from "@/components/Attendace Trackers";
import AdditionalInfo from "@/components/AdditionalInfo";
import ProteinTracker from "@/components/ProteinTracker";
import ClassesJoined from "@/components/ClassJoined";

interface HomePageProps {
  user: User | null; // Allowing the user to be null initially
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  
  if (!user) {
    // If there's no user, return a message or redirect to login
    return (
      <div>
        <h1>Please log in to view your profile.</h1>
      </div>
    );
  }
console.log("User in HomePage:", user); // Log the user object to check its structure
  return (
    <div>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-semibold">{user.MNAME}</h1>
            </div>
            <p className="mt-2 text-lg">{user.MEMAIL}</p>
            <p className="mt-2 text-lg">{user.MEMBERSHIPID}</p>
            

            
          </div>

          {user?.MEMAIL && <ClassesJoined email={user?.MEMAIL} />}

  <AdditionalInfo  email={user.MEMAIL}/>    
       <ProteinTracker email={user.MEMAIL}/>
    <div className="bg-white p-6 rounded-lg shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Attendance Tracker</h2>
      <AttendanceTracker email={user.MEMAIL} />
    </div>

        </div>
      </div>
    </div>
    
  );
};

export default HomePage;
