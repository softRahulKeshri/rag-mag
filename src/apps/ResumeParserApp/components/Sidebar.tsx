import {
  ArrowUpTrayIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { AppSection } from "../types";
import type { AppSectionType } from "../types";

interface SidebarProps {
  activeSection: AppSectionType;
  onSectionChange: (section: AppSectionType) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const navigationItems = [
    {
      id: AppSection.UPLOAD,
      title: "Upload Resume",
      description: "Seamlessly import resumes with AI parsing",
      icon: <ArrowUpTrayIcon className="w-5 h-5" />,
    },
    {
      id: AppSection.SEARCH,
      title: "Search Resumes",
      description: "Find perfect candidates with AI-powered search",
      icon: <MagnifyingGlassIcon className="w-5 h-5" />,
    },
    {
      id: AppSection.STORE,
      title: "Resume Store",
      description: "Analyze talent pool with intelligent insights",
      icon: <ChartBarIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            {/* Geometric Logo */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform rotate-45 scale-75"></div>
              <div className="absolute inset-0 w-8 h-8 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg transform rotate-45 scale-50"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ResumeAI</h1>
              <p className="text-sm text-gray-500">
                AI-Powered Talent Discovery Platform
              </p>
            </div>
          </div>

          {/* Horizontal Navigation */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-5 h-5 ${
                    activeSection === item.id
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </div>
                <span>{item.title}</span>
                {activeSection === item.id && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Footer Info */}
          <div className="hidden lg:flex">
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
              <p className="text-xs text-gray-500">Powered by Magure.AI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
