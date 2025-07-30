import {
  Bars3Icon,
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { ModelType } from "../types/types";

interface ChatHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
  selectedModel?: ModelType;
  onClearChat?: () => void;
  onRenameChat?: (newName: string) => void;
}

const modelNames = {
  [ModelType.OPENAI]: "OpenAI GPT",
  [ModelType.ANTHROPIC]: "Anthropic Claude",
  [ModelType.OLLAMA]: "Ollama",
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMenuToggle,
  title = "New Chat",
  subtitle,
  selectedModel = ModelType.OPENAI,
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
    <div className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 h-14 lg:h-16">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-4 w-4 lg:h-5 lg:w-5" />
          </button>

          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg border border-indigo-400/30">
                <ChatBubbleLeftRightIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 lg:w-3 lg:h-3 bg-emerald-400 rounded-full animate-pulse border border-white"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-base lg:text-lg font-semibold text-gray-900 leading-tight">
                {title}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <ClockIcon className="h-3 w-3" />
                <span className="font-medium">{subtitle}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="font-medium text-indigo-600">
                  {modelNames[selectedModel]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-gray-700">
              AI Ready
            </span>
          </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-lg hover:bg-gray-50 transition-colors"
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
                    className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-colors font-medium flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <PencilIcon className="h-4 w-4 text-white" />
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
                      <TrashIcon className="h-4 w-4 text-white" />
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
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
    </div>
  );
};
