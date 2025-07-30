import {
  MagnifyingGlassIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesIconSolid } from "@heroicons/react/24/solid";
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
    <CommonSidebar className="bg-white/90 backdrop-blur-sm shadow-xl border-r border-white/50">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3 mb-6">
          {/* Enhanced Brand Icon */}
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl border border-indigo-400/30">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse border-2 border-white shadow-sm"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ChatAI
            </h1>
            <p className="text-sm text-gray-600 font-medium">
              AI-Powered Conversations
            </p>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
            isCreatingSession
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
          {!isCreatingSession && <SparklesIconSolid className="h-4 w-4" />}
        </button>
      </div>

      {/* Search Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50/80 backdrop-blur-sm border border-gray-200/50 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Start your first AI conversation to see it appear here
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-full border border-emerald-200 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-emerald-700">
                Ready to chat
              </span>
            </div>
          </div>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onSelectChat(chat.id)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200/50">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
