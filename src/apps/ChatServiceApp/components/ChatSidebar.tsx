import { useState } from "react";
import ChatListItem from "./ChatListItem";
import { mockChats } from "../constant";
import type { IChat } from "../types/types";

const ChatSidebar = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="w-64 bg-gray-800 text-white h-full">
      <div className="h-full flex flex-col">
        {/* Top Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded mb-4">
            + New Chat
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-2 text-gray-400 hover:text-white">
              🔍
            </button>
          </div>

          <div className="space-y-2">
            {mockChats.map((chat: IChat) => (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isSelected={chat.id === selectedChatId}
                onClick={() => handleChatSelect(chat.id)}
              />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 p-4 space-y-4">
          <div className="border-b border-gray-700 pb-4">
            <button className="text-gray-400 hover:text-white cursor-pointer">
              Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
