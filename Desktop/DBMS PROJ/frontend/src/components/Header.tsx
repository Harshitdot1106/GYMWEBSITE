import { Link } from 'react-router-dom';

const Navbar = ({ currentPage }: { currentPage: string }) => {
  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'WHO WE ARE', path: '/who-we-are' },
    { name: 'MEET THE TEAM', path: '/members' },
   
   
  ];

  return (
    <nav className="fixed top-0 w-full text-white flex p-4 z-50">
      <div className="text-3xl flex flex-row font-bold items-center ml-12">
        <span className="text-white">IRON</span>
        <span className="bg-yellow-400 text-black px-2 ml-2">ADDICTS</span>
      </div>
      <div className='ml-44'>
        <ul className="flex space-x-18 ml-44">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`${
                  currentPage === item.path ? 'text-yellow-400' : 'text-white'
                } hover:text-yellow-400`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className='ml-59 left-12.5'>
        <button className="bg-[#d9d9d9] text-black px-5 py-2 font-semibold mr-4 hover:bg-yellow-400 hover:text-black" onClick={() => window.location.href = '/login'}>
          Login
        </button>
       
      </div>
    </nav>
  );
};

export default Navbar;