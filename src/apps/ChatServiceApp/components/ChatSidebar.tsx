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
    <CommonSidebar className="bg-white shadow-sm border-r border-gray-200">
      {/* Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          {/* Enhanced Brand Icon */}
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
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
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
            isCreatingSession
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
          {!isCreatingSession && <SparklesIconSolid className="h-3 w-3" />}
        </button>
      </div>

      {/* Search Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-1">
        {chats.length === 0 ? (
          <div className="text-center py-8 px-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              No conversations yet
            </h3>
            <p className="text-xs text-gray-500">
              Start your first AI conversation to see it appear here
            </p>
            <div className="mt-3 px-2 py-1 bg-emerald-50 rounded border border-emerald-200 inline-flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-700">
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
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
