import React from "react";
import Navbar from "../../components/Navbar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 *
 * Integrated admin layout that uses the main app's navbar and design system.
 * Navigation is now handled by the main navbar, providing a unified experience.
 *
 * Features:
 * - Uses main app's navbar with integrated admin navigation
 * - Double container pattern for proper max-width and centering
 * - Consistent styling with main app
 * - Responsive design with modern UI elements
 * - Proper content constraints for big screens
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Main App Navbar with integrated Admin Navigation */}
      <Navbar />

      {/* Main Content - Double Container Pattern */}
      <main className="h-[calc(100vh-5rem)] overflow-auto bg-transparent">
        {/* Outer Container - Full Width Background */}
        <div className="w-full min-h-full">
          {/* Inner Container - Constrained Width and Centered */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
