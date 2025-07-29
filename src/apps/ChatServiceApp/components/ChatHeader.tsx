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
    <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-lg">
      <div className="flex items-center justify-between px-6 py-4 h-16">
        {/* Enhanced Left Section */}
        <div className="flex items-center space-x-4">
          {/* Enhanced Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2.5 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:scale-110 transform-gpu shadow-md"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Enhanced Title Section */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg border border-indigo-400/30">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-base font-bold text-slate-800 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <ClockIcon className="h-3 w-3" />
                  <span className="font-medium">{subtitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Right Section */}
        <div className="flex items-center space-x-3">
          {/* Enhanced AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-emerald-50 rounded-full border border-emerald-200/50 shadow-md">
            <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-xs font-semibold text-emerald-700">
              AI Ready
            </span>
            <SparklesIcon className="h-3 w-3 text-emerald-500 animate-pulse" />
          </div>

          {/* Enhanced Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 hover:scale-110 transform-gpu shadow-md"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {/* Enhanced Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-2xl shadow-slate-500/20 z-50 animate-scale-in">
                <div className="py-2">
                  <button
                    onClick={handleRename}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 font-medium flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
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
                    <span>Rename Chat</span>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-3 text-left text-sm text-slate-700 hover:text-rose-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 transition-all duration-300 font-medium flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center">
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
                    <span>Clear Chat</span>
                  </button>
                </div>

                {/* Enhanced Menu Arrow */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white/95 backdrop-blur-xl border-l border-t border-slate-200/60 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Border Glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
    </div>
  );
};
