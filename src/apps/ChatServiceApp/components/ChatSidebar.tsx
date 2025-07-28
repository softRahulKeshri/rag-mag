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
    <CommonSidebar className="bg-[#FAFAFA] border-r border-[#EAEAEC] animate-slide-in-left">
      {/* Brand Section */}
      <div className="flex-shrink-0 p-6 border-b border-[#EAEAEC] animate-fade-in">
        <div className="flex items-center space-x-3">
          <div className="relative group">
            {/* <div className="w-10 h-10 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-xl flex items-center justify-center hover-glow transition-all duration-300 hover:scale-110">
              <svg
                className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12"
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
            </div> */}
            <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-[#3077F3]/20 to-[#B96AF7]/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="animate-fade-in stagger-1">
            <h1 className="text-lg font-semibold text-[#2E3141] transition-colors duration-300 hover:text-[#3077F3]">
              ChatAI
            </h1>
            <p className="text-xs text-[#82838D] animate-pulse-gentle">
              AI-Powered Assistant
            </p>
          </div>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="flex-shrink-0 p-4 animate-fade-in stagger-2">
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full bg-[#3077F3] hover:bg-[#1E50A8] text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 btn-primary hover-lift focus-ring-brand ${
            isCreatingSession
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-105 hover:shadow-lg"
          }`}
        >
          {isCreatingSession ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-1"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-2"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-bounce stagger-3"></div>
            </>
          ) : (
            <PlusIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90" />
          )}
          <span className="transition-all duration-300">
            {isCreatingSession ? "Creating..." : "New Chat"}
          </span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex-shrink-0 px-4 pb-4 animate-fade-in stagger-3">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-[#82838D] transition-all duration-300 group-focus-within:text-[#3077F3] group-focus-within:scale-110" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-white border border-[#D5D6D9] text-[#2E3141] rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3077F3]/20 focus:border-[#3077F3] placeholder-[#82838D] transition-all duration-300 hover:border-[#C0C1C6] hover:shadow-sm focus:shadow-md"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#3077F3]/5 to-[#B96AF7]/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-2 min-h-0 smooth-scroll">
        <div className="space-y-1">
          {chats.length === 0 ? (
            <div className="flex items-center justify-center h-full py-8 px-4 animate-fade-in-up">
              <div className="text-center">
                {/* Icon Container */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center animate-bounce-gentle">
                    <svg
                      className="w-6 h-6 text-[#82838D] animate-pulse-gentle"
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

                {/* Text Content */}
                <div className="space-y-2">
                  <p className="text-[#6D6F7A] text-sm font-medium animate-fade-in stagger-1">
                    No conversations
                  </p>
                  <p className="text-[#82838D] text-xs animate-fade-in stagger-2">
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
                style={{ animationDelay: `${index * 50}ms` }}
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

      {/* User Profile */}
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
