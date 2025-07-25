import type {
  CreateChatSessionRequest,
  CreateChatSessionResponse,
} from "../types/types";

/**
 * Chat Session API Service with Dummy Data
 *
 * Simulates backend API operations with dummy data and network delays.
 * This allows development and testing without a running backend.
 */

// Dummy data storage (simulates database)
let dummySessions: CreateChatSessionResponse[] = [
  {
    id: "session-1",
    title: "PDF Document Analysis",
    created_at: "2025-01-15T10:30:00.000Z",
  },
  {
    id: "session-2",
    title: "Technical Documentation",
    created_at: "2025-01-14T15:45:00.000Z",
  },
  {
    id: "session-3",
    title: "Research Paper Discussion",
    created_at: "2025-01-13T09:20:00.000Z",
  },
];

// Simulate network delay
const simulateNetworkDelay = (min = 300, max = 800) => {
  return new Promise((resolve) =>
    setTimeout(resolve, Math.random() * (max - min) + min)
  );
};

// Generate unique ID
const generateId = () =>
  `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Create a new chat session
 *
 * @param payload - The chat session creation payload
 * @returns Promise<CreateChatSessionResponse>
 *
 * @example
 * ```typescript
 * const newSession = await createChatSession({
 *   title: "This is the topic related to the cricket",
 *   user_id: "eac74e41-5d4b-44ba-b531-22a0cc19d5cc"
 * });
 * ```
 */
export const createChatSession = async (
  payload: CreateChatSessionRequest
): Promise<CreateChatSessionResponse> => {
  try {
    console.log("🚀 Creating new chat session with payload:", payload);

    // Simulate network delay
    await simulateNetworkDelay();

    // Simulate occasional network errors (10% chance)
    if (Math.random() < 0.1) {
      throw new Error("Network error: Failed to create chat session");
    }

    // Create new session
    const newSession: CreateChatSessionResponse = {
      id: generateId(),
      title: payload.title,
      created_at: new Date().toISOString(),
    };

    // Add to dummy storage
    dummySessions.unshift(newSession);

    console.log("✅ Chat session created successfully:", newSession);
    return newSession;
  } catch (error) {
    console.error("❌ Error creating chat session:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to create chat session: ${error.message}`);
    }

    throw new Error("Failed to create chat session: Unknown error");
  }
};

/**
 * Fetch all chat sessions for a user
 *
 * @param userId - The user ID to fetch sessions for
 * @returns Promise<CreateChatSessionResponse[]>
 */
export const getChatSessions = async (
  userId: string
): Promise<CreateChatSessionResponse[]> => {
  try {
    console.log("📋 Fetching chat sessions for user:", userId);

    // Simulate network delay
    await simulateNetworkDelay();

    // Simulate occasional network errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Network error: Failed to fetch chat sessions");
    }

    // Return dummy sessions (filtered by user if needed)
    const userSessions = dummySessions.filter(
      () =>
        // In a real app, you'd filter by userId
        // For now, return all sessions
        true
    );

    console.log("✅ Chat sessions fetched successfully:", userSessions);
    return userSessions;
  } catch (error) {
    console.error("❌ Error fetching chat sessions:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to fetch chat sessions: ${error.message}`);
    }

    throw new Error("Failed to fetch chat sessions: Unknown error");
  }
};

/**
 * Update a chat session
 *
 * @param sessionId - The session ID to update
 * @param updates - The updates to apply
 * @returns Promise<CreateChatSessionResponse>
 */
export const updateChatSession = async (
  sessionId: string,
  updates: Partial<CreateChatSessionRequest>
): Promise<CreateChatSessionResponse> => {
  try {
    console.log(
      "🔄 Updating chat session:",
      sessionId,
      "with updates:",
      updates
    );

    // Simulate network delay
    await simulateNetworkDelay();

    // Find and update session
    const sessionIndex = dummySessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error("Session not found");
    }

    const updatedSession: CreateChatSessionResponse = {
      ...dummySessions[sessionIndex],
      ...(updates.title && { title: updates.title }),
    };

    dummySessions[sessionIndex] = updatedSession;

    console.log("✅ Chat session updated successfully:", updatedSession);
    return updatedSession;
  } catch (error) {
    console.error("❌ Error updating chat session:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to update chat session: ${error.message}`);
    }

    throw new Error("Failed to update chat session: Unknown error");
  }
};

/**
 * Delete a chat session
 *
 * @param sessionId - The session ID to delete
 * @returns Promise<void>
 */
export const deleteChatSession = async (sessionId: string): Promise<void> => {
  try {
    console.log("🗑️ Deleting chat session:", sessionId);

    // Simulate network delay
    await simulateNetworkDelay();

    // Remove session from dummy storage
    const sessionIndex = dummySessions.findIndex((s) => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error("Session not found");
    }

    dummySessions.splice(sessionIndex, 1);

    console.log("✅ Chat session deleted successfully");
  } catch (error) {
    console.error("❌ Error deleting chat session:", error);

    if (error instanceof Error) {
      throw new Error(`Failed to delete chat session: ${error.message}`);
    }

    throw new Error("Failed to delete chat session: Unknown error");
  }
};

/**
 * Reset dummy data (for testing purposes)
 */
export const resetDummyData = () => {
  dummySessions = [
    {
      id: "session-1",
      title: "PDF Document Analysis",
      created_at: "2025-01-15T10:30:00.000Z",
    },
    {
      id: "session-2",
      title: "Technical Documentation",
      created_at: "2025-01-14T15:45:00.000Z",
    },
    {
      id: "session-3",
      title: "Research Paper Discussion",
      created_at: "2025-01-13T09:20:00.000Z",
    },
  ];
  console.log("🔄 Dummy data reset");
};
