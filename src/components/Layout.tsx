import React from 'react';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const apps = [
    { name: 'Resume Parser', path: '/resume-parser' },
    { name: 'Pitch Analyzer', path: '/pitch-analyzer' },
    { name: 'Chat Service', path: '/chat-service' },
  ];

  const handleAppChange = (path: string) => {
    window.location.pathname = path;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <button
                onClick={() => handleAppChange('/')}
                className={`text-xl font-bold text-gray-900 hover:text-indigo-600 cursor-pointer ${
                  currentPath === '/' ? 'text-indigo-600' : ''
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
                      ? 'text-indigo-600' 
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {app.name}
                </button>
              ))}
            </div>

            {/* Right: Username */}
            <div className="flex-shrink-0">
              <span className="text-sm text-gray-700 cursor-pointer">Shahil</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
