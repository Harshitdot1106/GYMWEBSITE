import { Link } from "react-router-dom"
import Navbar from "../components/Header"
import HeroImage from '../assets/hero.jpg'

const Landing = () => {
  return (
    <div
      className="relative flex items-center justify-end text-white h-screen bg-cover"
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      <Navbar currentPage="HOME" />
      <div className="relative z-10 flex flex-col items-end pr-16 lg:pr-24 pt-18 ">
        <h1 className="text-5xl lg:text-7xl font-bold text-right">
          THE ONLY <br />
          <span className="text-yellow-400">IMPOSSIBLE</span> JOURNEY IS <br />
          THE ONE YOU <br />
          <span className="text-yellow-400">NEVER BEGIN.</span>
        </h1>
        <Link
          to="/home"
          className="mt-8 bg-yellow-400 text-black px-8 py-4 text-lg font-bold hover:bg-[#d9d9d9]"
        >
          BEGIN YOUR JOURNEY
        </Link>
         
      </div>
    </div>
  )
}

export default Landing
