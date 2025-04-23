import { useState } from "react";
import { useLocation, Link } from "react-router-dom"; // Import React Router hooks
import { Home, Dumbbell, BarChart, Calendar, LogOut, User, CreditCard } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils"; // Optional utility for handling styles
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation(); // Get current path
const navigate = useNavigate(); // Initialize navigate function
  const menuItems = [
    { icon: Home, label: "Class", link: "/class" },
    { icon: Dumbbell, label: "Exercise", link: "/exercise" },
    { icon: BarChart, label: "Diet Plan", link: "/dplan" },
    { icon: Calendar, label: "Equipment", link: "/equipment" },
    { icon: User, label: "User", link: "/home",},
   {icon: CreditCard, label: "Membership", link: "/memberships"}
  ];
  const handleLogout = () => {
    alert ("Logout successful!"); // Show alert on logout
    navigate("/"); // Redirect to the landing page
    localStorage.removeItem("user"); // Clear user data from local storage
  };
  return (
    <div className={cn("h-screen bg-gray-900 text-white flex flex-col p-4 transition-all", collapsed ? "w-16" : "w-60")}>
      <button className="mb-4 text-gray-400 hover:text-white" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </button>

      <nav className="flex-1 space-y-2">
        {menuItems.map(({ icon: Icon, label, link }, idx) => (
          <TooltipProvider key={idx}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={link} // Use Link instead of <a>
                  className={cn(
                    "flex items-center space-x-3 p-3 rounded-md transition",
                    location.pathname === link ? "bg-blue-500 text-white" : "hover:bg-gray-800"
                  )}
                >
                  <Icon size={20} />
                  {!collapsed && <span>{label}</span>}
                </Link>
              </TooltipTrigger>
              {collapsed && <TooltipContent>{label}</TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>

      <div className="mt-auto">
  <button
    onClick={handleLogout}
    className="flex items-center space-x-3 p-3 rounded-md hover:bg-red-600 transition"
  >
    <LogOut size={20} />
    {!collapsed && <span>Logout</span>}
  </button>
</div>

    </div>
  );
};

export default Sidebar;
