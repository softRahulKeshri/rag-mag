import React from "react";
import { UserCircleIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import CommonSidebar from "../../../components/CommonSidebar";
import { useUser } from "../../../store/useGlobalStore";
import {
  formatDisplayName,
  formatAccountText,
  createGreeting,
} from "../../../utils/textUtils";
import { Tooltip } from "../../../components/ui/Tooltip";
import type { SidebarProps, NavigationItem } from "../types/sidebar";
import { Section } from "../types/shared";

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
}) => {
  const user = useUser();
  const displayName = formatDisplayName(user?.username);

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
          {/* Enhanced Brand Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
            <p className="text-sm text-gray-500">AI-Powered Talent Discovery</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-300 ease-out group cursor-pointer ${
              activeSection === item.id
                ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg border border-purple-200/50"
                : "hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-purple-50/80 border border-transparent"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-sm font-medium transition-colors duration-300 ${
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

              {/* Active indicator */}
              {activeSection === item.id && (
                <div className="absolute right-4 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-sm" />
              )}
            </div>

            {/* Hover background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        ))}
      </nav>

      {/* User Profile Section - Consistent with other apps */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200/60">
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md p-3">
          <div className="flex items-center space-x-3">
            {/* Enhanced Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md border border-indigo-400/30">
                <UserCircleIcon className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Enhanced User Info */}
            <div className="flex-1 min-w-0">
              <Tooltip content={createGreeting(displayName)} className="block">
                <h3 className="text-sm font-semibold text-slate-800 truncate">
                  {createGreeting(displayName)}
                </h3>
              </Tooltip>
              <Tooltip
                content={formatAccountText(user?.email)}
                className="block"
              >
                <p className="text-xs text-slate-500 truncate">
                  {formatAccountText(user?.email)}
                </p>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </CommonSidebar>
  );
};

export default Sidebar;
