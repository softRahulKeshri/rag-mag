import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && currentPath !== "/login") {
      navigate("/login");
    }
  }, [currentPath, navigate]);

  const apps = [
    { name: "Resume Parser", path: "/resume-parser" },
    { name: "Pitch Analyzer", path: "/pitch-analyzer" },
    { name: "Chat Service", path: "/chat-service" },
  ];

  const handleAppChange = (path: string) => {
    window.location.pathname = path;
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      {/* Navbar */}
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

            {/* Right: Logout */}
            <div className="ml-4 flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
