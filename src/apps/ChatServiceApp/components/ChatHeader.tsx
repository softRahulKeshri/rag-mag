import { Bars3Icon, EllipsisVerticalIcon } from "@heroicons/react/24/outline";
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
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-[#6D6F7A] hover:bg-[#F5F5F5] hover:text-[#434654] transition-colors md:hidden flex-shrink-0"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-[#2E3141] truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#6D6F7A] mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-[#6D6F7A] hover:bg-[#F5F5F5] hover:text-[#434654] transition-colors"
              aria-label="Chat options"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div
                ref={menuRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#EAEAEC] overflow-hidden z-10"
              >
                <button
                  onClick={handleRename}
                  className="w-full text-left px-4 py-3 text-sm text-[#434654] hover:bg-[#F5F5F5] transition-colors font-medium"
                >
                  Rename Chat
                </button>
                <button
                  onClick={handleClearChat}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                >
                  Clear Chat
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
