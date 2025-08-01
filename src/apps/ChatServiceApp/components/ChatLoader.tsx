import React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface ChatLoaderProps {
  className?: string;
}

/**
 * ChatLoader Component
 *
 * A single, unified loading UI designed specifically for the ChatServiceApp.
 * Uses the brand color palette (#3077F3, #B96AF7, #FDA052) and automatically
 * adapts to its container context while maintaining consistent visual design.
 *
 * @example
 * ```typescript
 * // Works in any context - automatically adapts
 * <ChatLoader />
 * ```
 */
export const ChatLoader: React.FC<ChatLoaderProps> = ({ className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center space-y-4 ${className}`}
    >
      {/* Brand gradient logo container */}
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-[#3077F3] via-[#B96AF7] to-[#FDA052] rounded-xl flex items-center justify-center shadow-lg">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
        </div>
        {/* Animated accent ring */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] rounded-xl opacity-20 animate-ping" />
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-sm font-medium text-[#2E3141]">Loading...</p>
      </div>

      {/* Animated dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="w-2 h-2 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] rounded-full animate-bounce"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: "1s",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatLoader;
