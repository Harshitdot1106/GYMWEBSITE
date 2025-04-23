import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";

// Dummy data for now — replace with backend call if needed
const classes = [
  {
    classid: 1,
    class_name: "Power Yoga",
    time: "9:00 AM",
    description: "Power Yoga is a dynamic and physically intensive style of yoga that builds strength, flexibility, and endurance. This fast-paced class combines traditional yoga poses with continuous movement and breath control, offering a full-body workout that enhances both mental focus and physical balance.",
    thumbnail:
      "https://www.fit19.com/hubfs/GallerySliderImages-804x526px-01.png",
  },
  {
    classid: 2,
    class_name: "HIIT (High-Intensity Interval Training)",
    time: "11:00 AM",
    description: "HIIT is a high-energy class that alternates between short bursts of intense exercise and brief recovery periods. Designed to maximize calorie burn and boost cardiovascular health in a short amount of time, HIIT is perfect for anyone looking to challenge themselves and see quick results.",
    thumbnail:
      "https://www.fit19.com/hubfs/GallerySliderImages-804x526px-01.png",
  },
];
const ClassDetailsPage = () => {
  const { id} = useParams();
  const classItem = classes.find((item) => item.classid === parseInt(id!));

  if (!classItem) return <div>Class not found.</div>;

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="w-full p-6 bg-gray-100">
        <h1 className="text-4xl font-bold mb-4">{classItem.class_name}</h1>
        <img
          src={classItem.thumbnail}
          alt={classItem.class_name}
          className="w-full max-w-md h-64 object-cover rounded mb-4"
        />
        <p className="text-xl text-gray-700 mb-2">Time: {classItem.time}</p>
        <p className="text-lg text-gray-600">{classItem.description}</p>
      </div>
    </div>
  );
};

export default ClassDetailsPage;
