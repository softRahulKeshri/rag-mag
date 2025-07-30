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
    ? lastMessage.content.length > 40
      ? lastMessage.content.substring(0, 40) + "..."
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
      className={`group relative p-3 rounded-lg transition-colors cursor-pointer ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
      }`}
    >
      {/* Chat Item Content */}
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-10 h-10 rounded-lg flex items-center justify-center shadow-sm border transition-colors ${
              isSelected
                ? "bg-blue-600 border-blue-500"
                : "bg-gray-100 border-gray-200 group-hover:bg-blue-600 group-hover:border-blue-500"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-5 w-5 text-white" />

            {/* AI Status Indicator */}
            {hasAIMessage && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border border-white">
                <SparklesIcon className="h-1.5 w-1.5 text-white absolute inset-0.5" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`text-sm font-medium truncate transition-colors ${
                isSelected
                  ? "text-blue-700"
                  : "text-gray-900 group-hover:text-blue-700"
              }`}
            >
              {chat.title || "New Chat"}
            </h3>
            <span
              className={`text-xs transition-colors ${
                isSelected
                  ? "text-blue-600"
                  : "text-gray-500 group-hover:text-blue-600"
              }`}
            >
              {formattedTime}
            </span>
          </div>

          <p
            className={`text-xs leading-relaxed truncate transition-colors ${
              isSelected
                ? "text-gray-600"
                : "text-gray-500 group-hover:text-gray-600"
            }`}
          >
            {previewText}
          </p>

          {/* Message Count & Status */}
          {chat.messages.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    isSelected
                      ? "bg-blue-600"
                      : "bg-gray-300 group-hover:bg-blue-600"
                  }`}
                ></div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isSelected
                      ? "text-blue-700"
                      : "text-gray-500 group-hover:text-blue-700"
                  }`}
                >
                  {chat.messages.length} message
                  {chat.messages.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* AI Conversation Indicator */}
              {hasAIMessage && (
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
                    AI
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
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

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
      )}
    </div>
  );
};

export default ChatListItem;
