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
    ? lastMessage.content.length > 35
      ? lastMessage.content.substring(0, 35) + "..."
      : lastMessage.content
    : "No messages yet";

  // Handle timestamp - use last message timestamp or chat creation timestamp
  const timestamp =
    lastMessage?.timestamp || chat.timestamp || new Date().toISOString();
  const timeAgo = dayjs(timestamp).isValid()
    ? dayjs(timestamp).format("h:mm A")
    : "";

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center p-3 space-x-3 rounded-lg mx-2 transition-all duration-300 cursor-pointer chat-item hover-lift ${
        isSelected
          ? "bg-[#EFF5FF] border border-[#BFD6FF] shadow-sm animate-scale-in"
          : "hover:bg-white hover:border hover:border-[#EAEAEC] hover:shadow-md border border-transparent"
      }`}
    >
      <div
        className={`flex-shrink-0 w-2 h-2 rounded-full transition-all duration-300 ${
          isSelected
            ? "bg-[#3077F3] animate-pulse-gentle shadow-sm"
            : "bg-transparent group-hover:bg-[#C0C1C6]"
        }`}
      ></div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between space-x-2">
          <h3
            className={`text-sm font-medium truncate transition-all duration-300 ${
              isSelected
                ? "text-[#2E3141] font-semibold"
                : "text-[#434654] group-hover:text-[#2E3141]"
            }`}
          >
            {chat.title || "New Chat"}
          </h3>
          <span
            className={`text-xs flex-shrink-0 transition-all duration-300 ${
              isSelected
                ? "text-[#3077F3] font-medium"
                : "text-[#82838D] group-hover:text-[#6D6F7A]"
            }`}
          >
            {timeAgo}
          </span>
        </div>
        <p
          className={`text-xs truncate mt-0.5 transition-all duration-300 ${
            isSelected
              ? "text-[#6D6F7A]"
              : "text-[#6D6F7A] group-hover:text-[#434654]"
          }`}
        >
          {previewText}
        </p>
      </div>

      <button
        className="opacity-0 group-hover:opacity-100 text-[#82838D] hover:text-[#6D6F7A] p-1 rounded-md hover:bg-[#F5F5F5] transition-all duration-300 hover:scale-110 transform-gpu focus-ring-brand"
        aria-label="More options"
        onClick={(e) => {
          e.stopPropagation();
          // Handle menu options
        }}
      >
        <EllipsisVerticalIcon className="h-4 w-4 transition-transform duration-300 hover:rotate-90" />
      </button>

      {/* Active indicator for selected chat */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#3077F3] to-[#B96AF7] rounded-r-full animate-scale-in"></div>
      )}

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-lg bg-gradient-to-r from-[#3077F3]/5 to-[#B96AF7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isSelected ? "opacity-30" : ""
        }`}
      ></div>
    </div>
  );
};

export default ChatListItem;
