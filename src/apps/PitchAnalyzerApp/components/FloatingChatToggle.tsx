import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

interface FloatingChatToggleProps {
  onClick: () => void;
  isVisible: boolean;
}

const FloatingChatToggle = ({
  onClick,
  isVisible,
}: FloatingChatToggleProps) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 group"
      aria-label="Open AI Chat"
    >
      <ChatBubbleLeftRightIcon className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />

      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 animate-ping opacity-20"></div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
        Chat with AI
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default FloatingChatToggle;
