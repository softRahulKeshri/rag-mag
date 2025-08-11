import { useEffect, useRef, useState } from "react";
import {
  Square2StackIcon,
  DocumentDuplicateIcon,
  UserIcon,
  CheckIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { IMessage } from "../types/types";
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
    <div className="group">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex items-start space-x-3 justify-start">
          {/* AI Avatar */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white">
              <SparklesIcon className="h-4 w-4 text-gray-600" />
            </div>
          </div>

          {/* Typing Bubble */}
          <div className="min-w-0 max-w-[85%] lg:max-w-[75%] xl:max-w-[70%]">
            <div className="relative">
              <div className="prose prose-sm max-w-none">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">
                    AI is thinking
                  </span>
                  <div className="ai-typing-dots text-gray-600">
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
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        <ChatMessagesSkeleton messageCount={5} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8 overflow-y-auto h-full">
        <div className="text-center max-w-md mx-auto">
          {/* Welcome Content */}
          <div className="space-y-4">
            <h1
              className="text-3xl font-bold leading-tight"
              style={{
                background:
                  "linear-gradient(to right, #B96AF7, #FDA052, #3077F3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Welcome to ChatAI
            </h1>
            <p className="text-gray-600 leading-relaxed text-lg font-medium">
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
      className="h-full overflow-y-auto chat-scrollbar scroll-smooth flex flex-col bg-gray-50"
    >
      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }
        .ai-typing-dots {
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .ai-typing-dots div {
          width: 4px;
          height: 4px;
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
        /* Message bubble shadows and elevation */
        .message-bubble-user {
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
        }
        .message-bubble-ai {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        /* Markdown styling for AI responses */
        .ai-message-markdown {
          color: inherit;
          line-height: 1.5;
        }
        .ai-message-markdown h1,
        .ai-message-markdown h2,
        .ai-message-markdown h3,
        .ai-message-markdown h4,
        .ai-message-markdown h5,
        .ai-message-markdown h6 {
          margin-top: 1em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.25;
        }
        .ai-message-markdown h1 {
          font-size: 1.4em;
        }
        .ai-message-markdown h2 {
          font-size: 1.2em;
        }
        .ai-message-markdown h3 {
          font-size: 1.1em;
        }
        .ai-message-markdown p {
          margin-bottom: 0.75em;
        }
        .ai-message-markdown ul,
        .ai-message-markdown ol {
          margin-bottom: 0.75em;
          padding-left: 1.25em;
        }
        .ai-message-markdown li {
          margin-bottom: 0.2em;
        }
        .ai-message-markdown blockquote {
          border-left: 3px solid #e5e7eb;
          padding-left: 0.75em;
          margin: 0.75em 0;
          font-style: italic;
          color: #6b7280;
        }
        .ai-message-markdown code {
          background-color: #f3f4f6;
          padding: 0.1em 0.2em;
          border-radius: 0.2em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.85em;
        }
        .ai-message-markdown pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 0.75em;
          border-radius: 0.4em;
          overflow-x: auto;
          margin: 0.75em 0;
        }
        .ai-message-markdown pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }
        .ai-message-markdown table {
          border-collapse: collapse;
          width: 100%;
          margin: 0.75em 0;
        }
        .ai-message-markdown th,
        .ai-message-markdown td {
          border: 1px solid #e5e7eb;
          padding: 0.4em;
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
          margin: 1.5em 0;
        }
      `}</style>

      <div className="flex-1 max-w-4xl mx-auto w-full">
        {messages.map((message) => (
          <div key={message.id} className="group relative">
            <div className="max-w-4xl mx-auto px-4 py-1">
              <div
                className={`flex items-start space-x-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Avatar - Only show for AI messages on the left */}
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white shadow-sm">
                      <SparklesIcon className="h-4 w-4 text-gray-600" />
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
                      className={`rounded-xl px-3 py-2 transition-all duration-300 ${
                        message.role === "user"
                          ? "message-bubble-user bg-blue-600 text-white"
                          : "message-bubble-ai bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      {/* Message Text */}
                      <div className="prose prose-sm max-w-none">
                        {message.isStreaming ? (
                          <div className="flex items-end space-x-2">
                            <div className="whitespace-pre-wrap leading-relaxed text-[14px] text-inherit">
                              {message.content}
                            </div>
                            <div className="flex space-x-1 pb-1">
                              <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-70"></div>
                              <div
                                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-70"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-1.5 h-1.5 bg-current rounded-full animate-bounce opacity-70"
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
                                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
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
                                  <th className="border border-gray-300 bg-gray-50 px-2 py-1 text-left font-semibold">
                                    {children}
                                  </th>
                                ),
                                td: ({ children }: TableCellProps) => (
                                  <td className="border border-gray-300 px-2 py-1">
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
                          <div className="whitespace-pre-wrap leading-relaxed text-[14px] text-inherit">
                            {message.content}
                          </div>
                        )}
                      </div>

                      {/* File Attachment */}
                      {message.file && (
                        <div
                          className={`mt-2 pt-2 ${
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
                            <DocumentDuplicateIcon className="h-3 w-3" />
                            <span className="font-medium">
                              {message.file.name}
                            </span>
                            <span
                              className={`text-xs px-1.5 py-0.5 rounded-md ${
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
                    </div>

                    {/* Copy Button - Positioned below message */}
                    <div className="mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex justify-center">
                      <button
                        className={`px-1.5 py-0.5 rounded-md transition-all duration-200 hover:scale-105 text-xs ${
                          copiedMessageId === String(message.id)
                            ? "bg-green-500 text-white shadow-lg"
                            : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 shadow-sm"
                        }`}
                        aria-label={`Copy ${
                          message.role === "user" ? "user" : "AI"
                        } message`}
                        onClick={() =>
                          handleCopyMessage(String(message.id), message.content)
                        }
                      >
                        {copiedMessageId === String(message.id) ? (
                          <div className="flex items-center space-x-1">
                            <CheckIcon className="h-2.5 w-2.5" />
                            <span>Copied!</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <Square2StackIcon className="h-2.5 w-2.5" />
                            <span>Copy</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Avatar - Only show for user messages on the right */}
                {message.role === "user" && (
                  <div className="flex-shrink-0 relative">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 bg-white shadow-sm">
                      <UserIcon className="h-4 w-4 text-gray-600" />
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

      <div ref={messagesEndRef} className="h-2" />
    </div>
  );
};
