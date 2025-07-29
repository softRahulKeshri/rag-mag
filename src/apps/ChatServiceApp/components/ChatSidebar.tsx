import {
  MagnifyingGlassIcon,
  PlusIcon,
  SparklesIcon,
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
    <CommonSidebar className="bg-gradient-to-b from-[#FAFAFA] via-white to-[#F8F9FA] border-r border-[#EAEAEC]/50 animate-slide-in-left shadow-xl">
      {/* Premium Brand Section */}
      <div className="flex-shrink-0 p-6 border-b border-[#EAEAEC]/50 animate-fade-in">
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#3077F3] rounded-2xl flex items-center justify-center hover-glow transition-all duration-500 hover:scale-110 shadow-lg shadow-[#3077F3]/20">
              <svg
                className="w-7 h-7 text-white transition-transform duration-500 group-hover:rotate-12"
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
            {/* Animated sparkles */}
            <div
              className="absolute -top-1 -right-1 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            >
              <SparklesIcon
                className="h-4 w-4 text-[#B96AF7] animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <div
              className="absolute -bottom-1 -left-1 animate-bounce"
              style={{ animationDelay: "1s" }}
            >
              <SparklesIcon
                className="h-3 w-3 text-[#3077F3] animate-spin"
                style={{ animationDuration: "4s" }}
              />
            </div>
            <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-[#3077F3]/20 to-[#B96AF7]/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="animate-fade-in stagger-1">
            <h1 className="text-xl font-bold text-[#2E3141] transition-all duration-300 hover:text-[#3077F3] bg-gradient-to-r from-[#3077F3] to-[#B96AF7] bg-clip-text text-transparent">
              ChatAI
            </h1>
            <p className="text-xs text-[#82838D] animate-pulse-gentle font-medium">
              AI-Powered Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Premium New Chat Button */}
      <div className="flex-shrink-0 p-4 animate-fade-in stagger-2">
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full bg-gradient-to-br from-[#3077F3] via-[#1E50A8] to-[#3077F3] hover:from-[#1E50A8] hover:via-[#3077F3] hover:to-[#1E50A8] text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-500 flex items-center justify-center space-x-3 btn-primary hover-lift focus-ring-brand shadow-lg hover:shadow-2xl hover:shadow-[#3077F3]/30 ${
            isCreatingSession
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105"
          }`}
        >
          {isCreatingSession ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-1"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-2"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-3"></div>
            </>
          ) : (
            <>
              <PlusIcon className="h-6 w-6 transition-transform duration-500 group-hover:rotate-90" />
              <SparklesIcon className="h-4 w-4 text-white/80 animate-pulse" />
            </>
          )}
          <span className="transition-all duration-500 font-bold">
            {isCreatingSession ? "Creating..." : "New Chat"}
          </span>
        </button>
      </div>

      {/* Premium Search Bar */}
      <div className="flex-shrink-0 px-4 pb-4 animate-fade-in stagger-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-[#82838D] transition-all duration-500 group-focus-within:text-[#3077F3] group-focus-within:scale-110" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-white/80 backdrop-blur-sm border border-[#D5D6D9] text-[#2E3141] rounded-2xl pl-12 pr-5 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3077F3]/30 focus:border-[#3077F3] placeholder-[#82838D] transition-all duration-500 hover:border-[#C0C1C6] hover:shadow-lg focus:shadow-xl shadow-md font-medium"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3077F3]/8 to-[#B96AF7]/8 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </div>

      {/* Premium Chat List */}
      <div className="flex-1 overflow-y-auto px-2 min-h-0 smooth-scroll">
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="flex items-center justify-center h-full py-12 px-4 animate-fade-in-up">
              <div className="text-center">
                {/* Premium Icon Container */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F5F5F5] to-[#F0F8FF] rounded-2xl flex items-center justify-center animate-bounce-gentle shadow-lg">
                    <svg
                      className="w-8 h-8 text-[#82838D] animate-pulse-gentle"
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
                </div>

                {/* Premium Text Content */}
                <div className="space-y-3">
                  <p className="text-[#6D6F7A] text-base font-semibold animate-fade-in stagger-1">
                    No conversations
                  </p>
                  <p className="text-[#82838D] text-sm animate-fade-in stagger-2">
                    Start a new chat to begin
                  </p>
                </div>
              </div>
            </div>
          ) : (
            chats.map((chat: IChat, index) => (
              <div
                key={chat.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ChatListItem
                  chat={chat}
                  isSelected={chat.id === selectedChatId}
                  onClick={() => onSelectChat(chat.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Premium User Profile */}
      <div className="flex-shrink-0 animate-slide-up">
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
