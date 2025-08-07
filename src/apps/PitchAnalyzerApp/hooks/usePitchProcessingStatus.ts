import { useState, useCallback, useEffect, useRef } from "react";
import { pitchApi } from "../../../lib/axios";

interface PitchProcessingStatus {
  parsed_pitches: number;
  pending_pitches: number;
  total_pitches: number;
}

interface UsePitchProcessingStatusReturn {
  status: PitchProcessingStatus | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  isAllProcessed: boolean;
  processingProgress: number;
  refreshStatus: () => Promise<void>;
  clearError: () => void;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
}

/**
 * Pitch Processing Status API Hook
 *
 * Handles fetching pitch processing status from the API including:
 * - Fetching current processing status
 * - Auto-refresh every 10 seconds
 * - Manual refresh capability
 * - Error handling and loading states
 * - Cleanup on unmount
 *
 * API Endpoint:
 * - GET /api3/pitch-processing - Get current processing status
 */
export const usePitchProcessingStatus = (): UsePitchProcessingStatusReturn => {
  const [status, setStatus] = useState<PitchProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup and preventing memory leaks
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  /**
   * Fetch pitch processing status from API
   * GET /api3/pitch-processing
   */
  const fetchStatus = useCallback(async (): Promise<void> => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log(
        `📊 Pitch Processing Status API: Fetching status from /pitch-processing`
      );

      const response = await pitchApi.get<PitchProcessingStatus>(
        "/pitch-processing"
      );
      const processingStatus = response.data;

      console.log(`📡 Pitch Processing Status API Response:`, processingStatus);

      if (!mountedRef.current) return;

      // Validate required fields
      if (
        typeof processingStatus.total_pitches !== "number" ||
        typeof processingStatus.parsed_pitches !== "number" ||
        typeof processingStatus.pending_pitches !== "number"
      ) {
        throw new Error("Invalid status data: missing required numeric fields");
      }

      setStatus(processingStatus);
      setLastUpdated(new Date());
      console.log(
        `✅ Successfully fetched pitch processing status:`,
        processingStatus
      );

      // If no pending pitches, clear the interval
      if (processingStatus.pending_pitches === 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("⏹️ Auto-refresh stopped - no pending pitches");
      }
    } catch (err) {
      console.error("❌ Error fetching pitch processing status:", err);
      if (!mountedRef.current) return;

      // Show user-friendly error messages
      let userFriendlyMessage = "Failed to fetch processing status";

      if (err instanceof Error) {
        if (err.message.includes("404")) {
          userFriendlyMessage = "Processing service not found";
        } else if (err.message.includes("500")) {
          userFriendlyMessage = "Processing service temporarily unavailable";
        } else if (
          err.message.includes("network") ||
          err.message.includes("fetch")
        ) {
          userFriendlyMessage = "Unable to connect to processing service";
        } else if (err.message.includes("timeout")) {
          userFriendlyMessage = "Request timed out";
        }
      }

      setError(userFriendlyMessage);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /**
   * Manual refresh function
   */
  const refreshStatus = useCallback(async (): Promise<void> => {
    await fetchStatus();
  }, [fetchStatus]);

  /**
   * Start auto-refresh interval
   */
  const startAutoRefresh = useCallback(() => {
    // Clear existing interval if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up new interval for 60 seconds
    intervalRef.current = setInterval(() => {
      if (mountedRef.current) {
        fetchStatus();
      }
    }, 60000); // 60 seconds

    console.log(
      "🔄 Auto-refresh started for pitch processing status (60s interval)"
    );
  }, [fetchStatus]);

  /**
   * Stop auto-refresh interval
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("⏹️ Auto-refresh stopped for pitch processing status");
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Initialize and cleanup
   */
  useEffect(() => {
    mountedRef.current = true;

    // Initial fetch
    fetchStatus();

    // Start auto-refresh
    startAutoRefresh();

    // Cleanup function
    return () => {
      mountedRef.current = false;
      stopAutoRefresh();
    };
  }, [fetchStatus, startAutoRefresh, stopAutoRefresh]);

  /**
   * Computed values for convenience
   */
  const isAllProcessed = status ? status.pending_pitches === 0 : false;
  const processingProgress =
    status && status.total_pitches > 0
      ? (status.parsed_pitches / status.total_pitches) * 100
      : 0;

  return {
    // State
    status,
    isLoading,
    error,
    lastUpdated,

    // Computed values
    isAllProcessed,
    processingProgress,

    // Actions
    refreshStatus,
    clearError,
    startAutoRefresh,
    stopAutoRefresh,
  };
};
