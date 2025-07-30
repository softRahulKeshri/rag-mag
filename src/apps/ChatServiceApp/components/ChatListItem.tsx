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
    ? lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + "..."
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
      className={`group relative p-2.5 rounded-lg transition-colors cursor-pointer ${
        isSelected
          ? "bg-blue-50 border border-blue-200"
          : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
      }`}
    >
      {/* Chat Item Content */}
      <div className="flex items-start space-x-2.5">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
              isSelected
                ? "bg-blue-500 border-blue-400"
                : "bg-gray-100 border-gray-200 group-hover:bg-blue-500 group-hover:border-blue-400"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-4 w-4 text-white" />

            {/* AI Status Indicator */}
            {hasAIMessage && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full animate-pulse border border-white">
                <SparklesIcon className="h-1 w-1 text-white absolute inset-0.5" />
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
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center space-x-1.5">
                <div
                  className={`w-1 h-1 rounded-full transition-colors ${
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
                <div className="flex items-center space-x-1.5">
                  <SparklesIcon className="h-2.5 w-2.5 text-green-500" />
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">
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
            className="p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu click
            }}
            aria-label="Chat options"
          >
            <EllipsisVerticalIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-600 rounded-r-full"></div>
      )}
    </div>
  );
};

export default ChatListItem;
