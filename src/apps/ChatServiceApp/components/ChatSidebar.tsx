import {
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { SidebarToggle } from "./SidebarToggle";
import ChatListItem from "./ChatListItem";
import type { IChat } from "../types/types";
import { CommonSidebar } from "../../../components/CommonSidebar";

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
    <CommonSidebar isCollapsed={isCollapsed}>
      {/* Header Section */}
      <div
        className={`flex-shrink-0 border-b border-gray-200 ${
          isCollapsed ? "p-4" : "p-6"
        }`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          } ${isCollapsed ? "" : "mb-4"}`}
        >
          {/* Brand Icon */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
            </div>
            {!isCollapsed && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">ChatAI</h1>
                <p className="text-sm text-gray-500">AI Conversations</p>
              </div>
            )}
          </div>

          {/* Toggle Button - Only show when not collapsed */}
          {!isCollapsed && onToggleCollapse && (
            <div className="ml-auto">
              <SidebarToggle
                isOpen={true}
                onToggle={onToggleCollapse}
                className="flex-shrink-0"
              />
            </div>
          )}
        </div>

        {/* New Chat Button - Show in both collapsed and expanded states */}
        <div className={isCollapsed ? "mt-4" : ""}>
          {isCollapsed ? (
            // Collapsed state - Icon only with enhanced tooltip
            <div className="relative group flex justify-center">
              <button
                onClick={onNewChat}
                disabled={isCreatingSession}
                className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                title={isCreatingSession ? "Creating new chat..." : "New Chat"}
                aria-label={
                  isCreatingSession ? "Creating new chat..." : "New Chat"
                }
              >
                {isCreatingSession ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PlusIcon className="h-5 w-5" />
                )}
              </button>

              {/* Enhanced Tooltip for collapsed state */}
              <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
                <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-xl border border-gray-700">
                  {isCreatingSession ? "Creating..." : "New Chat"}
                  <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45 border-l border-b border-gray-700"></div>
                </div>
              </div>
            </div>
          ) : (
            // Expanded state - Full button
            <button
              onClick={onNewChat}
              disabled={isCreatingSession}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg transition-all duration-300 text-sm font-bold bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Section */}
      {!isCollapsed && (
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
            />
          </div>
        </div>
      )}

      {/* Chat List */}
      <div
        className={`flex-1 overflow-y-auto min-h-0 ${
          isCollapsed ? "p-2" : "p-2"
        } space-y-1 scroll-smooth`}
      >
        {!isCollapsed && (
          <>
            {chats.length === 0 ? (
              <div className="text-center py-4 px-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  No conversations yet
                </h3>
                <p className="text-xs text-gray-500 mb-2 leading-relaxed">
                  Start your first AI conversation to see it appear here
                </p>
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
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex-shrink-0 ${isCollapsed ? "p-3" : "p-4"} ${
          isCollapsed ? "" : "border-t border-gray-200"
        }`}
      >
        {!isCollapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-400 font-medium">Magure.AI</p>
          </div>
        )}
      </div>

      {/* Collapse Toggle Button - Show when collapsed */}
      {isCollapsed && onToggleCollapse && (
        <div className="absolute top-3 right-3">
          <SidebarToggle
            isOpen={false}
            onToggle={onToggleCollapse}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-lg"
          />
        </div>
      )}
    </CommonSidebar>
  );
};
