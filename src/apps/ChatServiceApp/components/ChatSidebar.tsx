import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/solid";
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
    <CommonSidebar className="bg-neutral-n-white/95 backdrop-blur-sm border-neutral-n200 text-neutral-n-black">
      {/* Sidebar Header */}
      <div className="flex-shrink-0 p-6 border-b border-neutral-n200 bg-gradient-to-b from-neutral-n-white to-neutral-n50">
        <button
          onClick={onNewChat}
          disabled={isCreatingSession}
          className={`w-full bg-gradient-to-r from-primary-ui-blue-p500 to-primary-ui-blue-p600 hover:from-primary-ui-blue-p600 hover:to-primary-ui-blue-p700 text-neutral-n-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg shadow-primary-ui-blue-p500/20 hover:shadow-primary-ui-blue-p500/30 ${
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
      <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-n200 bg-neutral-n-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-neutral-n500" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-neutral-n100 border border-neutral-n300 text-neutral-n-black rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-ui-blue-p500/50 focus:border-transparent placeholder-neutral-n600 transition-all duration-200"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 min-h-0">
        <div className="space-y-2">
          {chats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-neutral-n500 text-sm">
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
