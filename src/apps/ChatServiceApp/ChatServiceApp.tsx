import { useState } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessages } from "./components/ChatMessages";
import { MessageInput } from "./components/MessageInput";
import { Tools } from "./components/Tools";
import { useChatWebSocket } from "./hooks/useChatWebSocket";
import { useCreateChatSessionEnhanced, useChatSessionsEnhanced } from "./hooks";
import { mockChats } from "./constant";
import { createNewChat, getChatTitle } from "./utils/chatUtils";
import type { IChat, CreateChatSessionResponse } from "./types/types";

const ChatServiceApp = () => {
  // TODO: Replace with actual user ID from auth context
  const userId = "eac74e41-5d4b-44ba-b531-22a0cc19d5cc";

  const [chats, setChats] = useState<IChat[]>(mockChats);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(
    chats[0]?.id || null
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // React Query hooks for chat sessions
  const { createDefaultSession, isPending: isCreatingSession } =
    useCreateChatSessionEnhanced();

  const {
    data: chatSessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    refetch: refetchSessions,
  } = useChatSessionsEnhanced(userId);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;
  const { sendChatMessage, isSending } = useChatWebSocket(
    selectedChatId,
    setChats
  );

  // Transform API sessions to local chat format
  const transformSessionsToChats = (
    sessions: CreateChatSessionResponse[]
  ): IChat[] => {
    return sessions.map((session) => ({
      id: parseInt(session.id.replace(/\D/g, "")) || Date.now(), // Extract numbers from ID
      title: session.title,
      timestamp: session.created_at,
      messages: [], // Start with empty messages
    }));
  };

  // Use API data when available, otherwise fall back to local chats
  const currentChats =
    chatSessions && Array.isArray(chatSessions) && chatSessions.length > 0
      ? transformSessionsToChats(chatSessions)
      : chats;

  // Ensure we have a selected chat
  const effectiveSelectedChatId =
    selectedChatId || (currentChats.length > 0 ? currentChats[0].id : null);

  const handleChatSelect = (chatId: number) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = async () => {
    try {
      console.log("🔄 Creating new chat session via API...");

      // Call the API to create a new session
      const newSession = await createDefaultSession(
        userId,
        (session: CreateChatSessionResponse) => {
          console.log("✅ New chat session created via API:", session);

          // Transform the API response to local chat format
          const newChat: IChat = {
            id: parseInt(session.id.replace(/\D/g, "")) || Date.now(),
            title: session.title,
            timestamp: session.created_at,
            messages: [],
          };

          // Add to local state immediately
          setChats((prevChats) => [newChat, ...prevChats]);
          setSelectedChatId(newChat.id);
          setIsSidebarOpen(false);

          // Refetch sessions to update the cache with the new session
          refetchSessions();

          console.log("🎉 New chat session rendered successfully!");
        },
        (error: Error) => {
          console.error("❌ Failed to create chat session via API:", error);
          // Fallback to local creation if API fails
          const fallbackChat = createNewChat();
          setChats((prevChats) => [fallbackChat, ...prevChats]);
          setSelectedChatId(fallbackChat.id);
          setIsSidebarOpen(false);
          console.log("🔄 Fallback: Created local chat session");
        }
      );

      console.log("📡 API call completed, session data:", newSession);
    } catch (error) {
      console.error("❌ Error in handleNewChat:", error);
      // Fallback to local creation
      const fallbackChat = createNewChat();
      setChats((prevChats) => [fallbackChat, ...prevChats]);
      setSelectedChatId(fallbackChat.id);
      setIsSidebarOpen(false);
      console.log("🔄 Fallback: Created local chat session due to error");
    }
  };

  const handleRenameChat = (newName: string) => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId ? { ...chat, title: newName } : chat
      )
    );
  };

  const handleClearChat = () => {
    if (!selectedChatId) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId ? { ...chat, messages: [] } : chat
      )
    );
  };

  const handleSendMessage = async (content: string, file?: File) => {
    if (!selectedChatId || (!content.trim() && !file)) return;

    // Update chat title if it's the first message
    if (selectedChat?.messages.length === 0) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
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

  // Show loading state while fetching sessions
  if (isLoadingSessions) {
    return (
      <div className="flex h-screen bg-neutral-n100 text-neutral-n-black overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-ui-blue-p500 mx-auto mb-4"></div>
            <p className="text-neutral-n600">Loading chat sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if sessions fail to load
  if (sessionsError) {
    return (
      <div className="flex h-screen bg-neutral-n100 text-neutral-n-black overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg
                className="h-12 w-12 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-neutral-n-black mb-2">
              Failed to load chat sessions
            </h3>
            <p className="text-neutral-n600 mb-4">{sessionsError.message}</p>
            <button
              onClick={() => refetchSessions()}
              className="px-4 py-2 bg-primary-ui-blue-p500 text-white rounded-lg hover:bg-primary-ui-blue-p600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-n50 via-neutral-n100 to-neutral-n50 text-neutral-n-black overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <ChatSidebar
          chats={currentChats}
          selectedChatId={effectiveSelectedChatId}
          onSelectChat={handleChatSelect}
          onNewChat={handleNewChat}
          isCreatingSession={isCreatingSession}
        />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-neutral-n-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-neutral-n-white shadow-lg">
        <ChatHeader
          onMenuToggle={toggleSidebar}
          title={selectedChat?.title || "New Chat"}
          onClearChat={handleClearChat}
          onRenameChat={handleRenameChat}
        />

        <div className="flex-1 overflow-y-auto min-h-0">
          {selectedChat ? (
            <>
              <Tools />
              <ChatMessages messages={selectedChat.messages} />
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-neutral-n50 to-neutral-n100">
              <div className="text-center text-neutral-n600 max-w-md mx-auto px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary-ui-blue-p100 to-primary-ui-blue-p200 mb-6">
                  <svg
                    className="h-8 w-8 text-primary-ui-blue-p600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-neutral-n-black mb-3">
                  Welcome to Chat Service
                </h3>
                <p className="text-neutral-n600 leading-relaxed">
                  Select a chat from the sidebar or create a new one to start
                  your conversation
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedChat && (
          <div className="flex-shrink-0 w-full bg-neutral-n-white border-t border-neutral-n200">
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
