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
        className={`group relative p-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
          isSelected
            ? "bg-[#F7F7F8] text-[#2E3141]"
            : "hover:bg-[#F5F5F5] text-[#2E3141]"
        }`}
        title={chat.title || "New Chat"}
      >
        <div className="flex items-center justify-center">
          <div className="w-2 h-2 bg-[#3077F3] rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`group relative p-3 rounded-lg transition-all duration-300 ease-in-out cursor-pointer ${
        isSelected
          ? "bg-[#F7F7F8] text-[#2E3141]"
          : "hover:bg-[#F5F5F5] text-[#2E3141]"
      }`}
    >
      {/* Simple Chat Title */}
      <div className="flex items-center">
        <h3
          className="text-sm font-medium transition-colors duration-300 truncate"
          title={chat.title || "New Chat"}
        >
          {chat.title || "New Chat"}
        </h3>
      </div>
    </div>
  );
};

export default ChatListItem;
