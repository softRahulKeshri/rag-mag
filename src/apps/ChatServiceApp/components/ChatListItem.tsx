import dayjs from "dayjs";
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import type { IChat } from "../types/types";

interface IChatListItemProps {
  chat: IChat;
  isSelected: boolean;
  onClick: () => void;
}

const ChatListItem: React.FC<IChatListItemProps> = ({
  chat,
  isSelected,
  onClick,
}) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  const previewText = lastMessage?.content
  ? lastMessage.content.length > 40
    ? lastMessage.content.substring(0, 40) + "..."
    : lastMessage.content
  : "New chat";


  // Handle timestamp - use last message timestamp or chat creation timestamp
  const timestamp =
    lastMessage?.timestamp || chat.timestamp || new Date().toISOString();
  const timeAgo = dayjs(timestamp).isValid()
    ? dayjs(timestamp).format("h:mm A")
    : "";

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center p-3 space-x-3 rounded-lg mx-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-gray-800/80 shadow-lg shadow-blue-500/5 border border-gray-700/50"
          : "hover:bg-gray-800/50 hover:border-gray-700/30 border border-transparent"
      }`}
    >
      <div
        className={`flex-shrink-0 w-2 h-2 rounded-full ${
          isSelected ? "bg-blue-500" : "bg-transparent group-hover:bg-gray-600"
        }`}
      ></div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between space-x-2">
          <h3
            className={`text-sm font-medium truncate ${
              isSelected ? "text-white" : "text-gray-200 group-hover:text-white cursor-pointer"
            }`}
          >
            {chat.title || "New Chat"}
          </h3>
          <span
            className={`text-xs cursor-pointer ${
              isSelected
                ? "text-blue-400"
                : "text-gray-500 group-hover:text-gray-400 cursor-pointer"
            }`}
          >
            {timeAgo}
          </span>
        </div>
        <p
          className={`text-xs mt-0.5 truncate ${
            isSelected
              ? "text-gray-400"
              : "text-gray-500 group-hover:text-gray-400 cursor-pointer"
          }`}
        >
          {previewText}
        </p>
      </div>

      <button 
        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-300 p-1 -mr-1 rounded-full hover:bg-gray-700/50 transition-opacity cursor-pointer"
        aria-label="More options"
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatListItem;
