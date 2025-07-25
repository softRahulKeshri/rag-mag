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
    <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200 md:hidden"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-200"
          aria-label="Chat options"
        >
          <EllipsisVerticalIcon className="h-5 w-5" />
        </button>

        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-10"
          >
            <button
              onClick={handleRename}
              className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors font-medium"
            >
              Rename Chat
            </button>
            <button
              onClick={handleClearChat}
              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors font-medium"
            >
              Clear Chat
            </button>
          </div>
        )}
      </div>

      {/* Click outside to close menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-0 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};
