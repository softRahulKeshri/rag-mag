import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/solid';
import ChatListItem from "./ChatListItem";
import { UserProfile } from "./UserProfile";
import type { IChat } from "../types/types";

interface ChatSidebarProps {
  chats: IChat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
}

export const ChatSidebar = ({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
}: ChatSidebarProps) => {
  return (
    <div className="w-72 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 text-white h-full flex flex-col">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-800">
        <button 
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium py-2.5 px-4 rounded-lg mb-2 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-gray-800/50 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent placeholder-gray-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto py-2 px-2">
        <div className="space-y-1">
          {chats.map((chat: IChat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={chat.id === selectedChatId}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
        </div>
      </div>

      {/* User Profile */}
      <UserProfile 
        name="John Doe"
        email="john@example.com"
        plan="Free Plan"
        onSettingsClick={() => console.log('Settings clicked')}
      />
    </div>
  );
};

