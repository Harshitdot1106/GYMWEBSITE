

const Header = () => {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      {/* Left Side - Logo */}
      <h1 className="text-2xl font-bold">Gym Management</h1>

      {/* Center - Navigation Links */}
      <nav className="flex space-x-6">
        <a href="#diet" className="hover:text-gray-300">Diet Plan</a>
        <a href="#attendance" className="hover:text-gray-300">Attendance</a>
        <a href="#workout" className="hover:text-gray-300">Workout Plan</a>
        <a href="#classes" className="hover:text-gray-300">Classes</a>
        <a href="#progress" className="hover:text-gray-300">Progress Tracker</a>
      </nav>

      {/* Right Side - Profile Button */}
      <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
        Profile
      </button>
    </header>
  );
};

export default Header;
