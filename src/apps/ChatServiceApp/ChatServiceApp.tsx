import { useState, useEffect } from "react";
import { useUser } from "../../store";
import { ChatHeader } from "./components/ChatHeader";
import { ChatSidebar } from "./components/ChatSidebar";
import { ChatMessages } from "./components/ChatMessages";
import { MessageInput } from "./components/MessageInput";
import { Tools } from "./components/Tools";
import {
  useCreateChatSessionApi,
  useChatSessionsEnhanced,
  useConversationApi,
  useFetchChatMessages,
} from "./hooks";
import { getChatTitle } from "./utils/chatUtils";
import type { IChat, IMessage, CreateChatSessionResponse } from "./types/types";

const ChatServiceApp = () => {
  // Get user ID from global store
  const user = useUser();
  const userId = user?.id || "eac74e41-5d4b-44ba-b531-22a0cc19d5cc"; // Fallback for development

  const [chats, setChats] = useState<IChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // API hooks for chat sessions
  const {
    createDefaultSession,
    isLoading: isCreatingSession,
    clearError: clearCreateSessionError,
  } = useCreateChatSessionApi();

  const {
    data: chatSessions,
    isLoading: isLoadingSessions,
    error: sessionsError,
    refetch: refetchSessions,
  } = useChatSessionsEnhanced(userId);

  // Conversation API for sending messages and getting AI responses
  const {
    sendUserMessageAndGetResponse,
    isLoading: isConversationLoading,
    clearError: clearConversationError,
  } = useConversationApi();

  // Messages API for fetching chat messages
  const { fetchMessages, clearMessages } = useFetchChatMessages();

  // Transform API sessions to local chat format
  const transformSessionsToChats = (
    sessions: CreateChatSessionResponse[]
  ): IChat[] => {
    return sessions.map((session) => ({
      id: session.id,
      title: session.title,
      timestamp: session.created_at,
      messages: [], // Messages will be loaded separately when chat is selected
    }));
  };

  // Update local chats when API data changes
  useEffect(() => {
    if (chatSessions && Array.isArray(chatSessions)) {
      const transformedChats = transformSessionsToChats(chatSessions);
      setChats(transformedChats);

      // Select first chat if none selected
      if (!selectedChatId && transformedChats.length > 0) {
        setSelectedChatId(transformedChats[0].id);
      }
    }
  }, [chatSessions, selectedChatId]);

  // Load messages when a chat is selected
  useEffect(() => {
    const loadChatMessages = async () => {
      if (selectedChatId) {
        setIsLoadingMessages(true);
        try {
          const messages = await fetchMessages(selectedChatId);
          // Transform API messages to local format
          const transformedMessages: IMessage[] = messages.map((msg) => ({
            id: msg.id,
            content: msg.content,
            role: msg.role,
            timestamp: msg.created_at,
          }));

          // Update the selected chat with loaded messages
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === selectedChatId
                ? { ...chat, messages: transformedMessages }
                : chat
            )
          );
        } catch (error) {
          console.error(
            "Failed to load messages for chat:",
            selectedChatId,
            error
          );
        } finally {
          setIsLoadingMessages(false);
        }
      }
    };

    loadChatMessages();
  }, [selectedChatId, fetchMessages]);

  const selectedChat = chats.find((chat) => chat.id === selectedChatId) || null;

  const handleChatSelect = (chatId: string) => {
    // Clear messages before switching to avoid showing old messages
    clearMessages();
    setSelectedChatId(chatId);
    setIsSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleNewChat = async () => {
    try {
      console.log("🔄 Creating new chat session via API...");
      clearCreateSessionError();

      // Call the API to create a new session
      const newSession = await createDefaultSession(userId);

      console.log("✅ New chat session created via API:", newSession);

      // Transform the API response to local chat format
      const newChat: IChat = {
        id: newSession.id,
        title: newSession.title,
        timestamp: newSession.created_at,
        messages: [],
      };

      // Add to local state immediately
      setChats((prevChats) => [newChat, ...prevChats]);
      setSelectedChatId(newChat.id);
      setIsSidebarOpen(false);

      // Refetch sessions to update the cache with the new session
      refetchSessions();

      console.log("🎉 New chat session rendered successfully!");
    } catch (error) {
      console.error("❌ Error in handleNewChat:", error);
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

    // Create user message for immediate UI update
    const userMessage: IMessage = {
      id: Date.now(),
      content: content || "📎 File attached",
      role: "user" as const,
      timestamp: new Date().toISOString(),
      file: file
        ? {
            name: file.name,
            size: file.size,
            type: file.type,
          }
        : undefined,
    };

    // Update chat with user message immediately
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              timestamp: "Just now",
              title:
                chat.messages.length === 0
                  ? getChatTitle(content, chat.title)
                  : chat.title,
            }
          : chat
      )
    );

    try {
      console.log("📡 Sending message and getting AI response...");

      // Clear any previous conversation errors
      clearConversationError();

      // Send message and get AI response using the conversation API
      const aiResponse = await sendUserMessageAndGetResponse(
        content,
        selectedChatId,
        userId
      );

      console.log("✅ AI response received:", aiResponse);

      // Create AI message from response
      const aiMessage: IMessage = {
        id: aiResponse.id,
        content: aiResponse.content,
        role: aiResponse.role,
        timestamp: aiResponse.created_at,
      };

      // Add AI response to chat
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, aiMessage],
                timestamp: "Just now",
              }
            : chat
        )
      );

      console.log("🎉 Message conversation completed successfully!");
    } catch (error) {
      console.error("❌ Error in conversation:", error);

      // Add error message to show user something went wrong
      const errorMessage: IMessage = {
        id: Date.now() + 1,
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant" as const,
        timestamp: new Date().toISOString(),
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === selectedChatId
            ? {
                ...chat,
                messages: [...chat.messages, errorMessage],
              }
            : chat
        )
      );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Show loading state while fetching sessions
  if (isLoadingSessions) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-sm mx-auto">
          <div className="relative mb-6">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Loading ChatAI
          </h3>
          <p className="text-sm text-gray-500">
            Setting up your conversation experience...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if sessions fail to load
  if (sessionsError) {
    return (
      <div className="h-screen w-full bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
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
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Connection Failed
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {sessionsError.message ||
              "Unable to load your conversations. Please check your connection and try again."}
          </p>
          <button
            onClick={() => refetchSessions()}
            className="inline-flex items-center px-6 py-3 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
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
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white flex overflow-hidden">
      {/* Sidebar */}
      <div
        className={`relative z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto w-80 lg:w-80 xl:w-96 flex-shrink-0`}
      >
        <ChatSidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleChatSelect}
          onNewChat={handleNewChat}
          isCreatingSession={isCreatingSession}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full overflow-hidden">
        {/* Chat Header */}
        <div className="flex-shrink-0">
          <ChatHeader
            onMenuToggle={toggleSidebar}
            title={selectedChat?.title || "New Chat"}
            subtitle={
              selectedChat
                ? `${selectedChat.messages.length} messages`
                : "0 messages"
            }
            onClearChat={handleClearChat}
            onRenameChat={handleRenameChat}
          />
        </div>

        {/* Tools Bar */}
        <div className="flex-shrink-0">
          <Tools />
        </div>

        {/* Chat Content Container */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-white m-4 lg:m-6 rounded-xl border border-gray-100 overflow-hidden">
          {/* Messages Area - Takes remaining space */}
          <div className="flex-1 min-h-0 relative rounded-t-xl overflow-hidden">
            <ChatMessages
              messages={selectedChat?.messages || []}
              isLoading={isLoadingMessages}
            />
          </div>

          {/* Message Input - Fixed at bottom */}
          <div className="flex-shrink-0">
            <MessageInput
              onSendMessage={handleSendMessage}
              isSending={isConversationLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatServiceApp;
