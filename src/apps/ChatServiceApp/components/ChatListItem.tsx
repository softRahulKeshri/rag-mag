import React from 'react';
import type { IChat } from '../types/types';

interface IChatListItemProps {
  chat: IChat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<IChatListItemProps> = ({ chat, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-gray-700 rounded-lg p-3 hover:bg-gray-600 cursor-pointer relative ${
        isSelected ? 'bg-gray-600' : ''
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <div className="font-medium">{chat.title}</div>
          <div className="text-sm text-gray-400">
            {chat.messages.length > 0
              ? chat.messages[chat.messages.length - 1].content
              : chat.timestamp}
          </div>
        </div>
        <button className="text-gray-400 hover:text-white">
          ...
        </button>
      </div>
    </div>
  );
};

export default ChatListItem;
