import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import type { IPitchDeck, IChatMessage, IPitchDeckStats } from "../types";
import { EChatRole, EPitchDeckStatus } from "../types";
import {
  CHAT_CONFIG,
  formatTime,
  createMessage,
  generateAIResponse,
} from "../utils/chat";

interface IPitchChatWidgetProps {
  pitchDecks: IPitchDeck[];
  isOpen: boolean;
  onToggle: () => void;
}

const PitchChatWidget = ({
  pitchDecks,
  isOpen,
  onToggle,
}: IPitchChatWidgetProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([
    createMessage(CHAT_CONFIG.initialMessage, EChatRole.ASSISTANT),
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const deckStats: IPitchDeckStats = useMemo(() => {
    const completed = pitchDecks.filter(
      (deck) => deck.status === EPitchDeckStatus.COMPLETED
    ).length;
    const analyzing = pitchDecks.filter(
      (deck) => deck.status === EPitchDeckStatus.ANALYZING
    ).length;
    const uploading = pitchDecks.filter(
      (deck) => deck.status === EPitchDeckStatus.UPLOADING
    ).length;

    return {
      completed,
      analyzing,
      uploading,
      total: pitchDecks.length,
    };
  }, [pitchDecks]);

  const characterCount = useMemo(() => inputMessage.length, [inputMessage]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!inputMessage.trim() || isTyping) return;

      const userMessage = createMessage(inputMessage, EChatRole.USER);

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      try {
        setTimeout(() => {
          const response = generateAIResponse(
            inputMessage,
            pitchDecks,
            deckStats
          );

          const aiMessage = createMessage(response, EChatRole.ASSISTANT);
          setMessages((prev) => [...prev, aiMessage]);
          setIsTyping(false);
        }, CHAT_CONFIG.typingDelay);
      } catch (error) {
        console.error("Failed to generate AI response:", error);

        const errorMessage = createMessage(
          "I'm sorry, I encountered an error. Please try again.",
          EChatRole.ASSISTANT
        );

        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
      }
    },
    [inputMessage, isTyping, pitchDecks, deckStats]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const renderMessage = useCallback(
    (message: IChatMessage) => (
      <div
        key={message.id}
        className={`flex ${
          message.role === "user" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[80%] rounded-lg px-4 py-3 ${
            message.role === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900"
          }`}
        >
          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
          <div
            className={`text-xs mt-1 ${
              message.role === "user" ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    ),
    []
  );

  const renderTypingIndicator = useCallback(
    () => (
      <div className="flex justify-start">
        <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
          <div
            className="flex space-x-1"
            role="status"
            aria-label="AI is typing"
          >
            {[0, 0.1, 0.2].map((delay, index) => (
              <div
                key={index}
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    []
  );

  return (
    <>
      <div className="fixed z-[9999] bottom-4 right-4 sm:bottom-8 sm:right-8 group">
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Chat with AI about your pitch decks
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>

        <button
          onClick={onToggle}
          className={`w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
          }`}
          aria-label="Open chat"
          style={{
            boxShadow:
              "0 10px 25px rgba(59, 130, 246, 0.4), 0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ChatBubbleLeftRightIcon className="w-7 h-7" />

          <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20" />

          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
            AI
          </div>
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed z-[9998] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col transform transition-all duration-300 animate-in slide-in-from-bottom-2 
          bottom-4 right-4 w-[calc(100vw-2rem)] h-[calc(100vh-8rem)] 
          sm:bottom-8 sm:right-8 sm:w-80 sm:h-[500px] 
          md:w-96 md:h-[500px] 
          lg:w-[420px] lg:h-[500px]"
        >
          <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BoltIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Chat with AI</h3>
                <p className="text-xs text-blue-100">
                  Ask about your pitch decks
                </p>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
              aria-label="Close chat"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </header>

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4"
            role="log"
            aria-label="Chat messages"
          >
            {messages.map(renderMessage)}
            {isTyping && renderTypingIndicator()}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200"
          >
            <div className="space-y-2">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about the pitch deck..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  maxLength={CHAT_CONFIG.maxCharacters}
                  onKeyDown={handleKeyDown}
                  aria-label="Type your message"
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {characterCount}/{CHAT_CONFIG.maxCharacters}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  Press Enter to send, Shift+Enter for new line
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="Send message"
                >
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PitchChatWidget;
