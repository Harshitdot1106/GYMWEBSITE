import {  useState } from 'react';
import HeroImage from '../assets/hero.jpg'
import Navbar from '../components/Header';
import harshit from "../assets/harshit.jpeg"
import suryansh from "../assets/suryansh.jpeg"
import ansh from "../assets/ansh.jpeg"
const teamMembers = [
    { name: 'Harshit Anand', role: 'Fitness Coach', image:harshit  },
    { name: 'Suryansh Bajaj', role: 'Head Coach', image: suryansh },
    { name: 'Ansh Aaditya Singh', role: 'Muscle Coach', image: ansh },
  ];
  
  const TeamMember = ({ member }: { member: { name: string; role: string; image: string } }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div
        className="relative cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img src={member.image} alt={member.name} className="w-full h-90 object-contain" />
        {isHovered && (
          <div className="absolute inset-0 bg-yellow-400 bg-opacity-90 flex flex-col items-center justify-center text-black">
            <h3 className="text-2xl font-bold">{member.name}</h3>
            <p className="text-lg">{member.role}</p>
          </div>
        )}
      </div>
    );
  };
  
  const MeetTheTeam = () => {
    return (
      <div className="bg-black text-white min-h-screen p-10">
        <Navbar currentPage='MEET THE TEAM'/>

        <h1 className="text-5xl font-bold text-center my-10 mx-12">Meet the Team</h1>
        <div className="grid grid-cols-3 gap-9 mx-1 my-24">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </div>
      </div>
    );
  };
  
  export default MeetTheTeam;
  