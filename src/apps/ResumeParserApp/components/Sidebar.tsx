import React from "react";
import CommonSidebar from "../../../components/CommonSidebar";
import type { SidebarProps, NavigationItem } from "../types/sidebar";
import { Section } from "../types/shared";

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: Section.UPLOAD,
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
      id: Section.SEARCH,
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
      id: Section.STORE,
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
    <CommonSidebar>
      {/* Logo Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Magure.AI Logo */}
          <div className="flex-shrink-0">
           
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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
              activeSection === item.id
                ? "bg-blue-50 border border-blue-200 shadow-sm"
                : "hover:bg-gray-50 border border-transparent"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-medium transition-colors duration-200 ${
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
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Powered by Magure.AI
        </p>
      </div>
    </CommonSidebar>
  );
};

export default Sidebar;
