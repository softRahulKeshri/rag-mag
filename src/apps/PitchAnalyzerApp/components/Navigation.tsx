import {
  CloudArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
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
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen">
      {/* Brand Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {/* <div className="w-20 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div> */}
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pitch-analyzer</h1>
            <p className="text-sm text-gray-500">
              AI-powered pitch deck analysis for investors
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full relative px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center space-x-3 group
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
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <UserIcon className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Profile</p>
            <p className="text-xs text-gray-500">User Account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
