import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Note: Authentication is now handled by AuthGuard wrapper
  // This component focuses purely on layout structure

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
