import type {
  IPitchDeck,
  IPitchDeckStats,
  IChatMessage,
  IChatConfig,
} from "../types";
import { EChatRole, EPitchDeckStatus } from "../types";

export const CHAT_CONFIG: IChatConfig = {
  maxCharacters: 100,
  typingDelay: 1000,
  initialMessage:
    "Hello! I can help you understand your pitch deck analysis. What would you like to know?",
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const createMessage = (
  content: string,
  role: EChatRole
): IChatMessage => ({
  id: Date.now().toString(),
  content,
  role,
  timestamp: new Date(),
});

export const generateAIResponse = (
  userMessage: string,
  pitchDecks: IPitchDeck[],
  deckStats: IPitchDeckStats
): string => {
  const message = userMessage.toLowerCase();
  const hasCompletedDecks = pitchDecks.some(
    (deck) => deck.status === EPitchDeckStatus.COMPLETED
  );

  if (message.includes("strength") || message.includes("strong")) {
    if (!hasCompletedDecks) {
      return "I don't see any completed pitch deck analyses yet. Please upload and analyze a pitch deck first.";
    }
    return "Based on the analysis, the main strengths include clear market positioning, strong team composition, and compelling value proposition. The financial projections show realistic growth potential.";
  }

  if (
    message.includes("weakness") ||
    message.includes("weak") ||
    message.includes("risk")
  ) {
    if (!hasCompletedDecks) {
      return "I don't see any completed pitch deck analyses yet. Please upload and analyze a pitch deck first.";
    }
    return "The analysis identified potential risks including market competition, regulatory challenges, and dependency on key team members. Consider addressing these areas in your pitch.";
  }

  if (message.includes("recommend") || message.includes("suggest")) {
    if (!hasCompletedDecks) {
      return "I don't see any completed pitch deck analyses yet. Please upload and analyze a pitch deck first.";
    }
    return "I recommend strengthening your competitive analysis, adding more detailed financial projections, and including customer testimonials or case studies to build credibility.";
  }

  if (message.includes("how many") || message.includes("count")) {
    const completedCount = deckStats.completed;
    return `You have ${deckStats.total} pitch deck${
      deckStats.total !== 1 ? "s" : ""
    } uploaded. ${completedCount} analysis${
      completedCount !== 1 ? "es" : ""
    } completed.`;
  }

  if (message.includes("status") || message.includes("progress")) {
    const { completed, analyzing, uploading } = deckStats;
    return `Current status: ${completed} completed, ${analyzing} analyzing, ${uploading} uploading.`;
  }

  return "I can help you understand your pitch deck analysis. You can ask me about strengths, weaknesses, recommendations, or the status of your uploads. What specific aspect would you like to know more about?";
};
