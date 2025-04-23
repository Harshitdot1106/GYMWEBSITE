import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Members from "./pages/members";
import Aboutus from "./pages/aboutus";
import PricingPlans from "./pages/membership";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { useState } from "react";
import HomePage from "./pages/homepage";
import ClassPage from "./pages/class";
import ClassDetails from "./pages/ClassDetails";
import MuscleComparison from "./pages/Exercise";
import MusclePage from "./pages/muscle";
import ExercisesPage from "./pages/ExercisePage";
import EquipmentPage from "./pages/Equipment";
import DietGenerator from "./pages/DietPlan";
import { User } from "./types/user";

function App() {
  const [user, setUser] = useState<User | null>(null)

  return (
   <div>
            
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/members" element={<Members setUser={setUser}/>}/>
      <Route path="/who-we-are" element={<Aboutus/>}/>
      <Route path="/memberships" element={<PricingPlans/>}/>
      <Route path="/login" element={<Login setUser={setUser}/>}/>
      <Route path="/signup" element={<Signup setUser={setUser}/>}/>
     <Route path="/home" element={<HomePage user={user} />} />
     <Route path="/class" element={<ClassPage user={user}/>} />
     <Route path="/class/:id" element={<ClassDetails />} />
     <Route path="/exercise" element={<MuscleComparison />} />
     <Route path="/muscle" element={<MusclePage/>}/>
      <Route path="/exercise/:name" element={<ExercisesPage />} />
      <Route path="/equipment" element={<EquipmentPage />} />
      <Route path="/dplan" element={<DietGenerator/>} />
console.log("User in App:", user);
    </Routes>

   </div>
  )
}

export default App
