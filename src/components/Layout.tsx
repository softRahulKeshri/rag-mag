import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
