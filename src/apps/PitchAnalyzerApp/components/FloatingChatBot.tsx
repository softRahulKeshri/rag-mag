import { useState, useCallback, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { useChatWithAI } from "../hooks/useChatWithAI";
import type { Pitch } from "../types/types";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface FloatingChatBotProps {
  pitch: Pitch;
  userEmail: string;
  isOpen: boolean;
  onClose: () => void;
}

const FloatingChatBot = ({
  pitch,
  userEmail,
  isOpen,
  onClose,
}: FloatingChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { chatWithAI, isLoading, error, clearError } = useChatWithAI();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputMessage]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await chatWithAI(pitch.id, inputMessage, userEmail);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.queryRespFromAi,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [inputMessage, isLoading, chatWithAI, pitch.id, userEmail]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              Chat with AI
            </h3>
            <p className="text-xs text-gray-500">
              {pitch.title || pitch.filename}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Start a conversation
            </h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              Ask me anything about this pitch deck. I can help you analyze the
              business model, financials, market opportunity, and more.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                message.isUser
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              }`}
            >
              <p className="leading-relaxed">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.isUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 px-3 py-2 rounded-2xl border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">AI is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-4 mb-3 p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
              <XMarkIcon className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
            >
              <XMarkIcon className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input Section */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the pitch deck..."
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-sm"
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="flex-shrink-0 p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {inputMessage.length}/100 characters
        </p>
      </div>
    </div>
  );
};

export default FloatingChatBot;
