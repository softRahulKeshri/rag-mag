import dayjs from "dayjs";
import {
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
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
    ? lastMessage.content.length > 50
      ? lastMessage.content.substring(0, 50) + "..."
      : lastMessage.content
    : "No messages yet";

  // Handle timestamp - use last message timestamp or chat creation timestamp
  const timestamp =
    lastMessage?.timestamp || chat.timestamp || new Date().toISOString();
  const formattedTime = dayjs(timestamp).format("MMM D, h:mm A");

  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-xl transition-all duration-300 cursor-pointer transform-gpu ${
        isSelected
          ? "bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 border border-indigo-200/60 shadow-lg shadow-indigo-500/20"
          : "hover:bg-gradient-to-r hover:from-slate-50 hover:via-white hover:to-slate-50 border border-transparent hover:border-slate-200/60 hover:shadow-md"
      }`}
    >
      {/* Enhanced Chat Item Content */}
      <div className="flex items-start space-x-3">
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md border ${
              isSelected
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 border-indigo-400/30"
                : "bg-gradient-to-br from-slate-500 via-gray-500 to-slate-600 border-slate-400/30 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-indigo-600 group-hover:border-indigo-400/30"
            } transition-all duration-300`}
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`text-sm font-semibold truncate transition-colors duration-300 ${
                isSelected
                  ? "text-indigo-700"
                  : "text-slate-700 group-hover:text-indigo-600"
              }`}
            >
              {chat.title || "New Chat"}
            </h3>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                isSelected
                  ? "text-indigo-500"
                  : "text-slate-400 group-hover:text-indigo-500"
              }`}
            >
              {formattedTime}
            </span>
          </div>

          <p
            className={`text-xs leading-relaxed truncate transition-colors duration-300 ${
              isSelected
                ? "text-slate-600"
                : "text-slate-500 group-hover:text-slate-600"
            }`}
          >
            {previewText}
          </p>

          {/* Enhanced Message Count */}
          {chat.messages.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  isSelected
                    ? "bg-indigo-500"
                    : "bg-slate-300 group-hover:bg-indigo-400"
                }`}
              ></div>
              <span
                className={`text-xs font-medium transition-colors duration-300 ${
                  isSelected
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-indigo-500"
                }`}
              >
                {chat.messages.length} message
                {chat.messages.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Action Button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white/80 transition-all duration-300 hover:scale-110 transform-gpu"
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu click
            }}
            aria-label="Chat options"
          >
            <EllipsisVerticalIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Enhanced Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-indigo-600 rounded-r-full shadow-lg"></div>
      )}

      {/* Enhanced Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 pointer-events-none ${
          isSelected
            ? "bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 opacity-100"
            : "group-hover:bg-gradient-to-r group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 group-hover:opacity-100"
        }`}
      ></div>

      {/* Enhanced AI Indicator */}
      {chat.messages.some((msg) => msg.role === "assistant") && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
        </div>
      )}
    </div>
  );
};

export default ChatListItem;
