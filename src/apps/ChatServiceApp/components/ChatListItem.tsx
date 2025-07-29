import dayjs from "dayjs";
import {
  EllipsisVerticalIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
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
      className={`group relative flex items-center p-4 space-x-4 rounded-2xl mx-2 transition-all duration-500 cursor-pointer chat-item hover-lift ${
        isSelected
          ? "bg-gradient-to-r from-[#EFF5FF] to-[#F0F8FF] border border-[#BFD6FF] shadow-xl animate-scale-in"
          : "hover:bg-white/80 hover:border hover:border-[#EAEAEC] hover:shadow-lg border border-transparent backdrop-blur-sm"
      }`}
    >
      <div
        className={`flex-shrink-0 w-3 h-3 rounded-full transition-all duration-500 ${
          isSelected
            ? "bg-gradient-to-r from-[#3077F3] to-[#B96AF7] animate-pulse-gentle shadow-lg shadow-[#3077F3]/50"
            : "bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#C0C1C6] group-hover:to-[#82838D]"
        }`}
      ></div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between space-x-3">
          <h3
            className={`text-sm font-semibold truncate transition-all duration-500 ${
              isSelected
                ? "text-[#2E3141] font-bold bg-gradient-to-r from-[#3077F3] to-[#B96AF7] bg-clip-text text-transparent"
                : "text-[#434654] group-hover:text-[#2E3141]"
            }`}
          >
            {chat.title || "New Chat"}
          </h3>
          <span
            className={`text-xs flex-shrink-0 transition-all duration-500 ${
              isSelected
                ? "text-[#3077F3] font-bold"
                : "text-[#82838D] group-hover:text-[#6D6F7A]"
            }`}
          >
            {timeAgo}
          </span>
        </div>
        <p
          className={`text-xs truncate mt-1 transition-all duration-500 ${
            isSelected
              ? "text-[#6D6F7A] font-medium"
              : "text-[#6D6F7A] group-hover:text-[#434654]"
          }`}
        >
          {previewText}
        </p>
      </div>

      <button
        className="opacity-0 group-hover:opacity-100 text-[#82838D] hover:text-[#6D6F7A] p-2 rounded-xl hover:bg-white/80 transition-all duration-500 hover:scale-110 transform-gpu focus-ring-brand"
        aria-label="More options"
        onClick={(e) => {
          e.stopPropagation();
          // Handle menu options
        }}
      >
        <EllipsisVerticalIcon className="h-4 w-4 transition-transform duration-500 hover:rotate-90" />
      </button>

      {/* Premium Active indicator for selected chat */}
      {isSelected && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-[#3077F3] via-[#B96AF7] to-[#3077F3] rounded-r-full animate-scale-in shadow-lg"></div>
      )}

      {/* Premium Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-[#3077F3]/8 to-[#B96AF7]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
          isSelected ? "opacity-30" : ""
        }`}
      ></div>

      {/* Premium Sparkle effect for selected chat */}
      {isSelected && (
        <div
          className="absolute -top-1 -right-1 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        >
          <SparklesIcon
            className="h-3 w-3 text-[#B96AF7] animate-spin"
            style={{ animationDuration: "3s" }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatListItem;
