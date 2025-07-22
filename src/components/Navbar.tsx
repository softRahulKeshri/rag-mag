import { useLocation, useNavigate } from "react-router-dom";
import { apps } from "../constants";
import { UserCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleAppChange = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleAppChange("/")}
              className={`text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer ${
                currentPath === "/" ? "text-indigo-600" : ""
              }`}
            >
              Magure
            </button>
          </div>

          {/* Center: App Links */}
          <div className="hidden sm:ml-6 sm:flex space-x-8">
            {apps.map((app) => (
              <button
                key={app.name}
                onClick={() => handleAppChange(app.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                  currentPath.startsWith(app.path)
                    ? "text-indigo-600"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {app.name}
              </button>
            ))}
          </div>

          {/* Right: User Menu */}
          <div className="ml-4 flex items-center relative">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none cursor-pointer"
              >
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span>Profile</span>
                <ChevronDownIcon className="h-4 w-4" />  
              </button>

              {/* Dropdown menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={() => {
                      handleAppChange("/profile");
                      setIsProfileOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    View Profile
                  </button>

                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Click outside to close */}
            {isProfileOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
