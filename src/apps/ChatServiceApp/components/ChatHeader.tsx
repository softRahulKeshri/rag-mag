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
    <div className="bg-white/95 backdrop-blur-xl border-b border-[#EAEAEC] shadow-lg">
      <div className="flex items-center justify-between px-8 py-6 h-20">
        {/* Enhanced Left Section */}
        <div className="flex items-center space-x-6">
          {/* Enhanced Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-3 text-[#6D6F7A] hover:text-[#3077F3] rounded-2xl hover:bg-[#EFF5FF] transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Enhanced Title Section */}
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-gradient-to-br from-[#3077F3] to-[#B96AF7] rounded-2xl flex items-center justify-center shadow-xl">
              <ChatBubbleLeftRightIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#2E3141] leading-tight tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <div className="flex items-center space-x-3 text-sm text-[#6D6F7A] mt-1">
                  <ClockIcon className="h-4 w-4" />
                  <span className="font-semibold">{subtitle}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Right Section */}
        <div className="flex items-center space-x-4">
          {/* Enhanced AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-3 px-5 py-3 bg-[#41E6F8]/10 rounded-full border border-[#41E6F8]/20 shadow-lg">
            <div className="w-3 h-3 bg-[#41E6F8] rounded-full animate-pulse shadow-sm"></div>
            <span className="text-sm font-bold text-[#2E3141]">AI Ready</span>
            <SparklesIcon className="h-4 w-4 text-[#41E6F8] animate-pulse" />
          </div>

          {/* Enhanced Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-[#6D6F7A] hover:text-[#3077F3] rounded-2xl hover:bg-[#EFF5FF] transition-all duration-300 hover:scale-110 shadow-md hover:shadow-lg"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-6 w-6" />
            </button>

            {/* Enhanced Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-[#EAEAEC] rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="py-3">
                  <button
                    onClick={handleRename}
                    className="w-full px-6 py-4 text-left text-base text-[#2E3141] hover:text-[#3077F3] hover:bg-[#EFF5FF] transition-all duration-300 font-semibold flex items-center space-x-4"
                  >
                    <div className="w-12 h-12 bg-[#3077F3] rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <svg
                        className="h-6 w-6 text-white"
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
                      <span className="text-xs text-[#9698A0] font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-6 py-4 text-left text-base text-[#2E3141] hover:text-[#FDA052] hover:bg-[#FDA052]/10 transition-all duration-300 font-semibold flex items-center space-x-4 group"
                  >
                    <div className="w-12 h-12 bg-[#FDA052] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <svg
                        className="h-6 w-6 text-white"
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
                      <span className="text-xs text-[#9698A0] group-hover:text-[#FDA052] font-normal">
                        Remove all messages
                      </span>
                    </div>
                  </button>
                </div>

                {/* Enhanced Menu Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-[#EAEAEC] transform rotate-45 shadow-lg"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Border */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#3077F3]/30 to-transparent"></div>
    </div>
  );
};
