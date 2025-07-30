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
      <div className="flex items-center justify-between px-6 py-5 h-18">
        {/* Left Section */}
        <div className="flex items-center space-x-5">
          {/* Menu Button */}
          <button
            onClick={onMenuToggle}
            className="p-3 text-gray-500 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-300"
            aria-label="Toggle menu"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>

          {/* Title Section */}
          <div className="flex items-center space-x-5">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border border-blue-400/30">
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white shadow-lg"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-gray-700">
                    {subtitle}
                  </span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span className="font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                  {modelNames[selectedModel]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* AI Status Indicator */}
          <div className="hidden sm:flex items-center space-x-3 px-5 py-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
            <span className="text-sm font-bold text-gray-700">AI Ready</span>
            <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
          </div>

          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-gray-500 hover:text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-300"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="py-3">
                  <button
                    onClick={handleRename}
                    className="w-full px-5 py-4 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center space-x-4 group"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PencilIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-base">
                        Rename Chat
                      </span>
                      <span className="text-xs text-gray-500 font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-5 py-4 text-left text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold flex items-center space-x-4 group"
                  >
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrashIcon className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-base">
                        Clear Chat
                      </span>
                      <span className="text-xs text-gray-500 group-hover:text-red-500 font-normal">
                        Remove all messages
                      </span>
                    </div>
                  </button>
                </div>

                {/* Menu Arrow */}
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="h-px bg-gray-200"></div>
    </div>
  );
};
