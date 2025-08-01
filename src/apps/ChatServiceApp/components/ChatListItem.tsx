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
  isCollapsed?: boolean;
}

const modelIcons = {
  [ModelType.OPENAI]: SparklesIcon,
  [ModelType.ANTHROPIC]: CpuChipIcon,
  [ModelType.OLLAMA]: CloudIcon,
};

const modelColors = {
  [ModelType.OPENAI]: "text-blue-600",
  [ModelType.ANTHROPIC]: "text-purple-600",
  [ModelType.OLLAMA]: "text-gray-600",
};

const ChatListItem: React.FC<IChatListItemProps> = ({
  chat,
  isSelected,
  onClick,
  isCollapsed = false,
}) => {
  const lastMessage = chat.messages[chat.messages.length - 1];
  const previewText = lastMessage?.content
    ? lastMessage.content.length > 30
      ? lastMessage.content.substring(0, 30) + "..."
      : lastMessage.content
    : "No messages yet";

  const selectedModel = chat.selectedModel || ModelType.OPENAI;
  const ModelIcon = modelIcons[selectedModel];

  if (isCollapsed) {
    return (
      <div
        onClick={onClick}
        className={`group relative p-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-110 ${
          isSelected
            ? "text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg border border-purple-200"
            : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 border border-transparent"
        }`}
        title={chat.title || "New Chat"}
      >
        <div className="flex items-center justify-center relative">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? "bg-purple-100 text-purple-600"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-4 w-4" />
          </div>

          {/* Tooltip for collapsed state */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 min-w-max">
            <div className="font-semibold">{chat.title || "New Chat"}</div>
            <div className="text-gray-300 mt-1">
              {chat.messages.length} message
              {chat.messages.length !== 1 ? "s" : ""}
            </div>
            <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-0 h-0 border-r-4 border-l-0 border-t-4 border-b-4 border-transparent border-r-gray-900"></div>
          </div>
        </div>

        {/* Active indicator */}
        {isSelected && (
          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm animate-pulse" />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-lg transition-all duration-300 ease-in-out cursor-pointer transform hover:scale-[1.02] ${
        isSelected
          ? "text-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg border border-purple-200"
          : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-purple-50 border border-transparent"
      }`}
    >
      {/* Chat Item Content */}
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isSelected
                ? "bg-purple-100 text-purple-600"
                : "text-gray-400 group-hover:text-gray-600"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-4 w-4" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-medium transition-colors duration-300 truncate ${
              isSelected ? "text-gray-900" : "text-gray-700"
            }`}
            title={chat.title || "New Chat"}
          >
            {chat.title || "New Chat"}
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {previewText}
          </p>

          {/* Message Count & Model */}
          {chat.messages.length > 0 && (
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-500">
                {chat.messages.length} message
                {chat.messages.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center space-x-2">
                <ModelIcon
                  className={`h-3 w-3 ${modelColors[selectedModel]}`}
                />
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg border ${
                    modelColors[selectedModel]
                  } bg-opacity-10 border-opacity-30 ${modelColors[selectedModel]
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

        {/* Active indicator */}
        {isSelected && (
          <div className="absolute right-3 w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-sm animate-pulse" />
        )}
      </div>

      {/* Hover background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-50/80 to-blue-50/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
    </div>
  );
};

export default ChatListItem;
