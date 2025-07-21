import {
  ChartBarIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import type { ISidebarProps } from "../types";

const Sidebar = ({ activeSection, onSectionChange }: ISidebarProps) => {
  const navigationItems = [
    { id: "landing", label: "Dashboard", icon: ChartBarIcon },
    { id: "upload", label: "Upload", icon: ArrowUpTrayIcon },
    { id: "processing", label: "Processing", icon: ClockIcon },
    { id: "results", label: "Results", icon: CheckCircleIcon },
  ] as const;

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                Pitch Analyzer
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Insights</p>
            </div>
          </div>

          {/* Horizontal Navigation */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSectionChange(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Assistant Card */}
          <div className="hidden lg:flex">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BoltIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">
                    AI Assistant
                  </p>
                  <p className="text-xs text-gray-600">Get instant insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
