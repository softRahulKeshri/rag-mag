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
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center animate-fade-in">
          {/* Enhanced Loading Animation */}
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mx-auto shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-8 h-8 border-4 border-transparent border-t-pink-400 rounded-full animate-spin"
                style={{ animationDuration: "1.5s" }}
              ></div>
            </div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse text-base">
            Loading messages...
          </p>
          <div className="flex items-center justify-center space-x-2 mt-6">
            <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-lg mx-auto animate-fade-in-up">
          {/* Enhanced Welcome Animation */}
          <div className="relative mb-12">
            <div className="relative mx-auto w-32 h-32">
              {/* Main Icon with enhanced styling */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-float">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-white animate-pulse" />
              </div>

              {/* Enhanced Floating Elements */}
              <div
                className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-xl"
                style={{ animationDelay: "0.5s" }}
              >
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>

              <div
                className="absolute -bottom-2 -left-3 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-xl"
                style={{ animationDelay: "1s" }}
              >
                <CheckCircleIcon className="h-3 w-3 text-white" />
              </div>

              <div className="absolute top-2 -left-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-ping"></div>
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              ></div>

              {/* Enhanced Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-3xl animate-pulse-slow"></div>
            </div>
          </div>

          {/* Enhanced Welcome Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
                Welcome to ChatAI
              </h1>
              <p
                className="text-lg text-slate-600 animate-fade-in font-medium"
                style={{ animationDelay: "0.2s" }}
              >
                Your intelligent conversation partner
              </p>
              <p
                className="text-sm text-slate-500 leading-relaxed animate-fade-in max-w-md mx-auto"
                style={{ animationDelay: "0.4s" }}
              >
                Start a conversation below and experience the power of AI-driven
                chat with enhanced intelligence
              </p>
            </div>

            {/* Enhanced Feature Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="group p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-indigo-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                  Smart Responses
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Get intelligent, contextual answers to all your questions with
                  advanced AI
                </p>
              </div>

              <div
                className="group p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-emerald-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                  Real-time
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Instant responses with seamless conversation flow and live
                  typing indicators
                </p>
              </div>

              <div
                className="group p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-rose-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/20 hover:-translate-y-1"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <SparklesIconSolid className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm">
                  AI Powered
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Advanced AI technology for natural conversations and
                  intelligent assistance
                </p>
              </div>
            </div>

            {/* Enhanced Status Indicators */}
            <div
              className="flex items-center justify-center space-x-8 pt-8 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200/50 shadow-lg">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-emerald-700">
                  AI Ready
                </span>
                <SparklesIcon className="h-3 w-3 text-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200/50 shadow-lg">
                <div
                  className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full animate-pulse shadow-sm"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span className="text-sm font-semibold text-indigo-700">
                  Online
                </span>
                <CheckCircleIcon className="h-3 w-3 text-indigo-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 smooth-scroll">
      <div className="max-w-4xl mx-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } group animate-message-appear`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`relative max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] flex items-start space-x-3 ${
                message.role === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              {/* Enhanced Modern Avatar */}
              <div
                className={`flex-shrink-0 ${
                  message.role === "user" ? "order-last" : "order-first"
                }`}
              >
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-300 group-hover:scale-110 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 border-blue-300/50 shadow-blue-500/30"
                      : "bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 border-emerald-300/50 shadow-emerald-500/30"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserCircleIconSolid className="h-6 w-6 text-white" />
                  ) : (
                    <div className="relative">
                      <SparklesIconSolid className="h-6 w-6 text-white" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                {/* Online Status Indicator */}
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                    message.role === "user"
                      ? "bg-green-500"
                      : "bg-emerald-400 animate-pulse"
                  }`}
                ></div>
              </div>

              {/* Enhanced Modern Message Bubble */}
              <div
                className={`relative rounded-2xl px-5 py-4 shadow-md transition-all duration-300 hover:shadow-lg backdrop-blur-sm ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 text-white rounded-br-md shadow-blue-500/20"
                    : "bg-white border border-gray-200/80 text-gray-800 rounded-bl-md hover:border-gray-300/80 shadow-gray-500/10"
                } group-hover:scale-[1.02]`}
              >
                {/* Enhanced Message Text */}
                <div className="prose prose-sm max-w-none break-words overflow-wrap-anywhere">
                  {message.isStreaming ? (
                    <div className="flex items-end space-x-2">
                      <div className="whitespace-pre-wrap leading-relaxed text-sm font-medium">
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
                      className={`whitespace-pre-wrap leading-relaxed text-sm ${
                        message.role === "user" ? "font-medium" : "font-normal"
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>

                {/* Enhanced File Attachment */}
                {message.file && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <div className="flex items-center space-x-2 text-xs opacity-90">
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      <span className="font-medium">{message.file.name}</span>
                      <span className="text-xs bg-current/10 px-2 py-1 rounded-full">
                        ({(message.file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Enhanced Timestamp & Status */}
                <div
                  className={`mt-3 text-xs flex items-center justify-between ${
                    message.role === "user" ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  <span className="font-medium">
                    {formatTimestamp(message.timestamp)}
                  </span>

                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                          AI
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons - Only for AI responses */}
                {message.role === "assistant" && (
                  <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-1">
                    <button
                      className={`p-2 backdrop-blur-sm border rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu ${
                        copiedMessageId === String(message.id)
                          ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                          : "bg-white/95 border-gray-200 text-gray-600 hover:text-gray-800 hover:bg-white"
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

                {/* Modern Message Tail */}
                <div
                  className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                    message.role === "user"
                      ? "right-[-6px] bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600"
                      : "left-[-6px] bg-white border-l border-b border-gray-200/80"
                  }`}
                ></div>

                {/* Enhanced Subtle Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-400/20 to-purple-400/20"
                      : "bg-gradient-to-r from-emerald-400/10 to-teal-400/10"
                  }`}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
