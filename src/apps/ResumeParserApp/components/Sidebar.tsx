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
import SidebarToggle from "./SidebarToggle";
import type { SidebarProps, NavigationItem } from "../types/sidebar";
import { Section } from "../types/shared";

interface ExtendedSidebarProps extends SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<ExtendedSidebarProps> = ({
  activeSection,
  onSectionChange,
  isCollapsed = false,
  onToggleCollapse,
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
    <CommonSidebar isCollapsed={isCollapsed}>
      {/* Logo Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          {/* Enhanced Brand Icon */}
          <div className="relative group">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <DocumentTextIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                ResumeAI
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">ResumeAI</h1>
              <p className="text-sm text-gray-500">
                AI-Powered Talent Discovery
              </p>
            </div>
          )}

          {/* Toggle Button - Only show when not collapsed */}
          {!isCollapsed && onToggleCollapse && (
            <div className="group relative ml-auto">
              <SidebarToggle
                isOpen={true}
                onToggle={onToggleCollapse}
                className="flex-shrink-0"
              />

              {/* Tooltip */}
              <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Collapse sidebar
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav
        className={`flex-1 overflow-y-auto min-h-0 ${
          isCollapsed ? "p-2" : "p-4"
        } space-y-2`}
      >
        {navigationItems.map((item) => (
          <div key={item.id} className="group relative">
            <button
              onClick={() => onSectionChange(item.id)}
              className={`w-full text-left transition-all duration-300 ease-out cursor-pointer ${
                isCollapsed ? "p-2 rounded-lg" : "p-4 rounded-xl"
              } ${
                activeSection === item.id
                  ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg border border-purple-200/50"
                  : "hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-purple-50/80 border border-transparent"
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              <div
                className={`flex items-start ${
                  isCollapsed ? "justify-center" : "space-x-3"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    activeSection === item.id
                      ? "bg-purple-100 text-purple-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {item.icon}
                </div>

                {!isCollapsed && (
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
                )}

                {/* Active indicator */}
                {activeSection === item.id && !isCollapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-sm" />
                )}
              </div>

              {/* Hover background effect */}
              {!isCollapsed && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              )}
            </button>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.title}
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section - Consistent with other apps */}
      <div
        className={`flex-shrink-0 border-t border-gray-200/60 ${
          isCollapsed ? "p-2" : "p-4"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-md p-3">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            {/* Enhanced Avatar */}
            <div className="flex-shrink-0 group relative">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md border border-indigo-400/30">
                <UserCircleIcon className="h-5 w-5 text-white" />
              </div>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {createGreeting(displayName)}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>

            {/* Enhanced User Info */}
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <Tooltip
                  content={createGreeting(displayName)}
                  className="block"
                >
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
            )}
          </div>
        </div>
      </div>

      {/* Collapse Toggle Button - Show when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="absolute top-2 right-2 group">
          <SidebarToggle
            isOpen={false}
            onToggle={onToggleCollapse}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg"
          />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Expand sidebar
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      )}
    </CommonSidebar>
  );
};

export default Sidebar;
