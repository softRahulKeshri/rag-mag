import {
  CloudArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { NavigationProps, TabId } from "../types/navigation";

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const navigationItems = [
    {
      id: "upload" as TabId,
      label: "Upload Pitch",
      icon: CloudArrowUpIcon,
      path: "/upload",
    },
    {
      id: "bookmarked" as TabId,
      label: "Bookmarked",
      icon: BookmarkIcon,
      path: "/bookmarked",
    },
    {
      id: "chat" as TabId,
      label: "Chat & Details",
      icon: ChatBubbleLeftRightIcon,
      path: "/chat",
    },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBarIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Pitch-analyzer
                </h1>
                <p className="text-sm text-gray-500">
                  AI-powered pitch deck analysis for investors
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    relative px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center space-x-2.5 group
                    ${
                      activeTab === item.id
                        ? "text-blue-600 bg-blue-50 border border-blue-200 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                    }
                  `}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      activeTab === item.id
                        ? "text-blue-600"
                        : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                  <span>{item.label}</span>

                  {/* Active indicator */}
                  {activeTab === item.id && (
                    <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
