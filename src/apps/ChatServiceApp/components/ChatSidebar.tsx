import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import CommonSidebar from "../../../components/CommonSidebar";
import ChatListItem from "./ChatListItem";
import { UserProfile } from "./UserProfile";
import type { IChat } from "../types/types";

interface ChatSidebarProps {
  chats: IChat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
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
    <CommonSidebar>
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-8">
          {/* Brand Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ChatAI</h1>
            <p className="text-sm text-gray-500">AI-Powered Conversations</p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full flex items-center justify-center space-x-3 px-5 py-4 rounded-xl transition-all duration-300 text-sm font-bold ${
            isCreatingSession
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
        </button>
      </div>

      {/* Search Section */}
      <div className="flex-shrink-0 p-5 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-5 space-y-3 scroll-smooth">
        {chats.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ChatBubbleLeftRightIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Start your first AI conversation to see it appear here
            </p>
            <div className="inline-flex items-center space-x-3 px-5 py-3 bg-emerald-50 rounded-xl border border-emerald-200 shadow-lg">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-bold text-emerald-700">
                Ready to chat
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
              >
                <ChatListItem
                  chat={chat}
                  isSelected={selectedChatId === chat.id}
                  onClick={() => onSelectChat(chat.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-5 border-t border-gray-200">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
