import { useEffect, useRef, useState } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  UserIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { SparklesIcon as SparklesIconSolid } from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { IMessage } from "../types/types";
import { formatTimestamp } from "../utils/chatUtils";
import { ChatMessagesSkeleton } from "./ChatSkeleton";

interface ChatMessagesProps {
  messages: IMessage[];
  isLoading?: boolean;
  isAITyping?: boolean;
}

// TypeScript interfaces for ReactMarkdown components
interface CodeComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface LinkComponentProps {
  href?: string;
  children?: React.ReactNode;
}

interface TableComponentProps {
  children?: React.ReactNode;
}

interface TableCellProps {
  children?: React.ReactNode;
}

export const ChatMessages = ({
  messages,
  isLoading = false,
  isAITyping = false,
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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
    <div className="group bg-gradient-to-r from-gray-50/50 to-white/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-start space-x-4 justify-start">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
              <SparklesIconSolid className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Typing Bubble */}
          <div className="min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
            <div className="relative">
              <div className="prose prose-sm max-w-none">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-semibold text-gray-700">
                    AI is thinking
                  </span>
                  <div className="ai-typing-dots text-blue-600">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state for messages
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-gray-50/30 to-white overflow-hidden">
        <ChatMessagesSkeleton messageCount={5} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-gray-50/30 to-white overflow-y-auto h-full">
        <div className="text-center max-w-md mx-auto">
          {/* Welcome Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatAI
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg">
              Start a conversation below and experience intelligent AI-powered
              chat
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={messagesContainerRef}
      className="h-full overflow-y-auto bg-gradient-to-br from-gray-50/30 via-white to-gray-50/20 chat-scrollbar scroll-smooth flex flex-col"
    >
      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .ai-typing-dots {
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .ai-typing-dots div {
          width: 6px;
          height: 6px;
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
        /* Ensure proper scrolling behavior */
        .chat-scrollbar {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
        }
        /* Ensure messages container takes full height */
        .chat-scrollbar > div:first-child {
          min-height: 100%;
        }
        /* Premium user message styling */
        .user-message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .user-message-bubble:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
          transform: translateY(-1px);
        }
        .user-avatar-glow {
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.4);
        }
        /* Markdown styling for AI responses */
        .ai-message-markdown {
          color: inherit;
          line-height: 1.6;
        }
        .ai-message-markdown h1,
        .ai-message-markdown h2,
        .ai-message-markdown h3,
        .ai-message-markdown h4,
        .ai-message-markdown h5,
        .ai-message-markdown h6 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.25;
        }
        .ai-message-markdown h1 {
          font-size: 1.5em;
        }
        .ai-message-markdown h2 {
          font-size: 1.3em;
        }
        .ai-message-markdown h3 {
          font-size: 1.1em;
        }
        .ai-message-markdown p {
          margin-bottom: 1em;
        }
        .ai-message-markdown ul,
        .ai-message-markdown ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .ai-message-markdown li {
          margin-bottom: 0.25em;
        }
        .ai-message-markdown blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: #6b7280;
        }
        .ai-message-markdown code {
          background-color: #f3f4f6;
          padding: 0.125em 0.25em;
          border-radius: 0.25em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875em;
        }
        .ai-message-markdown pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1em;
          border-radius: 0.5em;
          overflow-x: auto;
          margin: 1em 0;
        }
        .ai-message-markdown pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .ai-message-markdown table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        .ai-message-markdown th,
        .ai-message-markdown td {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
          text-align: left;
        }
        .ai-message-markdown th {
          background-color: #f9fafb;
          font-weight: 600;
        }
        .ai-message-markdown a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .ai-message-markdown a:hover {
          color: #2563eb;
        }
        .ai-message-markdown hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2em 0;
        }
      `}</style>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`group ${
              message.role === "user"
                ? "bg-gradient-to-r from-indigo-50/30 to-purple-50/30"
                : "bg-gradient-to-r from-gray-50/50 to-white/50"
            }`}
          >
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div
                className={`flex items-start space-x-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar - Only show for AI messages on the left */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                      <SparklesIconSolid className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Message Content */}
                <div
                  className={`min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%] ${
                    message.role === "user" ? "order-first" : ""
                  }`}
                >
                  <div className="relative">
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-6 py-4 transition-all duration-300 ${
                        message.role === "user"
                          ? "user-message-bubble text-white backdrop-blur-sm"
                          : "bg-white text-gray-900 shadow-gray-200/50 border border-gray-100 shadow-lg"
                      }`}
                    >
                      {/* Message Text */}
                      <div className="prose prose-sm max-w-none">
                        {message.isStreaming ? (
                          <div className="flex items-end space-x-2">
                            <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-inherit">
                              {message.content}
                            </div>
                            <div className="flex space-x-1 pb-1">
                              <div className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-current rounded-full animate-bounce opacity-70"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        ) : message.role === "assistant" ? (
                          // Render AI messages as markdown
                          <div className="ai-message-markdown">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                // Customize code blocks for better styling
                                code: ({
                                  className,
                                  children,
                                }: CodeComponentProps) => {
                                  const isInline =
                                    !className?.includes("language-");
                                  return !isInline ? (
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                      <code className={className}>
                                        {children}
                                      </code>
                                    </pre>
                                  ) : (
                                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">
                                      {children}
                                    </code>
                                  );
                                },
                                // Customize links
                                a: ({ children, href }: LinkComponentProps) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 underline"
                                  >
                                    {children}
                                  </a>
                                ),
                                // Customize tables
                                table: ({ children }: TableComponentProps) => (
                                  <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                th: ({ children }: TableCellProps) => (
                                  <th className="border border-gray-300 bg-gray-50 px-3 py-2 text-left font-semibold">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }: TableCellProps) => (
                                  <td className="border border-gray-300 px-3 py-2">
                                    {children}
                                  </td>
                                ),
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          // User messages remain as plain text
                          <div className="whitespace-pre-wrap leading-relaxed text-[15px] text-inherit">
                            {message.content}
                          </div>
                        )}
                      </div>

                      {/* File Attachment */}
                      {message.file && (
                        <div
                          className={`mt-4 pt-4 ${
                            message.role === "user"
                              ? "border-t border-white/20"
                              : "border-t border-gray-200/60"
                          }`}
                        >
                          <div
                            className={`flex items-center space-x-2 text-xs ${
                              message.role === "user"
                                ? "text-white/80"
                                : "text-gray-500"
                            }`}
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                            <span className="font-medium">
                              {message.file.name}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-md ${
                                message.role === "user"
                                  ? "bg-white/20 text-white/90"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              ({(message.file.size / 1024).toFixed(1)} KB)
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Timestamp */}
                      <div
                        className={`mt-3 text-xs ${
                          message.role === "user"
                            ? "text-white/60"
                            : "text-gray-400"
                        }`}
                      >
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>

                    {/* Action Buttons - For both user and AI messages */}
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-110 ${
                          copiedMessageId === String(message.id)
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-lg"
                        }`}
                        aria-label={`Copy ${
                          message.role === "user" ? "user" : "AI"
                        } message`}
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
                  </div>
                </div>

                {/* Avatar - Only show for user messages on the right */}
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg user-avatar-glow">
                      <UserIcon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* AI Typing Indicator */}
        {isAITyping && <AITypingIndicator />}
      </div>

      <div ref={messagesEndRef} className="h-4" />
    </div>
  );
};
