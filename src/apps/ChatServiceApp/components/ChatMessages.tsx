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
      <div className="h-full flex items-center justify-center p-12 bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center">
          {/* Enhanced Loading Animation */}
          <div className="relative mb-12">
            <div className="w-24 h-24 border-4 border-[#EAEAEC] border-t-[#3077F3] rounded-full animate-spin mx-auto shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-transparent border-t-[#B96AF7] rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-transparent border-t-[#41E6F8] rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-[#2E3141] mb-3">
            Loading Messages
          </h3>
          <p className="text-[#6D6F7A] font-medium text-base">
            Retrieving your conversation history...
          </p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-12 bg-gradient-to-b from-white to-[#F5F5F5]">
        <div className="text-center max-w-2xl mx-auto">
          {/* Enhanced Welcome Section */}
          <div className="relative mb-16">
            <div className="relative mx-auto w-32 h-32">
              {/* Main Icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-3xl flex items-center justify-center shadow-2xl">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-white" />
              </div>

              {/* Enhanced Floating Elements */}
              <div
                className="absolute -top-3 -right-3 w-8 h-8 bg-[#FDA052] rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "0.5s" }}
              >
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>

              <div
                className="absolute -bottom-3 -left-3 w-7 h-7 bg-[#41E6F8] rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "1s" }}
              >
                <CheckCircleIcon className="h-4 w-4 text-white" />
              </div>

              <div
                className="absolute top-2 -left-6 w-4 h-4 bg-[#B96AF7] rounded-full animate-pulse shadow-md"
                style={{ animationDelay: "1.5s" }}
              ></div>
            </div>
          </div>

          {/* Enhanced Welcome Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-[#2E3141]">
                Welcome to ChatAI
              </h1>
              <p className="text-xl text-[#6D6F7A] font-medium">
                Your intelligent conversation partner
              </p>
              <p className="text-base text-[#9698A0] leading-relaxed max-w-lg mx-auto">
                Start a conversation below and experience the power of AI-driven
                chat with enhanced intelligence and natural language
                understanding
              </p>
            </div>

            {/* Enhanced Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="group p-6 bg-white rounded-2xl border border-[#EAEAEC] hover:border-[#3077F3] hover:border-opacity-30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-12 h-12 bg-[#3077F3] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#2E3141] mb-2 text-base">
                  Smart Responses
                </h3>
                <p className="text-sm text-[#6D6F7A] leading-relaxed">
                  Get intelligent, contextual answers to all your questions with
                  advanced AI reasoning
                </p>
              </div>

              <div className="group p-6 bg-white rounded-2xl border border-[#EAEAEC] hover:border-[#41E6F8] hover:border-opacity-30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-12 h-12 bg-[#41E6F8] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#2E3141] mb-2 text-base">
                  Real-time Chat
                </h3>
                <p className="text-sm text-[#6D6F7A] leading-relaxed">
                  Instant responses with seamless conversation flow and live
                  interaction
                </p>
              </div>

              <div className="group p-6 bg-white rounded-2xl border border-[#EAEAEC] hover:border-[#B96AF7] hover:border-opacity-30 transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="w-12 h-12 bg-[#B96AF7] rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <SparklesIconSolid className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[#2E3141] mb-2 text-base">
                  AI Powered
                </h3>
                <p className="text-sm text-[#6D6F7A] leading-relaxed">
                  Advanced AI technology for natural conversations and
                  intelligent assistance
                </p>
              </div>
            </div>

            {/* Enhanced Status Indicators */}
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-3 px-4 py-3 bg-[#41E6F8] bg-opacity-10 rounded-full border border-[#41E6F8] border-opacity-20 shadow-md">
                <div className="w-3 h-3 bg-[#41E6F8] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-[#2E3141]">
                  AI Ready
                </span>
                <SparklesIcon className="h-4 w-4 text-[#41E6F8]" />
              </div>
              <div className="flex items-center space-x-3 px-4 py-3 bg-[#3077F3] bg-opacity-10 rounded-full border border-[#3077F3] border-opacity-20 shadow-md">
                <div className="w-3 h-3 bg-[#3077F3] rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-[#2E3141]">
                  Online
                </span>
                <CheckCircleIcon className="h-4 w-4 text-[#3077F3]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-white to-[#F5F5F5]">
      <div className="max-w-5xl mx-auto space-y-6">
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
              {/* Enhanced Avatar */}
              <div
                className={`flex-shrink-0 ${
                  message.role === "user" ? "order-last" : "order-first"
                }`}
              >
                <div
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all duration-300 group-hover:scale-110 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-[#3077F3] to-[#B96AF7] border-[#3077F3] border-opacity-30"
                      : "bg-gradient-to-br from-[#41E6F8] to-[#B96AF7] border-[#41E6F8] border-opacity-30"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserCircleIconSolid className="h-7 w-7 text-white" />
                  ) : (
                    <div className="relative">
                      <SparklesIconSolid className="h-7 w-7 text-white" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FDA052] rounded-full animate-pulse border border-white"></div>
                    </div>
                  )}
                </div>

                {/* Enhanced Status Indicator */}
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md ${
                    message.role === "user"
                      ? "bg-[#41E6F8]"
                      : "bg-[#41E6F8] animate-pulse"
                  }`}
                ></div>
              </div>

              {/* Enhanced Message Bubble */}
              <div
                className={`relative rounded-3xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl group-hover:scale-[1.02] ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-[#3077F3] to-[#B96AF7] text-white rounded-br-lg"
                    : "bg-white border border-[#EAEAEC] text-[#2E3141] rounded-bl-lg hover:border-[#D5D6D9]"
                }`}
              >
                {/* Enhanced Message Text */}
                <div className="break-words">
                  {message.isStreaming ? (
                    <div className="flex items-end space-x-3">
                      <div className="whitespace-pre-wrap leading-relaxed text-base font-medium">
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
                      className={`whitespace-pre-wrap leading-relaxed text-base ${
                        message.role === "user" ? "font-medium" : "font-normal"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>

                {/* Enhanced File Attachment */}
                {message.file && (
                  <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                    <div className="flex items-center space-x-3 text-sm opacity-90">
                      <DocumentDuplicateIcon className="h-5 w-5" />
                      <span className="font-semibold">{message.file.name}</span>
                      <span className="text-sm bg-current bg-opacity-10 px-3 py-1 rounded-full">
                        ({(message.file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Enhanced Timestamp & Status */}
                <div
                  className={`mt-4 text-sm flex items-center justify-between ${
                    message.role === "user"
                      ? "text-white text-opacity-80"
                      : "text-[#9698A0]"
                  }`}
                >
                  <span className="font-semibold">
                    {formatTimestamp(message.timestamp)}
                  </span>

                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-[#41E6F8] rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-[#41E6F8] uppercase tracking-wider bg-[#41E6F8] bg-opacity-10 px-3 py-1 rounded-full">
                          AI
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons - Only for AI responses */}
                {message.role === "assistant" && (
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-2">
                    <button
                      className={`p-3 backdrop-blur-sm border rounded-2xl transition-all duration-300 hover:scale-110 ${
                        copiedMessageId === String(message.id)
                          ? "bg-[#41E6F8] bg-opacity-20 border-[#41E6F8] border-opacity-30 text-[#41E6F8] shadow-lg"
                          : "bg-white border-[#D5D6D9] text-[#6D6F7A] hover:text-[#2E3141] hover:bg-white hover:shadow-xl"
                      }`}
                      aria-label="Copy AI response"
                      onClick={() =>
                        handleCopyMessage(String(message.id), message.content)
                      }
                    >
                      {copiedMessageId === String(message.id) ? (
                        <CheckIcon className="h-5 w-5" />
                      ) : (
                        <Square2StackIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                )}

                {/* Enhanced Message Tail */}
                <div
                  className={`absolute top-6 w-4 h-4 transform rotate-45 ${
                    message.role === "user"
                      ? "right-[-8px] bg-gradient-to-br from-[#3077F3] to-[#B96AF7]"
                      : "left-[-8px] bg-white border-l border-b border-[#EAEAEC]"
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
