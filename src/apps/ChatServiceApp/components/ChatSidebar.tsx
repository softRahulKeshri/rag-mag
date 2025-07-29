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
    <CommonSidebar className="bg-gradient-to-b from-white via-[#FFFFFF] to-[#F5F5F5] border-r border-[#EAEAEC] shadow-xl">
      {/* Enhanced Header Section */}
      <div className="flex-shrink-0 p-8 border-b border-[#EAEAEC] bg-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative w-14 h-14 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-2xl flex items-center justify-center shadow-xl">
              <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#41E6F8] rounded-full animate-pulse border-2 border-white shadow-md"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#2E3141] tracking-tight">
                ChatAI
              </h1>
              <p className="text-sm text-[#6D6F7A] font-semibold">
                AI-Powered Conversations
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full flex items-center justify-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
            isCreatingSession
              ? "bg-[#EAEAEC] text-[#9698A0] cursor-not-allowed"
              : "bg-gradient-to-r from-[#3077F3] to-[#B96AF7] hover:from-[#1E50A8] hover:to-[#9D58E5] text-white hover:scale-105 transform"
          }`}
        >
          <PlusIcon className="h-6 w-6" />
          <span className="font-semibold text-base">
            {isCreatingSession ? "Creating..." : "New Chat"}
          </span>
          {!isCreatingSession && (
            <SparklesIconSolid className="h-5 w-5 animate-pulse" />
          )}
        </button>
      </div>

      {/* Enhanced Search Section */}
      <div className="flex-shrink-0 p-6 border-b border-[#F5F5F5] bg-gradient-to-b from-white to-[#FFFFFF]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#9698A0]" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-12 pr-4 py-4 bg-[#F5F5F5] border border-[#EAEAEC] rounded-2xl text-sm text-[#2E3141] placeholder-[#9698A0] focus:outline-none focus:ring-2 focus:ring-[#3077F3] focus:ring-opacity-20 focus:border-[#3077F3] focus:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Enhanced Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-gradient-to-b from-[#FFFFFF] to-[#F5F5F5]">
        {chats.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="relative w-20 h-20 bg-gradient-to-br from-[#EAEAEC] to-[#D5D6D9] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ChatBubbleLeftRightIcon className="h-10 w-10 text-[#9698A0]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#F5F5F5] rounded-full border border-[#D5D6D9]"></div>
            </div>
            <h3 className="text-lg font-semibold text-[#2E3141] mb-3">
              No conversations yet
            </h3>
            <p className="text-sm text-[#6D6F7A] leading-relaxed max-w-xs mx-auto">
              Start your first AI conversation to see it appear here
            </p>
            <div className="mt-6 px-4 py-2 bg-[#3077F3] bg-opacity-10 rounded-full border border-[#3077F3] border-opacity-20 inline-flex items-center space-x-2">
              <div className="w-2 h-2 bg-[#3077F3] rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-[#3077F3]">
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

      {/* Enhanced Footer */}
      <div className="flex-shrink-0 p-6 border-t border-[#EAEAEC] bg-white">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
