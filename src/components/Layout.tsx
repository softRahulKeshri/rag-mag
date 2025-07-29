import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsAuthenticated } from "../store";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (
      !isAuthenticated &&
      currentPath !== "/login" &&
      currentPath !== "/signup"
    ) {
      navigate("/login");
    }
  }, [isAuthenticated, currentPath, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
