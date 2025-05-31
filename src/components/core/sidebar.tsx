import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../lib/auth-context";
import ToggleMode from "./toggle-mode";

export default function Sidebar() {
  const { setIsAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem("user");
      setIsAuthenticated(false);
      setLoading(false);
      setTimeout(() => {
        navigate('/sign-in');
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  };
  return (
    <section className="w-54 flex flex-col rounded-xl border border-pre h-full p-2">
      <p className="rounded-xl p-4 bg-[#930938]/20 text-xl font-semibold">Bruno admin</p>
      <div className="mt-6 h-full">
        <p className="font-semibold text-[#930938] ml-2">Dashboard</p>
        <ul className="mt-2 text-lg space-y-2 ">
          <li className="w-full">
            <Link
              className={
                `px-2 py-1 flex rounded-md hover:bg-[#93093840] cursor-pointer transition-all duration-300 ${
                  location.pathname === "/dashboard" ||
                  location.pathname === "/dashboard/blogs"
                    ? "bg-[#93093840]"
                    : ""}
                  `
              }
              to="/dashboard/blogs">Blogs
            </Link>
          </li>
          <li className="w-full">
            <Link
              className={
                `px-2 py-1 flex rounded-md hover:bg-[#93093840] cursor-pointer transition-all duration-300 ${
                  location.pathname === "/dashboard/courses"
                    ? "bg-[#93093840]"
                    : ""}
                  `
              }
              to="/dashboard/courses">Courses</Link>
          </li>
          <li className="w-full">
            <Link
              className={
                `px-2 py-1 flex rounded-md hover:bg-[#93093840] cursor-pointer transition-all duration-300 ${
                  location.pathname === "/dashboard/settings"
                    ? "bg-[#93093840]"
                    : ""}
                  `
              }
              to="/dashboard/settings">Settings</Link>
          </li>
        </ul>
      </div>
      <button
          className="py-2 px-4 hover:bg-[#93093840] rounded-md text-start text-lg w-full"
          onClick={handleLogout} // Add the onClick handler
        >
          {loading ? "logging out..." :"logout"} 
        </button>
        <ToggleMode />


    </section>
  )
}
