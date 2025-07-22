import { useState } from 'react';
import { ChatHeader } from './components/ChatHeader';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatMessages } from './components/ChatMessages';
import { MessageInput } from './components/MessageInput';
import { Tools } from './components/Tools';
import { useChatWebSocket } from './hooks/useChatWebSocket';
import { mockChats } from './constant';
import { createNewChat, getChatTitle } from './utils/chatUtils';
import type { IChat } from './types/types';

const ChatServiceApp = () => {
  const [chats, setChats] = useState<IChat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(chats[0]?.id || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;
  const { sendChatMessage, isSending } = useChatWebSocket(selectedChatId, setChats);

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = () => {
    const newChat = createNewChat();
    setChats([newChat, ...chats]);
    setSelectedChatId(newChat.id);
    setIsSidebarOpen(false);
  };

  const handleRenameChat = (newName: string) => {
    if (!selectedChatId) return;
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, title: newName }
          : chat
      )
    );
  };

  const handleClearChat = () => {
    if (!selectedChatId) return;
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChatId
          ? { ...chat, messages: [] }
          : chat
      )
    );
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!selectedChatId || (!content.trim() && !file)) return;
    
    // Update chat title if it's the first message
    if (selectedChat?.messages.length === 0) {
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === selectedChatId
            ? { ...chat, title: getChatTitle(content, chat.title) }
            : chat
        )
      );
    }
    
    await sendChatMessage(content, file);
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}>
        <ChatSidebar 
          chats={chats} 
          selectedChatId={selectedChatId}
          onSelectChat={handleChatSelect}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatHeader 
          onMenuToggle={toggleSidebar} 
          title={selectedChat?.title || 'New Chat'}
          onClearChat={handleClearChat}
          onRenameChat={handleRenameChat}
        />
        
        <div className="flex-1 overflow-y-auto">
          {selectedChat ? (
            <>
              <Tools />
              <ChatMessages messages={selectedChat.messages} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <p>Select a chat or create a new one to get started</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input */}
        {selectedChat && (
          <div className="w-full bg-gray-900 border-t border-gray-700 p-4">
            <MessageInput 
              onSendMessage={handleSendMessage} 
              isSending={isSending} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatServiceApp;
