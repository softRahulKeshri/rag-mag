import { useEffect, useRef, useState } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesIconSolid } from "@heroicons/react/24/solid";
import type { IMessage } from "../types/types";
import { formatTimestamp } from "../utils/chatUtils";
import { ChatLoader } from "./ChatLoader";

interface ChatMessagesProps {
  messages: IMessage[];
  isLoading?: boolean;
  isAITyping?: boolean;
}

export const ChatMessages = ({
  messages,
  isLoading = false,
  isAITyping = false,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    // Add a small delay to ensure smooth scrolling
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timer);
  }, [messages, isAITyping]);

  const handleCopyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setCopiedMessageId(messageId);
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    }
  };

  // AI Typing Indicator Component
  const AITypingIndicator = () => (
    <div className="group bg-[#F7F7F8]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-start space-x-4 justify-start">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3077F3] to-[#B96AF7] shadow-sm">
              <SparklesIconSolid className="h-4 w-4 text-white" />
            </div>
          </div>

          {/* Typing Bubble */}
          <div className="min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
            <div className="relative">
              <div className="prose prose-sm max-w-none">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-[#2E3141]">
                    AI is thinking
                  </span>
                  <div className="ai-typing-dots text-[#3077F3]">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state for messages
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-hidden">
        <ChatLoader />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="text-center max-w-md mx-auto">
          {/* Welcome Icon */}
          <div className="relative mb-8">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#FDA052] rounded-2xl flex items-center justify-center shadow-xl">
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-[#2E3141]">
              Welcome to ChatAI
            </h1>
            <p className="text-[#6D6F7A] leading-relaxed">
              Start a conversation below and experience intelligent AI-powered
              chat
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="h-full overflow-y-auto bg-white chat-scrollbar scroll-smooth flex flex-col"
    >
      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .ai-typing-dots {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .ai-typing-dots div {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: typing 1.4s infinite ease-in-out;
        }
        .ai-typing-dots div:nth-child(1) {
          animation-delay: -0.32s;
        }
        .ai-typing-dots div:nth-child(2) {
          animation-delay: -0.16s;
        }
        @keyframes typing {
          0%,
          80%,
          100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
        /* Ensure proper scrolling behavior */
        .chat-scrollbar {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        /* Ensure messages container takes full height */
        .chat-scrollbar > div:first-child {
          min-height: 100%;
        }
      `}</style>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group ${
              message.role === "user" ? "bg-white" : "bg-[#F7F7F8]"
            }`}
          >
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div
                className={`flex items-start space-x-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar - Only show for AI messages on the left */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3077F3] to-[#B96AF7] shadow-sm">
                      <SparklesIconSolid className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] ${
                    message.role === "user" ? "order-first" : ""
                  }`}
                >
                  <div className="relative">
                    {/* Message Text */}
                    <div className="prose prose-sm max-w-none">
                      {message.isStreaming ? (
                        <div className="flex items-end space-x-2">
                          <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-[#2E3141]">
                            {message.content}
                          </div>
                          <div className="flex space-x-1 pb-1">
                            <div className="w-1.5 h-1.5 bg-[#3077F3] rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 bg-[#3077F3] rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-[#3077F3] rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`whitespace-pre-wrap leading-relaxed text-[15px] ${
                            message.role === "user"
                              ? "text-[#2E3141]"
                              : "text-[#2E3141]"
                          }`}
                        >
                          {message.content}
                        </div>
                      )}
                    </div>

                    {/* File Attachment */}
                    {message.file && (
                      <div className="mt-3 pt-3 border-t border-[#EAEAEC]">
                        <div className="flex items-center space-x-2 text-xs text-[#6D6F7A]">
                          <DocumentDuplicateIcon className="h-3 w-3" />
                          <span className="font-medium">
                            {message.file.name}
                          </span>
                          <span className="text-xs bg-[#F5F5F5] px-2 py-1 rounded">
                            ({(message.file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="mt-2 text-xs text-[#6D6F7A]">
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>

                  {/* Action Buttons - Only for AI responses */}
                  {message.role === "assistant" && (
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                          copiedMessageId === String(message.id)
                            ? "bg-[#3077F3] text-white shadow-lg"
                            : "bg-white border border-[#EAEAEC] text-[#6D6F7A] hover:text-[#2E3141] hover:bg-[#F5F5F5] shadow-sm"
                        }`}
                        aria-label="Copy AI response"
                        onClick={() =>
                          handleCopyMessage(String(message.id), message.content)
                        }
                      >
                        {copiedMessageId === String(message.id) ? (
                          <CheckIcon className="h-3 w-3" />
                        ) : (
                          <Square2StackIcon className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar - Only show for user messages on the right */}
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[#3077F3] to-[#B96AF7] shadow-sm">
                      <UserIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isAITyping && <AITypingIndicator />}
      </div>

      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
