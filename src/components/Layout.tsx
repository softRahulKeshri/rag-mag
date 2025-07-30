import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Note: Authentication is now handled by AuthGuard wrapper
  // This component focuses purely on layout structure

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      <Navbar />

      {/* Main content - takes remaining height and allows scrolling */}
      <main className="flex-1 min-h-0 overflow-auto">{children}</main>
    </div>
  );
};

export default Layout;
