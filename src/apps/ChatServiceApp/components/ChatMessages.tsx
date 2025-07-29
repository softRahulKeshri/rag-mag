import { useEffect, useRef } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
  SparklesIcon,
  CheckCircleIcon,
  UserIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";
import type { IMessage } from "../types/types";
import { formatTimestamp } from "../utils/chatUtils";

export const ChatMessages = ({ messages }: { messages: IMessage[] }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-lg mx-auto animate-fade-in-up">
          {/* Premium Welcome Animation */}
          <div className="relative mb-12">
            <div className="relative mx-auto w-32 h-32">
              {/* Main Icon */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/25 animate-float">
                <LightBulbIcon className="h-16 w-16 text-white animate-pulse" />
              </div>

              {/* Floating Elements */}
              <div
                className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "0.5s" }}
              >
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>

              <div
                className="absolute -bottom-2 -left-3 w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce shadow-lg"
                style={{ animationDelay: "1s" }}
              >
                <CheckCircleIcon className="h-3 w-3 text-white" />
              </div>

              <div className="absolute top-2 -left-4 w-4 h-4 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-ping"></div>
              <div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-ping"
                style={{ animationDelay: "1.5s" }}
              ></div>

              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl animate-pulse-slow"></div>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-fade-in">
                Welcome to ChatAI
              </h1>
              <p
                className="text-xl text-slate-600 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                Your intelligent conversation partner
              </p>
              <p
                className="text-base text-slate-500 leading-relaxed animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                Start a conversation below and experience the power of AI-driven
                chat
              </p>
            </div>

            {/* Feature Cards */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-indigo-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  Smart Responses
                </h3>
                <p className="text-sm text-slate-600">
                  Get intelligent, contextual answers to all your questions
                </p>
              </div>

              <div
                className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-emerald-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">Real-time</h3>
                <p className="text-sm text-slate-600">
                  Instant responses with seamless conversation flow
                </p>
              </div>

              <div
                className="group p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-rose-300/50 transition-all duration-500 hover:shadow-xl hover:shadow-rose-500/10 hover:-translate-y-1"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <CpuChipIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">
                  AI Powered
                </h3>
                <p className="text-sm text-slate-600">
                  Advanced AI technology for natural conversations
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div
              className="flex items-center justify-center space-x-8 pt-8 animate-fade-in"
              style={{ animationDelay: "0.8s" }}
            >
              <div className="flex items-center space-x-3 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm font-medium text-emerald-700">
                  AI Ready
                </span>
              </div>
              <div className="flex items-center space-x-3 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-200/50">
                <div
                  className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full animate-pulse shadow-sm"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <span className="text-sm font-medium text-indigo-700">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white smooth-scroll">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } group animate-message-appear`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div
              className={`relative max-w-[85%] lg:max-w-[75%] flex items-start space-x-3 ${
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
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500"
                      : "bg-gradient-to-br from-emerald-500 to-teal-500"
                  }`}
                >
                  {message.role === "user" ? (
                    <UserIcon className="h-5 w-5 text-white" />
                  ) : (
                    <CpuChipIcon className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div
                className={`relative rounded-3xl px-6 py-4 shadow-lg transition-all duration-500 hover:shadow-xl ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-br-lg"
                    : "bg-white border border-slate-200/50 text-slate-800 rounded-bl-lg hover:border-slate-300/50"
                } backdrop-blur-sm`}
              >
                {/* Message Text */}
                <div className="prose prose-sm max-w-none break-words overflow-wrap-anywhere">
                  {message.isStreaming ? (
                    <div className="flex items-end space-x-2">
                      <div className="whitespace-pre-wrap leading-7 text-base font-medium">
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
                      className={`whitespace-pre-wrap leading-7 text-base ${
                        message.role === "user" ? "font-medium" : ""
                      }`}
                    >
                      {message.content}
                    </div>
                  )}
                </div>

                {/* File Attachment */}
                {message.file && (
                  <div className="mt-3 pt-3 border-t border-current/20">
                    <div className="flex items-center space-x-2 text-sm opacity-90">
                      <DocumentDuplicateIcon className="h-4 w-4" />
                      <span>{message.file.name}</span>
                      <span className="text-xs">
                        ({(message.file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Timestamp */}
                <div
                  className={`mt-3 text-xs flex items-center ${
                    message.role === "user"
                      ? "justify-end text-white/80"
                      : "justify-start text-slate-500"
                  }`}
                >
                  <span className="font-medium">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.role === "assistant" && (
                    <div className="flex items-center space-x-1 ml-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
                        AI
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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

                {/* Message Tail */}
                <div
                  className={`absolute top-4 w-3 h-3 transform rotate-45 ${
                    message.role === "user"
                      ? "right-[-6px] bg-gradient-to-br from-indigo-500 to-purple-500"
                      : "left-[-6px] bg-white border-l border-b border-slate-200/50"
                  }`}
                ></div>

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                      : "bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
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
