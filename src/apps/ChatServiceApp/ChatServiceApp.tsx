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
      <div className="h-screen w-full bg-gradient-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#EAEAEC] flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl shadow-2xl border border-[#D5D6D9] max-w-md mx-auto">
          {/* Professional Loading Animation */}
          <div className="relative mb-10">
            <div className="w-20 h-20 border-4 border-[#D5D6D9] border-t-[#3077F3] rounded-full animate-spin mx-auto shadow-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 border-4 border-transparent border-t-[#B96AF7] rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-transparent border-t-[#41E6F8] rounded-full animate-spin"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-[#2E3141] mb-3">
            Loading ChatAI
          </h3>
          <p className="text-[#6D6F7A] text-sm leading-relaxed">
            Setting up your intelligent conversation experience...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if sessions fail to load
  if (sessionsError) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#EAEAEC] flex items-center justify-center p-6">
        <div className="text-center max-w-lg mx-auto p-12 bg-white rounded-3xl shadow-2xl border border-[#D5D6D9]">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FDA052] to-[#FD8A02] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg
              className="w-10 h-10 text-white"
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
          <h3 className="text-2xl font-semibold text-[#2E3141] mb-4">
            Connection Failed
          </h3>
          <p className="text-[#6D6F7A] text-base mb-8 leading-relaxed">
            {sessionsError.message ||
              "Unable to load your conversations. Please check your connection and try again."}
          </p>
          <button
            onClick={() => refetchSessions()}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#3077F3] to-[#B96AF7] text-white text-base font-medium rounded-2xl hover:from-[#1E50A8] hover:to-[#9D58E5] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg
              className="w-5 h-5 mr-3"
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
    <div className="h-screen w-full bg-gradient-to-br from-[#FFFFFF] via-[#F5F5F5] to-[#EAEAEC] flex">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-[#3077F3]/5 to-[#B96AF7]/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#41E6F8]/5 to-[#FDA052]/5 rounded-full blur-3xl"></div>
      </div>

      {/* Sidebar */}
      <div
        className={`relative z-30 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-500 ease-in-out md:translate-x-0 md:static md:inset-auto w-96 flex-shrink-0`}
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
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-20 md:hidden transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 h-full">
        {/* Chat Header */}
        <div className="flex-shrink-0">
          <ChatHeader
            onMenuToggle={toggleSidebar}
            title={selectedChat?.title || "Select a Chat"}
            subtitle={
              selectedChat
                ? `${selectedChat.messages.length} messages`
                : "Choose a conversation to start chatting"
            }
            onClearChat={handleClearChat}
            onRenameChat={handleRenameChat}
          />
        </div>

        {/* Tools Bar */}
        <div className="flex-shrink-0">
          <Tools />
        </div>

        {/* Chat Content - Fixed Height Container */}
        <div className="flex-1 flex flex-col min-h-0 relative bg-white/50 backdrop-blur-sm m-4 rounded-3xl shadow-xl border border-[#D5D6D9]">
          {/* Messages Area - Takes remaining space */}
          <div className="flex-1 min-h-0 relative rounded-t-3xl overflow-hidden">
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
