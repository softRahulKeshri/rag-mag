import { useEffect, useRef, useState } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  UserCircleIcon as UserCircleIconSolid,
  SparklesIcon as SparklesIconSolid,
  CheckIcon,
} from "@heroicons/react/24/solid";
import type { IMessage } from "../types/types";
import { formatTimestamp } from "../utils/chatUtils";

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
    <div className="flex justify-start group">
      <div className="relative max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] flex items-start space-x-4">
        {/* AI Avatar */}
        <div className="flex-shrink-0 order-first">
          <div className="relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 bg-blue-500 border-blue-400">
            <SparklesIconSolid className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* Typing Bubble */}
        <div className="relative rounded-xl px-6 py-4 shadow-lg bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-md">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-gray-700">
              AI is typing
            </span>
            <div className="ai-typing-dots text-blue-500">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>

          {/* Message Tail */}
          <div className="absolute top-8 left-[-8px] w-4 h-4 transform rotate-45 bg-gray-50 border-l border-b border-gray-200"></div>
        </div>
      </div>
    </div>
  );

  // Loading state for messages
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-gray-50 overflow-hidden">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            Loading Messages
          </h3>
          <p className="text-sm text-gray-600">
            Retrieving your conversation history...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 lg:p-12 bg-gray-50 overflow-y-auto">
        <div className="text-center max-w-3xl mx-auto">
          {/* Welcome Section */}
          <div className="relative mb-16">
            <div className="relative mx-auto w-24 h-24 lg:w-28 lg:h-28">
              {/* Main Icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
                <ChatBubbleLeftRightIcon className="h-12 w-12 lg:h-14 lg:w-14 text-white" />
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Welcome to ChatAI
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 font-bold">
                Your intelligent conversation partner
              </p>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Start a conversation below and experience the power of AI-driven
                chat with enhanced intelligence and natural language
                understanding
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12">
              <div className="group p-6 lg:p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-base lg:text-lg">
                  Smart Responses
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Get intelligent, contextual answers to all your questions with
                  advanced AI reasoning
                </p>
              </div>

              <div className="group p-6 lg:p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-base lg:text-lg">
                  Real-time Chat
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Instant responses with seamless conversation flow and live
                  interaction
                </p>
              </div>

              <div className="group p-6 lg:p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-blue-500 rounded-xl flex items-center justify-center mb-4 lg:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIconSolid className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-3 text-base lg:text-lg">
                  AI Powered
                </h3>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed">
                  Advanced AI technology for natural conversations and
                  intelligent assistance
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 pt-8">
              <div className="flex items-center space-x-3 lg:space-x-4 px-4 lg:px-6 py-3 lg:py-4 bg-emerald-50 rounded-xl border border-emerald-200 shadow-lg">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-base lg:text-lg font-bold text-gray-700">
                  AI Ready
                </span>
                <SparklesIcon className="h-4 w-4 lg:h-5 lg:w-5 text-emerald-500" />
              </div>
              <div className="flex items-center space-x-3 lg:space-x-4 px-4 lg:px-6 py-3 lg:py-4 bg-blue-50 rounded-xl border border-blue-200 shadow-lg">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full"></div>
                <span className="text-base lg:text-lg font-bold text-gray-700">
                  Online
                </span>
                <CheckCircleIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 chat-scrollbar scroll-smooth">
      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.3);
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: content-box;
          transition: background 0.3s ease;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.5);
          background-clip: content-box;
        }
        .ai-typing-dots {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ai-typing-dots div {
          width: 8px;
          height: 8px;
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
      `}</style>
      <div className="p-8 space-y-8 min-h-full">
        <div className="max-w-5xl mx-auto space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`relative max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] flex items-start space-x-4 ${
                  message.role === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 ${
                    message.role === "user" ? "order-last" : "order-first"
                  }`}
                >
                  <div
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 group-hover:scale-110 ${
                      message.role === "user"
                        ? "bg-blue-500 border-blue-400"
                        : "bg-blue-500 border-blue-400"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserCircleIconSolid className="h-7 w-7 text-white" />
                    ) : (
                      <SparklesIconSolid className="h-7 w-7 text-white" />
                    )}
                  </div>
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative rounded-xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:scale-[1.02] ${
                    message.role === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-white border border-gray-200 text-gray-800 rounded-bl-md hover:border-gray-300"
                  }`}
                >
                  {/* Message Text */}
                  <div className="break-words">
                    {message.isStreaming ? (
                      <div className="flex items-end space-x-3">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base font-semibold">
                          {message.content}
                        </div>
                        <div className="flex space-x-1 pb-1">
                          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`whitespace-pre-wrap leading-relaxed text-sm lg:text-base ${
                          message.role === "user"
                            ? "font-semibold"
                            : "font-normal"
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>

                  {/* File Attachment */}
                  {message.file && (
                    <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                      <div className="flex items-center space-x-3 text-xs opacity-90">
                        <DocumentDuplicateIcon className="h-4 w-4" />
                        <span className="font-bold">{message.file.name}</span>
                        <span className="text-xs bg-current bg-opacity-10 px-2 py-1 rounded-lg">
                          ({(message.file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div
                    className={`mt-4 text-xs flex items-center justify-between ${
                      message.role === "user"
                        ? "text-white text-opacity-80"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="font-bold">
                      {formatTimestamp(message.timestamp)}
                    </span>

                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 shadow-sm">
                            AI
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Only for AI responses */}
                  {message.role === "assistant" && (
                    <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                      <button
                        className={`p-2.5 backdrop-blur-md border rounded-xl transition-all duration-300 hover:scale-110 ${
                          copiedMessageId === String(message.id)
                            ? "bg-blue-500 bg-opacity-20 border-blue-500 border-opacity-40 text-blue-600 shadow-lg"
                            : "bg-white border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-lg"
                        }`}
                        aria-label="Copy AI response"
                        onClick={() =>
                          handleCopyMessage(String(message.id), message.content)
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

                  {/* Message Tail */}
                  <div
                    className={`absolute top-8 w-4 h-4 transform rotate-45 ${
                      message.role === "user"
                        ? "right-[-8px] bg-blue-500"
                        : "left-[-8px] bg-white border-l border-b border-gray-200"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isAITyping && <AITypingIndicator />}
        </div>
        <div ref={messagesEndRef} className="h-8" />
      </div>
    </div>
  );
};
