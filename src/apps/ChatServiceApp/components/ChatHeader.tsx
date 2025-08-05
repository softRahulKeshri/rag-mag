import {
  EllipsisVerticalIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  Bars3Icon,
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
  onToggleSidebar?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = "New Chat",
  subtitle,
  selectedModel = ModelType.OPENAI,
  onClearChat,
  onRenameChat,
  onModelChange,
  onToggleSidebar,
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
    <div className="bg-white border-b border-[#EAEAEC] shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 h-14">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Sidebar Toggle */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-[#6D6F7A] hover:text-[#2E3141] rounded-lg hover:bg-[#F7F7F8] transition-all duration-300 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          )}

          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
             
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-semibold text-[#2E3141] leading-tight">
                {title}
              </h1>
              <div className="flex items-center space-x-2 text-xs text-[#6D6F7A]">
                <div className="flex items-center space-x-1">
                  <ClockIcon className="h-3 w-3 text-[#3077F3]" />
                  <span className="font-medium text-[#6D6F7A]">{subtitle}</span>
                </div>
                {onModelChange && (
                  <>
                    <div className="w-1 h-1 bg-[#D5D6D9] rounded-full"></div>
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
        <div className="flex items-center space-x-2">
          {/* Menu Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-[#6D6F7A] hover:text-[#2E3141] rounded-lg hover:bg-[#F7F7F8] transition-all duration-300 cursor-pointer"
              aria-label="More options"
            >
              <EllipsisVerticalIcon className="h-5 w-5" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#EAEAEC] rounded-lg shadow-lg z-50 overflow-hidden">
                <div className="py-2">
                  <button
                    onClick={handleRename}
                    className="w-full px-4 py-3 text-left text-sm text-[#2E3141] hover:text-[#3077F3] hover:bg-[#F7F7F8] transition-all duration-300 font-medium flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-[#F7F7F8] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PencilIcon className="h-4 w-4 text-[#3077F3]" />
                    </div>
                    <div>
                      <span className="block font-semibold text-sm">
                        Rename Chat
                      </span>
                      <span className="text-xs text-[#6D6F7A] font-normal">
                        Change conversation title
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={handleClearChat}
                    className="w-full px-4 py-3 text-left text-sm text-[#2E3141] hover:text-[#EF4444] hover:bg-[#FEF2F2] transition-all duration-300 font-medium flex items-center space-x-3 group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-[#FEF2F2] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrashIcon className="h-4 w-4 text-[#EF4444]" />
                    </div>
                    <div>
                      <span className="block font-semibold text-sm">
                        Clear Chat
                      </span>
                      <span className="text-xs text-[#6D6F7A] group-hover:text-[#EF4444] font-normal">
                        Remove all messages
                      </span>
                    </div>
                  </button>
                </div>

                {/* Menu Arrow */}
                <div className="absolute -top-1 right-4 w-2 h-2 bg-white border-l border-t border-[#EAEAEC] transform rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
