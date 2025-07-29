import { useEffect, useRef } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
                  <CpuChipIcon className="h-6 w-6 text-white" />
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
    <div className="h-full overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 smooth-scroll">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } group animate-message-appear`}
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div
              className={`relative max-w-[80%] lg:max-w-[70%] xl:max-w-[65%] flex items-start space-x-3 ${
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
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg border ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 border-indigo-400/30"
                      : "bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 border-emerald-400/30"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <CpuChipIcon className="h-4 w-4 text-white" />
                  )}
                </div>
              </div>

              {/* Enhanced Message Content */}
              <div
                className={`relative rounded-2xl px-4 py-3 shadow-lg transition-all duration-500 hover:shadow-xl ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white rounded-br-lg"
                    : "bg-white border border-slate-200/60 text-slate-800 rounded-bl-lg hover:border-slate-300/60 shadow-md"
                } backdrop-blur-sm`}
              >
                {/* Enhanced Message Text */}
                <div className="prose prose-sm max-w-none break-words overflow-wrap-anywhere">
                  {message.isStreaming ? (
                    <div className="flex items-end space-x-2">
                      <div className="whitespace-pre-wrap leading-6 text-sm font-medium">
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
                      className={`whitespace-pre-wrap leading-6 text-sm ${
                        message.role === "user" ? "font-medium" : ""
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

                {/* Enhanced Timestamp */}
                <div
                  className={`mt-2 text-xs flex items-center ${
                    message.role === "user"
                      ? "justify-end text-white/90"
                      : "justify-start text-slate-500"
                  }`}
                >
                  <span className="font-medium">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-2 ml-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-full">
                        AI
                      </span>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div
                  className={`absolute -top-2 ${
                    message.role === "user" ? "-left-2" : "-right-2"
                  } opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-1`}
                >
                  <button
                    className="p-2 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl text-slate-600 hover:text-slate-800 hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform-gpu"
                    aria-label="Copy message"
                    onClick={() =>
                      navigator.clipboard.writeText(message.content)
                    }
                  >
                    <Square2StackIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Enhanced Message Tail */}
                <div
                  className={`absolute top-3 w-2 h-2 transform rotate-45 ${
                    message.role === "user"
                      ? "right-[-4px] bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600"
                      : "left-[-4px] bg-white border-l border-b border-slate-200/60"
                  }`}
                ></div>

                {/* Enhanced Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30"
                      : "bg-gradient-to-r from-emerald-500/20 to-teal-500/20"
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
