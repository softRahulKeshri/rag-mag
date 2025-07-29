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
    ? lastMessage.content.length > 45
      ? lastMessage.content.substring(0, 45) + "..."
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
      className={`group relative p-5 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
        isSelected
          ? "bg-gradient-to-r from-[#3077F3]/10 via-[#B96AF7]/5 to-[#3077F3]/10 border-2 border-[#3077F3]/30 shadow-xl shadow-[#3077F3]/10"
          : "hover:bg-white hover:shadow-xl hover:shadow-black/5 border-2 border-transparent hover:border-[#EAEAEC]"
      }`}
    >
      {/* Enhanced Chat Item Content */}
      <div className="flex items-start space-x-4">
        {/* Enhanced Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 group-hover:scale-110 ${
              isSelected
                ? "bg-gradient-to-br from-[#3077F3] to-[#B96AF7] border-[#3077F3]/30"
                : "bg-gradient-to-br from-[#9698A0] to-[#6D6F7A] border-[#D5D6D9] group-hover:from-[#3077F3] group-hover:to-[#B96AF7] group-hover:border-[#3077F3]/30"
            }`}
          >
            <ChatBubbleLeftRightIconSolid className="h-7 w-7 text-white" />

            {/* Enhanced AI Status Indicator */}
            {hasAIMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#41E6F8] rounded-full animate-pulse border-2 border-white shadow-md">
                <SparklesIcon className="h-2.5 w-2.5 text-white absolute inset-0.5" />
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-base font-semibold truncate transition-colors duration-300 ${
                isSelected
                  ? "text-[#3077F3]"
                  : "text-[#2E3141] group-hover:text-[#3077F3]"
              }`}
            >
              {chat.title || "New Chat"}
            </h3>
            <span
              className={`text-xs font-semibold transition-colors duration-300 ${
                isSelected
                  ? "text-[#B96AF7]"
                  : "text-[#9698A0] group-hover:text-[#B96AF7]"
              }`}
            >
              {formattedTime}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed truncate transition-colors duration-300 ${
              isSelected
                ? "text-[#6D6F7A]"
                : "text-[#9698A0] group-hover:text-[#6D6F7A]"
            }`}
          >
            {previewText}
          </p>

          {/* Enhanced Message Count & Status */}
          {chat.messages.length > 0 && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    isSelected
                      ? "bg-[#3077F3]"
                      : "bg-[#D5D6D9] group-hover:bg-[#3077F3]"
                  }`}
                ></div>
                <span
                  className={`text-xs font-semibold transition-colors duration-300 ${
                    isSelected
                      ? "text-[#3077F3]"
                      : "text-[#9698A0] group-hover:text-[#3077F3]"
                  }`}
                >
                  {chat.messages.length} message
                  {chat.messages.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Enhanced AI Conversation Indicator */}
              {hasAIMessage && (
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-[#41E6F8] animate-pulse" />
                  <span className="text-xs font-bold text-[#41E6F8] bg-[#41E6F8]/10 px-2.5 py-1 rounded-full border border-[#41E6F8]/20">
                    AI
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Action Button */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="p-2.5 text-[#9698A0] hover:text-[#3077F3] rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              // Handle menu click
            }}
            aria-label="Chat options"
          >
            <EllipsisVerticalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Enhanced Selection Indicator */}
      {isSelected && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[#3077F3] to-[#B96AF7] rounded-r-full shadow-lg"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#3077F3]/5 to-[#B96AF7]/5 rounded-2xl pointer-events-none"></div>
        </>
      )}

      {/* Enhanced Hover Glow Effect */}
      <div
        className={`absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 pointer-events-none ${
          isSelected
            ? "bg-gradient-to-r from-[#3077F3]/5 via-[#B96AF7]/5 to-[#3077F3]/5 opacity-100"
            : "group-hover:bg-gradient-to-r group-hover:from-[#3077F3]/3 group-hover:via-[#B96AF7]/3 group-hover:to-[#3077F3]/3 group-hover:opacity-100"
        }`}
      ></div>
    </div>
  );
};

export default ChatListItem;
