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
    <div className="overflow-y-auto bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 p-6 space-y-6 min-h-0">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 mb-6">
              <LightBulbIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              How can I help you today?
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Ask me anything or start a new conversation to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              } group`}
            >
              <div
                className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl p-4 transition-all duration-200 ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                    : "bg-white text-gray-900 rounded-bl-md backdrop-blur-sm hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`prose max-w-none text-sm leading-relaxed break-words ${
                    message.role === "user" ? "prose-invert" : "prose-gray"
                  }`}
                >
                  {message.content}
                </div>

                {/* Consistent timestamp alignment for both user and assistant messages */}
                <div
                  className={`mt-3 text-xs flex items-center justify-end space-x-2 ${
                    message.role === "user" ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  <span className="font-medium">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.role === "assistant" && (
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  )}
                </div>

                {/* Message actions - positioned consistently */}
                <div className="absolute -top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-1">
                  <button
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-800 transition-colors"
                    aria-label="Copy message"
                  >
                    <Square2StackIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 hover:text-gray-800 transition-colors"
                    aria-label="Duplicate message"
                  >
                    <DocumentDuplicateIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
