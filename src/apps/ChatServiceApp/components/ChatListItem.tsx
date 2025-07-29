import dayjs from "dayjs";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  SparklesIcon,
} from "@heroicons/react/24/solid";
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

  const hasAIMessage = chat.messages.some((msg) => msg.role === "assistant");

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
        {/* Enhanced Modern Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-md border-2 transition-all duration-300 ${
              isSelected
                ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 border-indigo-400/50"
                : "bg-gradient-to-br from-slate-500 via-gray-500 to-slate-600 border-slate-400/50 group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-indigo-600 group-hover:border-indigo-400/50"
            } group-hover:scale-110`}
          >
            <ChatBubbleLeftRightIconSolid className="h-5 w-5 text-white" />

            {/* AI Status Indicator */}
            {hasAIMessage && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border border-white">
                <SparklesIcon className="h-2 w-2 text-white absolute inset-0.5" />
              </div>
            )}
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

              {/* AI Conversation Indicator */}
              {hasAIMessage && (
                <div className="flex items-center space-x-1">
                  <SparklesIcon className="h-3 w-3 text-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                    AI
                  </span>
                </div>
              )}
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
    </div>
  );
};

export default ChatListItem;
