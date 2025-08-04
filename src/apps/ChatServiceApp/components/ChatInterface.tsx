import React, { useState, useEffect, useRef } from "react";
import {
  useSendMessageApi,
  useGetMessagesApi,
  useConversationApi,
  type ConversationResponse,
  type SendMessageResponse,
} from "../hooks";
import {
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ChatLoader } from "./ChatLoader";

interface ChatInterfaceProps {
  chatId: string;
  userId: string;
  className?: string;
  onMessageSent?: (message: ConversationResponse | SendMessageResponse) => void;
  onError?: (error: string) => void;
  useConversationApi?: boolean; // New prop to switch to conversation API
}

/**
 * ChatInterface Component
 *
 * A comprehensive chat interface that handles:
 * - Sending messages to chat sessions
 * - Fetching and displaying messages
 * - Real-time message updates
 * - Loading states and error handling
 * - Auto-scroll to latest messages
 *
 * @example
 * ```typescript
 * <ChatInterface
 *   chatId="chat-123"
 *   userId="user-456"
 *   onMessageSent={(message) => console.log('Message sent:', message)}
 * />
 * ```
 */
const ChatInterface: React.FC<ChatInterfaceProps> = ({
  chatId,
  userId,
  className = "",
  onMessageSent,
  onError,
  useConversationApi: useConversationMode = false,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    sendUserMessage,
    isLoading: isSending,
    error: sendError,
    clearError: clearSendError,
  } = useSendMessageApi();

  const {
    sendUserMessageAndGetResponse,
    isLoading: isConversationLoading,
    error: conversationError,
    clearError: clearConversationError,
  } = useConversationApi();

  const {
    getMessages,
    isLoading: isLoadingMessages,
    error: getError,
    messages,
    getSortedMessages,
    getTotalMessages,
    refreshMessages,
    clearError: clearGetError,
  } = useGetMessagesApi();

  // Fetch messages on component mount and when chatId changes
  useEffect(() => {
    if (chatId) {
      getMessages(chatId).catch(console.error);
    }
  }, [chatId, getMessages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle error callbacks
  useEffect(() => {
    if (sendError && onError) {
      onError(sendError);
    }
  }, [sendError, onError]);

  useEffect(() => {
    if (conversationError && onError) {
      onError(conversationError);
    }
  }, [conversationError, onError]);

  useEffect(() => {
    if (getError && onError) {
      onError(getError);
    }
  }, [getError, onError]);

  // Handle message sending
  const handleSendMessage = async () => {
    if (
      !messageInput.trim() ||
      (useConversationMode ? isConversationLoading : isSending)
    )
      return;

    const messageContent = messageInput.trim();
    setMessageInput("");
    setIsTyping(true);

    try {
      let response;

      if (useConversationMode) {
        // Use conversation API for immediate AI response
        response = await sendUserMessageAndGetResponse(
          messageContent,
          chatId,
          userId
        );
        console.log("✅ Conversation message sent and AI response received");
      } else {
        // Use traditional send message API
        response = await sendUserMessage(messageContent, chatId, userId);
        // Refresh messages to get the latest state
        await refreshMessages(chatId);
        console.log("✅ Message sent and chat refreshed");
      }

      if (onMessageSent) {
        onMessageSent(response);
      }
    } catch (error) {
      console.error("❌ Failed to send message:", error);
      // Restore the message input if sending failed
      setMessageInput(messageContent);
    } finally {
      setIsTyping(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Unknown";
    }
  };

  // Get sorted messages for display
  const sortedMessages = getSortedMessages();
  const totalMessages = getTotalMessages();

  return (
    <div
      className={`flex flex-col h-full bg-gradient-to-br from-white via-gray-50/30 to-white rounded-2xl shadow-2xl border border-gray-200/60 backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200/60 bg-white/80 backdrop-blur-sm rounded-t-2xl">
        <div>
          <h3 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {useConversationMode ? "AI Conversation" : "Chat Messages"}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {totalMessages} {totalMessages === 1 ? "message" : "messages"}
            {useConversationMode && " (Real-time AI responses)"}
          </p>
        </div>
        <button
          onClick={() => refreshMessages(chatId)}
          disabled={isLoadingMessages}
          className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md"
          title="Refresh messages"
        >
          <ArrowPathIcon
            className={`h-5 w-5 ${isLoadingMessages ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/20 to-white">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <ChatLoader />
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-6">
              <svg
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold text-lg">
              {useConversationMode ? "Start a conversation" : "No messages yet"}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {useConversationMode
                ? "Send a message to begin chatting with AI"
                : "Start the conversation!"}
            </p>
          </div>
        ) : (
          sortedMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-6 py-4 rounded-2xl shadow-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-blue-500/25"
                    : "bg-white text-gray-900 shadow-gray-200/50 border border-gray-100"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-3 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {formatTimestamp(message.created_at)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {(sendError || getError || conversationError) && (
        <div className="mx-6 mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-orange-500 flex-shrink-0" />
            <p className="text-sm text-gray-900 font-medium">
              {sendError || getError || conversationError}
            </p>
          </div>
          <div className="flex space-x-3 mt-3">
            {sendError && (
              <button
                onClick={clearSendError}
                className="text-xs text-orange-600 hover:text-orange-700 underline font-medium"
              >
                Clear Error
              </button>
            )}
            {getError && (
              <button
                onClick={clearGetError}
                className="text-xs text-orange-600 hover:text-orange-700 underline font-medium"
              >
                Clear Error
              </button>
            )}
            {conversationError && (
              <button
                onClick={clearConversationError}
                className="text-xs text-orange-600 hover:text-orange-700 underline font-medium"
              >
                Clear Error
              </button>
            )}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-6 border-t border-gray-200/60 bg-white/80 backdrop-blur-sm rounded-b-2xl">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                useConversationMode
                  ? "Type your message to AI..."
                  : "Type your message..."
              }
              disabled={
                (useConversationMode ? isConversationLoading : isSending) ||
                isTyping
              }
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 resize-none disabled:opacity-50 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
              rows={1}
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              !messageInput.trim() ||
              (useConversationMode ? isConversationLoading : isSending) ||
              isTyping
            }
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            title={useConversationMode ? "Send message to AI" : "Send message"}
          >
            {(useConversationMode ? isConversationLoading : isSending) ||
            isTyping ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{messageInput.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
