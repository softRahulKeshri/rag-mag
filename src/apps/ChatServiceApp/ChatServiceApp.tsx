import ChatSidebar from "./components/ChatSidebar";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import Tools from "./components/Tools";

const ChatServiceApp = () => {
  return (
    <div className="flex h-screen  bg-gray-900 text-white">
      <ChatSidebar />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-10">
          <Tools />
            <ChatMessages />
          </div>
        </div>
        <div className="w-full bg-gray-900 border-t border-gray-700">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default ChatServiceApp;
