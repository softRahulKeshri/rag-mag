import dayjs from "dayjs";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  SparklesIcon,
  CpuChipIcon,
  CloudIcon,
} from "@heroicons/react/24/solid";
import type { IChat } from "../types/types";
import { ModelType } from "../types/types";

interface IChatListItemProps {
  chat: IChat;
  isSelected: boolean;
  onClick: () => void;
}

const modelIcons = {
  [ModelType.OPENAI]: SparklesIcon,
  [ModelType.ANTHROPIC]: CpuChipIcon,
  [ModelType.OLLAMA]: CloudIcon,
};

const modelColors = {
  [ModelType.OPENAI]: "text-indigo-600",
  [ModelType.ANTHROPIC]: "text-purple-600",
  [ModelType.OLLAMA]: "text-blue-600",
};

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
  const selectedModel = chat.selectedModel || ModelType.OPENAI;
  const ModelIcon = modelIcons[selectedModel];

  return (
    <div
      onClick={onClick}
      className={`group relative p-4 rounded-xl transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-gradient-to-r from-indigo-50/80 to-purple-50/80 backdrop-blur-sm border border-indigo-200/50 shadow-md"
          : "hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-indigo-50/50 backdrop-blur-sm border border-transparent hover:border-gray-200/50 hover:shadow-sm"
      }`}
    >
      {/* Chat Item Content */}
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-200 ${
              isSelected
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400/30 shadow-lg"
                : "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-600 group-hover:border-indigo-400/30 group-hover:shadow-lg"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-5 w-5 text-white" />

            {/* AI Status Indicator */}
            {hasAIMessage && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse border-2 border-white shadow-sm">
                <SparklesIcon className="h-1.5 w-1.5 text-white absolute inset-0.5" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-sm font-semibold truncate transition-colors duration-200 ${
                isSelected
                  ? "text-gray-900"
                  : "text-gray-800 group-hover:text-gray-900"
              }`}
            >
              {chat.title || "New Chat"}
            </h3>
            <span
              className={`text-xs font-medium transition-colors duration-200 ${
                isSelected
                  ? "text-indigo-600"
                  : "text-gray-500 group-hover:text-indigo-600"
              }`}
            >
              {formattedTime}
            </span>
          </div>

          <p
            className={`text-xs leading-relaxed truncate transition-colors duration-200 ${
              isSelected
                ? "text-gray-600"
                : "text-gray-500 group-hover:text-gray-600"
            }`}
          >
            {previewText}
          </p>

          {/* Message Count & Status */}
          {chat.messages.length > 0 && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                    isSelected
                      ? "bg-indigo-600"
                      : "bg-gray-300 group-hover:bg-indigo-600"
                  }`}
                ></div>
                <span
                  className={`text-xs font-semibold transition-colors duration-200 ${
                    isSelected
                      ? "text-indigo-700"
                      : "text-gray-500 group-hover:text-indigo-700"
                  }`}
                >
                  {chat.messages.length} message
                  {chat.messages.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Model Indicator */}
              <div className="flex items-center space-x-2">
                <ModelIcon
                  className={`h-3 w-3 ${modelColors[selectedModel]}`}
                />
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg border transition-all duration-200 ${
                    modelColors[selectedModel]
                  } bg-opacity-10 border-opacity-20 ${modelColors[selectedModel]
                    .replace("text-", "bg-")
                    .replace("-600", "-50")} ${modelColors[selectedModel]
                    .replace("text-", "border-")
                    .replace("-600", "-200")}`}
                >
                  {selectedModel.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
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
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-r-full shadow-sm"></div>
      )}
    </div>
  );
};

export default ChatListItem;
