import {
  CloudArrowUpIcon,
  BookmarkIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  PresentationChartLineIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../../store/useGlobalStore";
import CommonSidebar from "../../../components/CommonSidebar";
import {
  formatDisplayName,
  formatAccountText,
  createGreeting,
} from "../../../utils/textUtils";
import { Tooltip } from "../../../components/ui/Tooltip";
import type { NavigationProps, TabId } from "../types/navigation";

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const user = useUser();
  const displayName = formatDisplayName(user?.username);

  const navigationItems = [
    {
      id: "upload" as TabId,
      title: "Upload Pitch",
      description: "Upload and analyze your pitch deck with AI",
      icon: CloudArrowUpIcon,
    },
    {
      id: "bookmarked" as TabId,
      title: "Bookmarked",
      description: "Access your saved pitch decks for quick analysis",
      icon: BookmarkIcon,
    },
    {
      id: "chat" as TabId,
      title: "Chat & Details",
      description: "AI-powered conversation and detailed insights",
      icon: ChatBubbleLeftRightIcon,
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

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
        {navigationItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full text-left p-4 rounded-lg transition-all duration-200 group cursor-pointer ${
                activeTab === item.id
                  ? "bg-blue-50 border border-blue-200 shadow-sm"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200 ${
                    activeTab === item.id
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className={`text-sm font-medium transition-colors duration-200 ${
                      activeTab === item.id ? "text-gray-900" : "text-gray-700"
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
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
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

export default Navigation;
