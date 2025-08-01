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
      className={`flex flex-col h-full bg-white rounded-lg shadow-sm border border-[#EAEAEC] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#EAEAEC]">
        <div>
          <h3 className="text-lg font-semibold text-[#2E3141]">
            {useConversationMode ? "AI Conversation" : "Chat Messages"}
          </h3>
          <p className="text-sm text-[#6D6F7A]">
            {totalMessages} {totalMessages === 1 ? "message" : "messages"}
            {useConversationMode && " (Real-time AI responses)"}
          </p>
        </div>
        <button
          onClick={() => refreshMessages(chatId)}
          disabled={isLoadingMessages}
          className="p-2 text-[#9698A0] hover:text-[#3077F3] hover:bg-[#EFF5FF] rounded-lg transition-colors disabled:opacity-50"
          title="Refresh messages"
        >
          <ArrowPathIcon
            className={`h-4 w-4 ${isLoadingMessages ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-8">
            <ChatLoader />
          </div>
        ) : sortedMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-[#9698A0] mb-2">
              <svg
                className="h-12 w-12 mx-auto"
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
            <p className="text-[#6D6F7A] font-medium">
              {useConversationMode ? "Start a conversation" : "No messages yet"}
            </p>
            <p className="text-sm text-[#9698A0] mt-1">
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
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-gradient-to-r from-[#3077F3] to-[#B96AF7] text-white"
                    : "bg-[#F5F5F5] text-[#2E3141]"
                }`}
              >
                <div className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    message.role === "user" ? "text-blue-100" : "text-[#9698A0]"
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
        <div className="mx-4 mb-4 p-3 bg-[#FDA052] bg-opacity-10 border border-[#FDA052] border-opacity-20 rounded-lg">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-[#FDA052]" />
            <p className="text-sm text-[#2E3141] font-medium">
              {sendError || getError || conversationError}
            </p>
          </div>
          <div className="flex space-x-2 mt-2">
            {sendError && (
              <button
                onClick={clearSendError}
                className="text-xs text-[#FDA052] hover:text-[#FD8A02] underline"
              >
                Clear Error
              </button>
            )}
            {getError && (
              <button
                onClick={clearGetError}
                className="text-xs text-[#FDA052] hover:text-[#FD8A02] underline"
              >
                Clear Error
              </button>
            )}
            {conversationError && (
              <button
                onClick={clearConversationError}
                className="text-xs text-[#FDA052] hover:text-[#FD8A02] underline"
              >
                Clear Error
              </button>
            )}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-[#EAEAEC]">
        <div className="flex space-x-2">
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
              className="w-full px-3 py-2 border border-[#D5D6D9] rounded-lg focus:ring-2 focus:ring-[#3077F3] focus:ring-opacity-20 focus:border-[#3077F3] resize-none disabled:opacity-50 text-[#2E3141] placeholder-[#9698A0]"
              rows={1}
              style={{ minHeight: "40px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={
              !messageInput.trim() ||
              (useConversationMode ? isConversationLoading : isSending) ||
              isTyping
            }
            className="px-4 py-2 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] text-white rounded-lg hover:from-[#1E50A8] hover:to-[#9D58E5] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
            title={useConversationMode ? "Send message to AI" : "Send message"}
          >
            {(useConversationMode ? isConversationLoading : isSending) ||
            isTyping ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <PaperAirplaneIcon className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-[#9698A0]">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{messageInput.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
