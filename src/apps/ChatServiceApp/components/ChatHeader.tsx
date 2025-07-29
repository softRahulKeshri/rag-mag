import {
  Bars3Icon,
  EllipsisVerticalIcon,
  SparklesIcon,
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
    if (newName && newName !== title && onRenameChat) {
      onRenameChat(newName);
    }
    setIsMenuOpen(false);
  };

  const handleClearChat = () => {
    if (
      window.confirm(
        "Are you sure you want to clear this chat? This cannot be undone."
      )
    ) {
      onClearChat?.();
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-[#EAEAEC]/50 shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-2.5 rounded-xl text-[#6D6F7A] hover:bg-[#F5F5F5] hover:text-[#434654] transition-all duration-300 md:hidden flex-shrink-0 hover:scale-105 transform-gpu focus-ring-brand"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-[#2E3141] truncate bg-gradient-to-r from-[#3077F3] to-[#B96AF7] bg-clip-text text-transparent">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#6D6F7A] mt-0.5 truncate font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Premium Status Indicator */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
            <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-sm"></div>
            <span className="text-xs font-medium text-green-700">AI Ready</span>
            <SparklesIcon className="h-3 w-3 text-green-500 animate-pulse" />
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl text-[#6D6F7A] hover:bg-[#F5F5F5] hover:text-[#434654] transition-all duration-300 hover:scale-105 transform-gpu focus-ring-brand"
              aria-label="Chat options"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-[#EAEAEC]/50 overflow-hidden z-10 animate-scale-in"
              >
                <button
                  onClick={handleRename}
                  className="w-full text-left px-4 py-3.5 text-sm text-[#434654] hover:bg-gradient-to-r hover:from-[#F5F5F5] hover:to-[#F0F8FF] transition-all duration-300 font-medium hover:text-[#3077F3] group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1 h-1 bg-[#3077F3] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span>Rename Chat</span>
                  </div>
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-4 py-3.5 text-sm text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-300 font-medium group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-1 h-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span>Clear Chat</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-0 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};
