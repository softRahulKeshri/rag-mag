import {
  Bars3Icon,
  EllipsisVerticalIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

interface ChatHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  onClearChat?: () => void;
  onRenameChat?: (newName: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMenuToggle,
  title = "New Chat",
  subtitle,
  onClearChat,
  onRenameChat,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleRename = () => {
    const newName = prompt("Enter new chat name:", title);
    if (newName && newName.trim() && onRenameChat) {
      onRenameChat(newName.trim());
    }
    setIsMenuOpen(false);
  };

  const handleClearChat = () => {
    if (onClearChat) {
      onClearChat();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 h-14 lg:h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>

          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 lg:w-10 lg:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-cyan-400 rounded-full animate-pulse border border-white"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base lg:text-lg font-semibold text-gray-800 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <ClockIcon className="h-3 w-3" />
                  <span className="font-medium">{subtitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-cyan-50 rounded-full border border-cyan-200">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-700">
              AI Ready
            </span>
            <SparklesIcon className="h-3 w-3 text-cyan-500" />
          </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-blue-500 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-4 w-4 lg:h-5 lg:w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={handleRename}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors font-medium flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="block">Rename Chat</span>
                      <span className="text-xs text-gray-500 font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors font-medium flex items-center space-x-3 group"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="block">Clear Chat</span>
                      <span className="text-xs text-gray-500 group-hover:text-red-500 font-normal">
                        Remove all messages
                      </span>
                    </div>
                  </button>
                </div>

                {/* Menu Arrow */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
    </div>
  );
};
