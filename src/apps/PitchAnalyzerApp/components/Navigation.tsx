import {
  CloudArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../../store/useGlobalStore";
import type { NavigationProps, TabId } from "../types/navigation";

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const user = useUser();
  const displayName = user?.username || "User";

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
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <PresentationChartLineIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pitch Analyzer</h1>
            <p className="text-sm text-gray-500">
              AI-powered pitch deck analysis
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
                w-full relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ease-out
                flex items-center space-x-3 group
                ${
                  activeTab === item.id
                    ? "text-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg border border-purple-200/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-purple-50/80 border border-transparent"
                }
              `}
            >
              <IconComponent
                className={`w-5 h-5 transition-all duration-300 ${
                  activeTab === item.id
                    ? "text-purple-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span>{item.label}</span>

              {/* Active indicator */}
              {activeTab === item.id && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse shadow-sm" />
              )}

              {/* Hover background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </button>
          );
        })}
      </div>

      {/* User Profile Section - Consistent with main navbar */}
      <div className="p-4 border-t border-gray-200/60">
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
              <h3 className="text-sm font-semibold text-slate-800 truncate">
                Hi, {displayName}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {user?.email || "User Account"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
