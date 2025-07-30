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
}

export const ChatMessages = ({
  messages,
  isLoading = false,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Loading state for messages
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-white overflow-hidden">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Loading Messages
          </h3>
          <p className="text-sm text-gray-500">
            Retrieving your conversation history...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-6 lg:p-8 bg-white overflow-y-auto">
        <div className="text-center max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="relative mb-12">
            <div className="relative mx-auto w-20 h-20 lg:w-24 lg:h-24">
              {/* Main Icon */}
              <div className="absolute inset-0 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ChatBubbleLeftRightIcon className="h-10 w-10 lg:h-12 lg:w-12 text-white" />
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-6 h-6 lg:w-7 lg:h-7 bg-cyan-400 rounded-full flex items-center justify-center animate-bounce shadow-md"
                style={{ animationDelay: "0.5s" }}
              >
                <SparklesIcon className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
              </div>

              <div
                className="absolute -bottom-2 -left-2 lg:-bottom-3 lg:-left-3 w-5 h-5 lg:w-6 lg:h-6 bg-purple-400 rounded-full flex items-center justify-center animate-bounce shadow-md"
                style={{ animationDelay: "1s" }}
              >
                <CheckCircleIcon className="h-3 w-3 lg:h-4 lg:w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">
                Welcome to ChatAI
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 font-medium">
                Your intelligent conversation partner
              </p>
              <p className="text-sm lg:text-base text-gray-500 leading-relaxed max-w-lg mx-auto">
                Start a conversation below and experience the power of AI-driven
                chat with enhanced intelligence and natural language
                understanding
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-8">
              <div className="group p-4 lg:p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-3 lg:mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <SparklesIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                  Smart Responses
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  Get intelligent, contextual answers to all your questions with
                  advanced AI reasoning
                </p>
              </div>

              <div className="group p-4 lg:p-6 bg-white rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-cyan-500 rounded-xl flex items-center justify-center mb-3 lg:mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                  Real-time Chat
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  Instant responses with seamless conversation flow and live
                  interaction
                </p>
              </div>

              <div className="group p-4 lg:p-6 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-3 lg:mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <SparklesIconSolid className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm lg:text-base">
                  AI Powered
                </h3>
                <p className="text-xs lg:text-sm text-gray-600 leading-relaxed">
                  Advanced AI technology for natural conversations and
                  intelligent assistance
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 pt-6">
              <div className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 bg-cyan-50 rounded-full border border-cyan-200 shadow-sm">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-sm lg:text-base font-semibold text-gray-700">
                  AI Ready
                </span>
                <SparklesIcon className="h-3 w-3 lg:h-4 lg:w-4 text-cyan-500" />
              </div>
              <div className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 bg-blue-50 rounded-full border border-blue-200 shadow-sm">
                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm lg:text-base font-semibold text-gray-700">
                  Online
                </span>
                <CheckCircleIcon className="h-3 w-3 lg:h-4 lg:w-4 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white chat-scrollbar">
      <div className="p-6 space-y-6 min-h-full">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`relative max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] flex items-start space-x-3 ${
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
                    className={`relative w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border-2 transition-all duration-300 group-hover:scale-105 ${
                      message.role === "user"
                        ? "bg-blue-500 border-blue-400 border-opacity-30"
                        : "bg-cyan-500 border-cyan-400 border-opacity-30"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserCircleIconSolid className="h-6 w-6 text-white" />
                    ) : (
                      <div className="relative">
                        <SparklesIconSolid className="h-6 w-6 text-white" />
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse border border-white"></div>
                      </div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm ${
                      message.role === "user"
                        ? "bg-cyan-500"
                        : "bg-cyan-500 animate-pulse"
                    }`}
                  ></div>
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative rounded-xl px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-md group-hover:scale-[1.01] ${
                    message.role === "user"
                      ? "bg-blue-500 text-white rounded-br-md"
                      : "bg-gray-50 border border-gray-200 text-gray-800 rounded-bl-md hover:border-gray-300"
                  }`}
                >
                  {/* Message Text */}
                  <div className="break-words">
                    {message.isStreaming ? (
                      <div className="flex items-end space-x-3">
                        <div className="whitespace-pre-wrap leading-relaxed text-sm lg:text-base font-medium">
                          {message.content}
                        </div>
                        <div className="flex space-x-1 pb-1">
                          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
                          <div
                            className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={`whitespace-pre-wrap leading-relaxed text-sm lg:text-base ${
                          message.role === "user"
                            ? "font-medium"
                            : "font-normal"
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>

                  {/* File Attachment */}
                  {message.file && (
                    <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                      <div className="flex items-center space-x-3 text-xs opacity-90">
                        <DocumentDuplicateIcon className="h-4 w-4" />
                        <span className="font-semibold">
                          {message.file.name}
                        </span>
                        <span className="text-xs bg-current bg-opacity-10 px-2 py-1 rounded">
                          ({(message.file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Timestamp & Status */}
                  <div
                    className={`mt-3 text-xs flex items-center justify-between ${
                      message.role === "user"
                        ? "text-white text-opacity-80"
                        : "text-gray-500"
                    }`}
                  >
                    <span className="font-semibold">
                      {formatTimestamp(message.timestamp)}
                    </span>

                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-semibold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-2 py-1 rounded border border-cyan-200">
                            AI
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons - Only for AI responses */}
                  {message.role === "assistant" && (
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                      <button
                        className={`p-2 backdrop-blur-sm border rounded-lg transition-all duration-300 hover:scale-110 ${
                          copiedMessageId === String(message.id)
                            ? "bg-cyan-500 bg-opacity-20 border-cyan-500 border-opacity-30 text-cyan-600 shadow-md"
                            : "bg-white border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md"
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
                    className={`absolute top-6 w-3 h-3 transform rotate-45 ${
                      message.role === "user"
                        ? "right-[-6px] bg-blue-500"
                        : "left-[-6px] bg-gray-50 border-l border-b border-gray-200"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div ref={messagesEndRef} className="h-6" />
      </div>
    </div>
  );
};
