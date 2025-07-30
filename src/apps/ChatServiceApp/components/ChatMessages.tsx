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
      <div className="h-full flex items-center justify-center p-8 bg-gradient-to-br from-white to-slate-50">
        <div className="text-center">
          {/* Premium Loading Animation */}
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            Loading Messages
          </h3>
          <p className="text-slate-600 text-base">
            Retrieving your conversation history...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-white to-slate-50">
        <div className="text-center max-w-3xl mx-auto">
          {/* Premium Welcome Section */}
          <div className="relative mb-16 lg:mb-20">
            <div className="relative mx-auto w-28 h-28 lg:w-36 lg:h-36">
              {/* Main Icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <ChatBubbleLeftRightIcon className="h-14 w-14 lg:h-18 lg:w-18 text-white" />
              </div>

              {/* Premium Floating Elements */}
              <div
                className="absolute -top-3 -right-3 lg:-top-4 lg:-right-4 w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "0.5s" }}
              >
                <SparklesIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>

              <div
                className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-7 h-7 lg:w-9 lg:h-9 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "1s" }}
              >
                <CheckCircleIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>

              <div
                className="absolute top-2 -left-6 lg:top-3 lg:-left-8 w-4 h-4 lg:w-5 lg:h-5 bg-indigo-400 rounded-full animate-pulse shadow-md"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>

          {/* Premium Welcome Content */}
          <div className="space-y-8 lg:space-y-10">
            <div className="space-y-4 lg:space-y-5">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-800">
                Welcome to ChatAI
              </h1>
              <p className="text-xl lg:text-2xl text-slate-600 font-semibold">
                Your intelligent conversation partner
              </p>
              <p className="text-base lg:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
                Start a conversation below and experience the power of AI-driven
                chat with enhanced intelligence and natural language
                understanding
              </p>
            </div>

            {/* Premium Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 lg:mt-16">
              <div className="group p-6 lg:p-8 bg-white rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-base lg:text-lg">
                  Smart Responses
                </h3>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Get intelligent, contextual answers to all your questions with
                  advanced AI reasoning
                </p>
              </div>

              <div className="group p-6 lg:p-8 bg-white rounded-3xl border border-slate-200 hover:border-cyan-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-base lg:text-lg">
                  Real-time Chat
                </h3>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Instant responses with seamless conversation flow and live
                  interaction
                </p>
              </div>

              <div className="group p-6 lg:p-8 bg-white rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 lg:mb-5 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIconSolid className="h-6 w-6 lg:h-7 lg:w-7 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-3 text-base lg:text-lg">
                  AI Powered
                </h3>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Advanced AI technology for natural conversations and
                  intelligent assistance
                </p>
              </div>
            </div>

            {/* Premium Status Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 lg:space-x-10 pt-8 lg:pt-10">
              <div className="flex items-center space-x-3 lg:space-x-4 px-4 lg:px-5 py-3 lg:py-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-full border border-cyan-200 shadow-lg">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                <span className="text-sm lg:text-base font-bold text-slate-700">
                  AI Ready
                </span>
                <SparklesIcon className="h-4 w-4 lg:h-5 lg:w-5 text-cyan-500" />
              </div>
              <div className="flex items-center space-x-3 lg:space-x-4 px-4 lg:px-5 py-3 lg:py-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200 shadow-lg">
                <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm lg:text-base font-bold text-slate-700">
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
    <div className="h-full overflow-y-auto p-8 space-y-8 bg-gradient-to-br from-white to-slate-50">
      <div className="max-w-5xl mx-auto space-y-8">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } group`}
          >
            <div
              className={`relative max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] flex items-start space-x-5 ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Premium Avatar */}
              <div
                className={`flex-shrink-0 ${
                  message.role === "user" ? "order-last" : "order-first"
                }`}
              >
                <div
                  className={`relative w-14 h-14 rounded-3xl flex items-center justify-center shadow-xl border-2 transition-all duration-300 group-hover:scale-110 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 border-blue-500 border-opacity-30"
                      : "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 border-opacity-30"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserCircleIconSolid className="h-8 w-8 text-white" />
                  ) : (
                    <div className="relative">
                      <SparklesIconSolid className="h-8 w-8 text-white" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse border border-white"></div>
                    </div>
                  )}
                </div>

                {/* Premium Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md ${
                    message.role === "user"
                      ? "bg-cyan-500"
                      : "bg-cyan-500 animate-pulse"
                  }`}
                ></div>
              </div>

              {/* Premium Message Bubble */}
              <div
                className={`relative rounded-3xl px-8 py-6 shadow-xl transition-all duration-300 hover:shadow-2xl group-hover:scale-[1.02] ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-lg"
                    : "bg-white border border-slate-200 text-slate-800 rounded-bl-lg hover:border-slate-300"
                }`}
              >
                {/* Premium Message Text */}
                <div className="break-words">
                  {message.isStreaming ? (
                    <div className="flex items-end space-x-4">
                      <div className="whitespace-pre-wrap leading-relaxed text-base lg:text-lg font-medium">
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
                      className={`whitespace-pre-wrap leading-relaxed text-base lg:text-lg ${
                        message.role === "user" ? "font-medium" : "font-normal"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>

                {/* Premium File Attachment */}
                {message.file && (
                  <div className="mt-6 pt-6 border-t border-current border-opacity-20">
                    <div className="flex items-center space-x-4 text-sm opacity-90">
                      <DocumentDuplicateIcon className="h-6 w-6" />
                      <span className="font-bold">{message.file.name}</span>
                      <span className="text-sm bg-current bg-opacity-10 px-4 py-2 rounded-full">
                        ({(message.file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Premium Timestamp & Status */}
                <div
                  className={`mt-6 text-sm flex items-center justify-between ${
                    message.role === "user"
                      ? "text-white text-opacity-80"
                      : "text-slate-500"
                  }`}
                >
                  <span className="font-bold">
                    {formatTimestamp(message.timestamp)}
                  </span>

                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-cyan-600 uppercase tracking-wider bg-cyan-50 px-4 py-2 rounded-full border border-cyan-200">
                          AI
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Premium Action Buttons - Only for AI responses */}
                {message.role === "assistant" && (
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-3">
                    <button
                      className={`p-4 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:scale-110 ${
                        copiedMessageId === String(message.id)
                          ? "bg-cyan-500 bg-opacity-20 border-cyan-500 border-opacity-30 text-cyan-600 shadow-lg"
                          : "bg-white border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-white hover:shadow-xl"
                      }`}
                      aria-label="Copy AI response"
                      onClick={() =>
                        handleCopyMessage(String(message.id), message.content)
                      }
                    >
                      {copiedMessageId === String(message.id) ? (
                        <CheckIcon className="h-6 w-6" />
                      ) : (
                        <Square2StackIcon className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                )}

                {/* Premium Message Tail */}
                <div
                  className={`absolute top-8 w-5 h-5 transform rotate-45 ${
                    message.role === "user"
                      ? "right-[-10px] bg-gradient-to-br from-blue-600 to-indigo-600"
                      : "left-[-10px] bg-white border-l border-b border-slate-200"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} className="h-8" />
    </div>
  );
};
