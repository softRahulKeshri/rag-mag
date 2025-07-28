import { useEffect, useRef } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  LightBulbIcon,
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

  return (
    <div className="overflow-y-auto bg-gradient-to-b from-[#FAFAFA] to-white p-6 space-y-6 min-h-0 smooth-scroll">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center px-4 py-16">
          <div className="text-center max-w-md mx-auto animate-fade-in-up">
            {/* Icon Container */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3077F3]/10 to-[#B96AF7]/10 rounded-2xl flex items-center justify-center animate-float hover-glow">
                <LightBulbIcon className="h-8 w-8 text-[#3077F3] animate-pulse-gentle" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3077F3]/5 to-[#B96AF7]/5 rounded-2xl blur-xl animate-pulse-slow"></div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#2E3141] animate-fade-in stagger-1">
                How can I help you today?
              </h3>
              <p className="text-[#6D6F7A] leading-relaxed animate-fade-in stagger-2">
                Ask me anything or start a new conversation to get started
              </p>

              {/* Status Indicators */}
              <div className="flex items-center justify-center space-x-6 pt-4 animate-fade-in stagger-3">
                <div className="flex items-center space-x-2 text-sm text-[#82838D] hover:text-[#6D6F7A] transition-colors duration-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>AI Ready</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#82838D] hover:text-[#6D6F7A] transition-colors duration-300">
                  <div
                    className="w-2 h-2 bg-[#3077F3] rounded-full animate-pulse"
                    style={{ animationDelay: "1s" }}
                  ></div>
                  <span>Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } group animate-message-appear`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`relative max-w-[80%] md:max-w-[70%] rounded-2xl p-4 transition-all duration-300 message-bubble hover-lift ${
                  message.role === "user"
                    ? "bg-[#3077F3] text-white rounded-br-md hover:bg-[#1E50A8] hover:shadow-lg transform-gpu"
                    : "bg-white text-[#2E3141] rounded-bl-md border border-[#EAEAEC] hover:border-[#D5D6D9] hover:shadow-md"
                }`}
              >
                <div className="prose max-w-none text-sm leading-relaxed break-words">
                  {message.isStreaming ? (
                    <div className="flex items-center space-x-1">
                      <span>{message.content}</span>
                      <div className="w-2 h-4 bg-current animate-pulse opacity-70"></div>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>

                {/* Timestamp */}
                <div
                  className={`mt-3 text-xs flex items-center justify-end transition-all duration-300 ${
                    message.role === "user" ? "text-white/70" : "text-[#82838D]"
                  }`}
                >
                  <span className="hover:text-current transition-colors duration-300">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.role === "assistant" && (
                    <span className="w-2 h-2 rounded-full bg-green-500 ml-2 flex-shrink-0 animate-pulse-gentle"></span>
                  )}
                </div>

                {/* Message actions */}
                <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex space-x-1 transform translate-y-2 group-hover:translate-y-0">
                  <button
                    className="p-1.5 rounded-lg bg-white border border-[#EAEAEC] text-[#6D6F7A] hover:text-[#434654] hover:bg-[#F5F5F5] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 transform-gpu focus-ring-brand"
                    aria-label="Copy message"
                    onClick={() =>
                      navigator.clipboard.writeText(message.content)
                    }
                  >
                    <Square2StackIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg bg-white border border-[#EAEAEC] text-[#6D6F7A] hover:text-[#434654] hover:bg-[#F5F5F5] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 transform-gpu focus-ring-brand"
                    aria-label="Duplicate message"
                  >
                    <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Message glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-[#3077F3]/10 to-[#1E50A8]/10"
                      : "bg-gradient-to-r from-[#3077F3]/5 to-[#B96AF7]/5"
                  }`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
