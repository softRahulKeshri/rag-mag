import { useState, useCallback, useEffect, useRef } from "react";
import { useApiService } from "./useApiService";
import type { ResumeProcessingStatus } from "../types/api";

/**
 * Resume Processing Status API Hook
 *
 * Handles fetching resume processing status from the API including:
 * - Fetching current processing status
 * - Auto-refresh every 30 seconds
 * - Manual refresh capability
 * - Error handling and loading states
 * - Cleanup on unmount
 *
 * API Endpoint:
 * - GET /resume-processing - Get current processing status
 */
export const useResumeProcessingStatus = () => {
  const { fetchWithRetry, handleApiError, buildUrl } = useApiService();
  const [status, setStatus] = useState<ResumeProcessingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Refs for cleanup and preventing memory leaks
  const intervalRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  /**
   * Fetch resume processing status from API
   * GET /resume-processing
   */
  const fetchStatus = useCallback(async (): Promise<void> => {
    if (!mountedRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = buildUrl("/resume-processing");
      console.log(`📊 Processing Status API: Fetching status from: ${url}`);

      const response = await fetchWithRetry<ResumeProcessingStatus>(url, {
        method: "GET",
      });

      console.log(`📡 Processing Status API Response:`, response);

      if (!mountedRef.current) return;

      // Handle different response formats
      let statusData: ResumeProcessingStatus;

      // Check if response has a data wrapper
      if (response && typeof response === "object" && "data" in response) {
        statusData = response.data as ResumeProcessingStatus;
      } else if (response && typeof response === "object") {
        statusData = response as ResumeProcessingStatus;
      } else {
        throw new Error("Invalid response format");
      }

      // Validate required fields
      if (
        typeof statusData.total_cvs !== "number" ||
        typeof statusData.parsed_cvs !== "number" ||
        typeof statusData.pending_cvs !== "number"
      ) {
        throw new Error("Invalid status data: missing required numeric fields");
      }

      setStatus(statusData);
      setLastUpdated(new Date());
      console.log(`✅ Successfully fetched processing status:`, statusData);
    } catch (error) {
      console.error("❌ Error fetching processing status:", error);
      if (!mountedRef.current) return;

      const apiError = handleApiError(error);
      setError(apiError.message);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fetchWithRetry, buildUrl, handleApiError]);

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

    console.log("🔄 Auto-refresh started for processing status (60s interval)");
  }, [fetchStatus]);

  /**
   * Stop auto-refresh interval
   */
  const stopAutoRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("⏹️ Auto-refresh stopped for processing status");
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
  const isAllProcessed = status ? status.pending_cvs === 0 : false;
  const processingProgress =
    status && status.total_cvs > 0
      ? (status.parsed_cvs / status.total_cvs) * 100
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
