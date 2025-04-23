import Navbar from "../components/Header";
import dumble from '../assets/dumble.jpg'
const Aboutus = () => {
    return (
      <div className="min-h-screen relative bg-black text-white flex flex-col items-center justify-center px-6 py-1">
         <Navbar currentPage="HOME" />
        {/* Background Text */}
        <h1 className="absolute text-[8vw] font-bold uppercase text-gray-800 opacity-80 tracking-wider top-1/6 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
          WHO WE ARE
        </h1>
  
        {/* Foreground Headings */}
        <div className="relative z-10 text-center top-20 mb-10">
          <h2 className="text-2xl md:text-4xl font-bold uppercase">WHO WE ARE</h2>
        </div>
  
        {/* Main Section */}
        <div className="flex flex-col md:flex-row w-full mt-15 ">
          {/* Left Side - Image */}
          <div className="md:w-1/2 w-full mt-40 ml-30">
            <img
              src={dumble} // Make sure the path is correct
              alt="Gym Equipment"
              className="w-full h-90 object-cover"
            />
          </div>
  
          {/* Right Side - Text Content */}
          <div className="md:w-1/2 w-full flex flex-col justify-center p-6 md:p-12 mt-10 md:mt-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6"></h2>
            <p className="text-gray-300 text-lg mb-4">
              We believe Crossfitters come in all shapes and sizes. We are all on a
              journey towards our own personal best health and fitness levels. A
              journey that makes us better as athletes, friends, and people.
            </p>
            <p className="text-gray-300 text-lg mb-4">
              Our facility is unlike any other gym you’ve been to before. We pride
              ourselves not only in providing world-class CrossFit training, but we
              also believe in creating a motivating and dynamic environment. We are
              the community dedicated to your human evolution, one workout at a time.
            </p>
            <p className="text-gray-300 text-lg font-semibold">
              Come in for a free trial class! Lose some body fat, gain some friends, and
              get fit for life!
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Aboutus;
  