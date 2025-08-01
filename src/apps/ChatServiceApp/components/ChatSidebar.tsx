import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { SidebarToggle } from "./SidebarToggle";
import ChatListItem from "./ChatListItem";
import { UserProfile } from "./UserProfile";
import type { IChat } from "../types/types";

interface ChatSidebarProps {
  chats: IChat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  isCreatingSession?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ChatSidebar = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  isCreatingSession = false,
  isCollapsed = false,
  onToggleCollapse,
}: ChatSidebarProps) => {
  return (
    <div
      className={`bg-white/90 backdrop-blur-sm border-r border-white/50 h-full flex flex-col shadow-xl overflow-hidden transition-all duration-300 ${
        isCollapsed ? "w-14" : "w-64"
      }`}
    >
      {/* Header Section */}
      <div className="flex-shrink-0 p-3 border-b border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } mb-4`}
        >
          {/* Brand Icon */}
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="relative group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full border border-white"></div>

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  ChatAI
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">ChatAI</h1>
                <p className="text-xs text-gray-500">AI Conversations</p>
              </div>
            )}
          </div>

          {/* Toggle Button - Only show when not collapsed */}
          {!isCollapsed && onToggleCollapse && (
            <div className="group relative">
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

        {/* New Chat Button */}
        <div className="group relative">
          <button
            onClick={onNewChat}
            disabled={isCreatingSession}
            className={`w-full flex items-center justify-center ${
              isCollapsed ? "px-2" : "space-x-2 px-3"
            } py-2.5 rounded-lg transition-all duration-300 text-sm font-bold ${
              isCreatingSession
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
            }`}
            title={isCollapsed ? "New Chat" : undefined}
          >
            <PlusIcon className="h-4 w-4" />
            {!isCollapsed && (
              <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
            )}
          </button>

          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              {isCreatingSession ? "Creating..." : "New Chat"}
              <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-3 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto min-h-0 ${
          isCollapsed ? "p-2" : "p-3"
        } space-y-2 scroll-smooth`}
      >
        {chats.length === 0 ? (
          <div className={`text-center ${isCollapsed ? "py-4" : "py-8"} px-2`}>
            {!isCollapsed ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  Start your first AI conversation to see it appear here
                </p>
                <div className="inline-flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-200 shadow-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-bold text-emerald-700">
                    Ready to chat
                  </span>
                </div>
              </>
            ) : (
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                <ChatListItem
                  chat={chat}
                  isSelected={selectedChatId === chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  isCollapsed={isCollapsed}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex-shrink-0 ${
          isCollapsed ? "p-2" : "p-3"
        } border-t border-gray-200`}
      >
        <UserProfile isCollapsed={isCollapsed} />
      </div>

      {/* Collapse Toggle Button - Show when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="absolute top-2 right-2 group">
          <SidebarToggle
            isOpen={false}
            onToggle={onToggleCollapse}
            className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg"
          />

          {/* Tooltip */}
          <div className="absolute right-full mr-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            Expand sidebar
            <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
};
