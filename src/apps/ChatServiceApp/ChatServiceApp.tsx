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
      <div className="flex h-screen bg-white overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center animate-fade-in">
            {/* Spinner Container */}
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-16 h-16 border-4 border-[#3077F3]/20 border-t-[#3077F3] rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-transparent border-t-[#B96AF7]/30 rounded-full animate-spin animate-reverse"></div>
              </div>
            </div>

            {/* Text and Dots Container */}
            <div className="space-y-4">
              <p className="text-[#6D6F7A] text-sm font-medium animate-pulse">
                Loading conversations...
              </p>
              <div className="flex items-center justify-center space-x-1">
                <div
                  className="w-2 h-2 bg-[#3077F3] rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#3077F3] rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-[#3077F3] rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if sessions fail to load
  if (sessionsError) {
    return (
      <div className="flex h-screen bg-white overflow-hidden">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-md mx-auto animate-fade-in">
            {/* Error Icon Container */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center animate-bounce-gentle">
                <svg
                  className="w-8 h-8 text-red-500"
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
            </div>

            {/* Error Text and Button */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2E3141]">
                Failed to Load Conversations
              </h3>
              <p className="text-[#6D6F7A] text-sm leading-relaxed">
                {sessionsError.message}
              </p>
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => refetchSessions()}
                  className="inline-flex items-center px-4 py-2 bg-[#3077F3] text-white text-sm font-medium rounded-lg hover:bg-[#1E50A8] transition-all duration-300 hover:scale-105 hover:shadow-lg transform-gpu"
                >
                  <svg
                    className="w-4 h-4 mr-2 animate-spin-slow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transform transition-all duration-500 ease-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 md:flex-shrink-0`}
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
          className={`fixed inset-0 z-20 bg-black/10 backdrop-blur-sm md:hidden transition-all duration-300 ${
            isSidebarOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-[#EAEAEC]">
          <ChatHeader
            onMenuToggle={toggleSidebar}
            title={selectedChat?.title || "New Chat"}
            onClearChat={handleClearChat}
            onRenameChat={handleRenameChat}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedChat ? (
            <>
              {/* Tools Bar */}
              <div className="flex-shrink-0">
                <Tools />
              </div>

              {/* Messages Area */}
              <div className="flex-1 min-h-0">
                <ChatMessages messages={selectedChat.messages} />
              </div>

              {/* Message Input */}
              <div className="flex-shrink-0">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isSending={isSending}
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#F5F5F5] to-white">
              <div className="text-center max-w-md mx-auto px-6 animate-fade-in-up">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#3077F3]/10 to-[#B96AF7]/10 rounded-2xl flex items-center justify-center mx-auto animate-float hover-glow">
                    <svg
                      className="h-10 w-10 text-[#3077F3] animate-pulse-gentle"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-20 h-20 bg-gradient-to-br from-[#3077F3]/5 to-[#B96AF7]/5 rounded-2xl blur-xl animate-pulse-slow mx-auto"></div>
                </div>
                <h3
                  className="text-xl font-semibold text-[#2E3141] mb-3 animate-fade-in"
                  style={{ animationDelay: "200ms" }}
                >
                  Welcome to ChatAI
                </h3>
                <p
                  className="text-[#6D6F7A] leading-relaxed animate-fade-in"
                  style={{ animationDelay: "400ms" }}
                >
                  Select a conversation from the sidebar or create a new one to
                  start chatting with AI
                </p>
                <div
                  className="mt-8 flex justify-center space-x-6 animate-fade-in"
                  style={{ animationDelay: "600ms" }}
                >
                  <div className="flex items-center space-x-2 text-sm text-[#82838D]">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>AI Ready</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-[#82838D]">
                    <div
                      className="w-2 h-2 bg-[#3077F3] rounded-full animate-pulse"
                      style={{ animationDelay: "1s" }}
                    ></div>
                    <span>Real-time</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatServiceApp;
