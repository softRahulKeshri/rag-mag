import { Bars3Icon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useRef, useState } from 'react';

interface ChatHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  onClearChat?: () => void;
  onRenameChat?: (newName: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  onMenuToggle, 
  title = 'New Chat',
  subtitle,
  onClearChat,
  onRenameChat
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleRename = () => {
    const newName = prompt('Enter new chat name:', title);
    if (newName && newName !== title && onRenameChat) {
      onRenameChat(newName);
    }
    setIsMenuOpen(false);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear this chat? This cannot be undone.')) {
      onClearChat?.();
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-3 shadow-sm">
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="mr-2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors md:hidden"
          aria-label="Toggle menu"
        >
          <Bars3Icon className="h-5 w-5" />
        </button>
        <div className="ml-1">
          <h2 className="text-base font-medium text-white line-clamp-1">{title}</h2>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
          aria-label="Chat options"
        >
          <EllipsisVerticalIcon className="h-5 w-5 cursor-pointer" />
        </button>

        {isMenuOpen && (
          <div 
            ref={menuRef}
            className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden z-10"
          >
            <button
              onClick={handleRename}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              Rename Chat
            </button>
            <button
              onClick={handleClearChat}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors cursor-pointer"
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
