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
    <div className="overflow-y-auto bg-gradient-to-b from-neutral-n50 via-neutral-n100 to-neutral-n50 p-6 space-y-6 min-h-0">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center px-4 py-12">
          <div className="text-center max-w-md mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-ui-blue-p100 to-primary-ui-blue-p200 mb-6">
              <LightBulbIcon className="h-8 w-8 text-primary-ui-blue-p600" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-n-black mb-3">
              How can I help you today?
            </h3>
            <p className="text-neutral-n600 leading-relaxed">
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
                    ? "bg-gradient-to-r from-primary-ui-blue-p500 to-primary-ui-blue-p600 text-neutral-n-white rounded-br-md shadow-lg shadow-primary-ui-blue-p500/20 hover:shadow-primary-ui-blue-p500/30"
                    : "bg-neutral-n-white text-neutral-n-black rounded-bl-md backdrop-blur-sm hover:bg-neutral-n-white border border-neutral-n200 shadow-sm hover:shadow-md"
                }`}
              >
                <div
                  className={`prose max-w-none text-sm leading-relaxed break-words ${
                    message.role === "user" ? "prose-invert" : "prose-neutral"
                  }`}
                >
                  {message.content}
                </div>

                {/* Consistent timestamp alignment for both user and assistant messages */}
                <div
                  className={`mt-3 text-xs flex items-center justify-end space-x-2 ${
                    message.role === "user"
                      ? "text-neutral-n-white/80"
                      : "text-neutral-n600"
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
                    className="p-1.5 rounded-full bg-neutral-n200 hover:bg-neutral-n300 text-neutral-n700 hover:text-neutral-n800 transition-colors"
                    aria-label="Copy message"
                  >
                    <Square2StackIcon className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className="p-1.5 rounded-full bg-neutral-n200 hover:bg-neutral-n300 text-neutral-n700 hover:text-neutral-n800 transition-colors"
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
