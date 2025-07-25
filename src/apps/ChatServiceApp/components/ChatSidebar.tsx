import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import CommonSidebar from "../../../components/CommonSidebar";
import ChatListItem from "./ChatListItem";
import { UserProfile } from "./UserProfile";
import type { IChat } from "../types/types";

interface ChatSidebarProps {
  chats: IChat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  isCreatingSession?: boolean;
}

export const ChatSidebar = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  isCreatingSession = false,
}: ChatSidebarProps) => {
  return (
    <CommonSidebar className="bg-white shadow-lg border-r border-gray-200 text-gray-900">
      {/* Brand Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChatAI</h1>
            <p className="text-sm text-gray-500">AI-Powered Chat Platform</p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 ${
            isCreatingSession ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isCreatingSession ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
          <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-white border border-gray-300 text-gray-900 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 min-h-0">
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-sm">
                No chats yet. Create your first chat to get started.
              </div>
            </div>
          ) : (
            chats.map((chat: IChat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="flex-shrink-0">
        <UserProfile
          name="John Doe"
          email="john@example.com"
          plan="Free Plan"
          onSettingsClick={() => console.log("Settings clicked")}
        />
      </div>
    </CommonSidebar>
  );
};
