import React from "react";


interface SidebarProps {
  activeSection: "upload" | "search" | "store";
  onSectionChange: (section: "upload" | "search" | "store") => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const navigationItems = [
    {
      id: "upload" as const,
      title: "Upload Resume",
      description: "Seamlessly import resumes with AI parsing",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      id: "search" as const,
      title: "Search Resumes",
      description: "Find perfect candidates with AI-powered search",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      id: "store" as const,
      title: "Resume Store",
      description: "Analyze talent pool with intelligent insights",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Geometric Logo */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
            <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform rotate-45 scale-75"></div>
            <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg transform rotate-45 scale-50"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
            <p className="text-sm text-gray-500">
              AI-Powered Talent Discovery Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
              activeSection === item.id
                ? "bg-gray-50 border border-blue-200 shadow-sm"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-medium ${
                    activeSection === item.id
                      ? "text-gray-900"
                      : "text-gray-700"
                  }`}
                >
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Powered by Magure.AI
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
