import {
  CloudArrowUpIcon,
  ChatBubbleLeftRightIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import CommonSidebar from "../../../components/CommonSidebar";
import SidebarToggle from "./SidebarToggle";
import type { NavigationProps, TabId } from "../types/navigation";

interface ExtendedNavigationProps extends NavigationProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Navigation = ({
  activeTab,
  onTabChange,
  isCollapsed = false,
  onToggleCollapse,
}: ExtendedNavigationProps) => {
  const navigationItems = [
    {
      id: "upload" as TabId,
      title: "Upload Pitch",
      description: "Upload and analyze your pitch deck with AI",
      icon: CloudArrowUpIcon,
    },
    {
      id: "chat" as TabId,
      title: "Chat & Details",
      description: "AI-powered conversation and detailed insights",
      icon: ChatBubbleLeftRightIcon,
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
              <PresentationChartLineIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>

            {/* Tooltip for collapsed state */}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Pitch Analyzer
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Pitch Analyzer
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered pitch deck analysis
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
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="group relative">
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left transition-all duration-300 ease-out cursor-pointer ${
                  isCollapsed ? "p-2 rounded-lg" : "p-4 rounded-xl"
                } ${
                  activeTab === item.id
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
                      activeTab === item.id
                        ? "bg-purple-100 text-purple-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-sm font-medium transition-colors duration-300 ${
                          activeTab === item.id
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
                  {activeTab === item.id && !isCollapsed && (
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
          );
        })}
      </nav>

      {/* User Profile Section - Removed - available in navbar */}
      <div
        className={`flex-shrink-0 border-t border-gray-200/60 ${
          isCollapsed ? "p-2" : "p-4"
        }`}
      >
        {/* User profile section removed - available in navbar */}
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

export default Navigation;
