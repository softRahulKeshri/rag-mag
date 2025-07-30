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
    <CommonSidebar className="bg-white shadow-sm border-r border-gray-100">
      {/* Header Section */}
      <div className="flex-shrink-0 p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse border border-white"></div>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">ChatAI</h1>
              <p className="text-xs text-gray-500">AI-Powered Conversations</p>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
            isCreatingSession
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          <PlusIcon className="h-4 w-4" />
          <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
          {!isCreatingSession && <SparklesIconSolid className="h-3 w-3" />}
        </button>
      </div>

      {/* Search Section */}
      <div className="flex-shrink-0 p-3 border-b border-gray-100">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-1">
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
            <div className="mt-3 px-2 py-1 bg-blue-50 rounded border border-blue-200 inline-flex items-center space-x-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-blue-700">
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
      <div className="flex-shrink-0 p-3 border-t border-gray-100">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
