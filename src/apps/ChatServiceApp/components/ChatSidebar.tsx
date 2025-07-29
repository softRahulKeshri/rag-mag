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
    <CommonSidebar className="bg-gradient-to-b from-slate-50/80 via-white to-slate-50/60">
      {/* Enhanced Header Section */}
      <div className="flex-shrink-0 p-6 border-b border-slate-200/60">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">ChatAI</h1>
              <p className="text-xs text-slate-500 font-medium">
                AI-Powered Conversations
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced New Chat Button */}
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl transition-all duration-500 transform-gpu ${
            isCreatingSession
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-600 hover:via-purple-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"
          }`}
        >
          <PlusIcon className="h-5 w-5" />
          <span className="font-semibold text-sm">
            {isCreatingSession ? "Creating..." : "New Chat"}
          </span>
          {!isCreatingSession && (
            <SparklesIconSolid className="h-4 w-4 animate-pulse" />
          )}
        </button>
      </div>

      {/* Enhanced Search Section */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200/40">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-300/60 transition-all duration-300 shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Enhanced Chat List */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-2">
        {chats.length === 0 ? (
          <div className="text-center py-12">
            <div className="relative w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-slate-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-slate-300 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-sm font-semibold text-slate-600 mb-2">
              No chats yet
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Start your first conversation to see it here
            </p>
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
      <div className="flex-shrink-0 p-4 border-t border-slate-200/60">
        <UserProfile />
      </div>
    </CommonSidebar>
  );
};
