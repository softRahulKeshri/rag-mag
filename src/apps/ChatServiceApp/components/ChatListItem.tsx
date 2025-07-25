import dayjs from "dayjs";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
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
      className={`group relative flex items-center p-4 space-x-3 rounded-xl mx-1 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-gradient-to-r from-blue-50 to-blue-100 shadow-md shadow-blue-500/10 border border-blue-200"
          : "hover:bg-gray-100 hover:border-gray-300 border border-transparent"
      }`}
    >
      <div
        className={`flex-shrink-0 w-2.5 h-2.5 rounded-full transition-all duration-200 ${
          isSelected
            ? "bg-blue-500 shadow-sm"
            : "bg-transparent group-hover:bg-gray-400"
        }`}
      ></div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between space-x-3">
          <h3
            className={`text-sm font-semibold truncate ${
              isSelected
                ? "text-gray-900"
                : "text-gray-800 group-hover:text-gray-900"
            }`}
          >
            {chat.title || "New Chat"}
          </h3>
          <span
            className={`text-xs font-medium ${
              isSelected
                ? "text-blue-600"
                : "text-gray-600 group-hover:text-gray-700"
            }`}
          >
            {timeAgo}
          </span>
        </div>
        <p
          className={`text-xs mt-1 truncate leading-relaxed ${
            isSelected
              ? "text-gray-700"
              : "text-gray-600 group-hover:text-gray-700"
          }`}
        >
          {previewText}
        </p>
      </div>

      <button
        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-200 transition-all duration-200"
        aria-label="More options"
      >
        <EllipsisVerticalIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ChatListItem;
