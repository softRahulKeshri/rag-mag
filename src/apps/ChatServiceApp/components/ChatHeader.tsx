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
    <div className="bg-white/90 backdrop-blur-sm border-b border-white/20 shadow-lg">
      <div className="flex items-center justify-between px-6 lg:px-8 py-4 lg:py-6 h-16 lg:h-20">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 lg:p-3 text-slate-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-5 w-5 lg:h-6 lg:w-6" />
          </button>

          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="relative w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 lg:w-4 lg:h-4 bg-cyan-400 rounded-full animate-pulse border-2 border-white shadow-md"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg lg:text-xl font-bold text-slate-800 leading-tight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center space-x-2 lg:space-x-3 text-sm text-slate-500 mt-1">
                  <ClockIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="font-semibold">{subtitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-full border border-cyan-200/50 shadow-lg">
            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-cyan-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-sm font-bold text-slate-700">AI Ready</span>
            <SparklesIcon className="h-3 w-3 lg:h-4 lg:w-4 text-cyan-500 animate-pulse" />
          </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 lg:p-3 text-slate-600 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-5 w-5 lg:h-6 lg:w-6" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 lg:w-64 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="py-3">
                  <button
                    onClick={handleRename}
                    className="w-full px-4 lg:px-6 py-3 lg:py-4 text-left text-sm lg:text-base text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 font-semibold flex items-center space-x-3 lg:space-x-4"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 lg:h-6 lg:w-6 text-white"
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
                      <span className="text-xs text-slate-500 font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 lg:px-6 py-3 lg:py-4 text-left text-sm lg:text-base text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold flex items-center space-x-3 lg:space-x-4 group"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg
                        className="h-5 w-5 lg:h-6 lg:w-6 text-white"
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
                      <span className="text-xs text-slate-500 group-hover:text-red-500 font-normal">
                        Remove all messages
                      </span>
                    </div>
                  </button>
                </div>

                {/* Menu Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white/95 backdrop-blur-sm border-l border-t border-white/20 transform rotate-45 shadow-lg"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
    </div>
  );
};
