import {
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import { ModelType } from "../types/types";
import { ModelSelectorDropdown } from "./ModelSelectorDropdown";

interface ChatHeaderProps {
  title?: string;
  subtitle?: string;
  selectedModel?: ModelType;
  onClearChat?: () => void;
  onRenameChat?: (newName: string) => void;
  onModelChange?: (model: ModelType) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "New Chat",
  subtitle,
  selectedModel = ModelType.OPENAI,
  onClearChat,
  onRenameChat,
  onModelChange,
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
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Title Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400/30">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                {title}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-3 w-3 text-blue-500" />
                  <span className="font-semibold text-gray-700">
                    {subtitle}
                  </span>
                </div>
                {onModelChange && (
                  <>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <ModelSelectorDropdown
                      selectedModel={selectedModel}
                      onModelChange={onModelChange}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={handleRename}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 font-semibold flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <PencilIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-sm">
                        Rename Chat
                      </span>
                      <span className="text-xs text-gray-500 font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 font-semibold flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <TrashIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <span className="block font-bold text-sm">
                        Clear Chat
                      </span>
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
      <div className="h-px bg-gray-200"></div>
    </div>
  );
};
