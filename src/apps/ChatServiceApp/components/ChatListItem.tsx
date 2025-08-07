import type { IChat } from "../types/types";

interface IChatListItemProps {
  chat: IChat;
  isSelected: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
}

const ChatListItem: React.FC<IChatListItemProps> = ({
  chat,
  isSelected,
  onClick,
  isCollapsed = false,
}) => {
  if (isCollapsed) {
    return (
      <div
        onClick={onClick}
        className={`group relative p-1 rounded-md transition-all duration-300 ease-in-out cursor-pointer ${
          isSelected
            ? "bg-purple-50 text-purple-600"
            : "hover:bg-gray-50 text-gray-600"
        }`}
        title={chat.title || "New Chat"}
      >
        <div className="flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`group relative p-2 rounded-md transition-all duration-300 ease-in-out cursor-pointer ${
        isSelected
          ? "bg-purple-50 text-purple-600"
          : "hover:bg-gray-50 text-gray-600"
      }`}
    >
      {/* Simple Chat Title */}
      <div className="flex items-center">
        <h3
          className="text-xs font-medium transition-colors duration-300 truncate"
          title={chat.title || "New Chat"}
        >
          {chat.title || "New Chat"}
        </h3>
      </div>
    </div>
  );
};

export default ChatListItem;
