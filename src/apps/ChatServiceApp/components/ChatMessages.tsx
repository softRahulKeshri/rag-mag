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
    <div className="group bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start space-x-4 justify-start">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <SparklesIconSolid className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Typing Bubble */}
          <div className="min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
            <div className="relative">
              <div className="prose prose-sm max-w-none">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-700">
                    AI is thinking
                  </span>
                  <div className="ai-typing-dots text-blue-600">
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
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50/30 to-white overflow-hidden">
        <ChatLoader />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-gray-50/30 to-white overflow-y-auto">
        <div className="text-center max-w-md mx-auto">
          {/* Welcome Icon */}
          <div className="relative mb-10">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-2xl">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl"></div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatAI
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg">
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
      className="h-full overflow-y-auto bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20 chat-scrollbar scroll-smooth flex flex-col"
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
          gap: 3px;
        }
        .ai-typing-dots div {
          width: 6px;
          height: 6px;
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
              message.role === "user"
                ? "bg-white/50"
                : "bg-gradient-to-r from-gray-50/50 to-white/50"
            }`}
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div
                className={`flex items-start space-x-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar - Only show for AI messages on the left */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                      <SparklesIconSolid className="h-5 w-5 text-white" />
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
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-6 py-4 shadow-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25"
                          : "bg-white text-gray-900 shadow-gray-200/50 border border-gray-100"
                      }`}
                    >
                      {/* Message Text */}
                      <div className="prose prose-sm max-w-none">
                        {message.isStreaming ? (
                          <div className="flex items-end space-x-2">
                            <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-inherit">
                              {message.content}
                            </div>
                            <div className="flex space-x-1 pb-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-inherit">
                            {message.content}
                          </div>
                        )}
                      </div>

                      {/* File Attachment */}
                      {message.file && (
                        <div className="mt-4 pt-4 border-t border-gray-200/60">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <DocumentDuplicateIcon className="h-4 w-4" />
                            <span className="font-medium">
                              {message.file.name}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                              ({(message.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div className="mt-3 text-xs text-gray-400">
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>

                    {/* Action Buttons - Only for AI responses */}
                    {message.role === "assistant" && (
                      <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 ${
                            copiedMessageId === String(message.id)
                              ? "bg-green-500 text-white shadow-lg"
                              : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-lg"
                          }`}
                          aria-label="Copy AI response"
                          onClick={() =>
                            handleCopyMessage(
                              String(message.id),
                              message.content
                            )
                          }
                        >
                          {copiedMessageId === String(message.id) ? (
                            <CheckIcon className="h-4 w-4" />
                          ) : (
                            <Square2StackIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Avatar - Only show for user messages on the right */}
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                      <UserIcon className="h-5 w-5 text-white" />
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
