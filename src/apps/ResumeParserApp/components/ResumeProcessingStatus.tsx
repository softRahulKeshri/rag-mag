import React from "react";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useResumeProcessingStatus } from "../hooks/useResumeProcessingStatus";

/**
 * ResumeProcessingStatus Component
 *
 * A modern card component that displays the current status of resume processing.
 * Features:
 * - Real-time status updates every 30 seconds
 * - Manual refresh capability
 * - Loading and error states
 * - Responsive design for desktop and mobile
 * - Clean metrics display with icons
 * - Progress indication for pending resumes
 *
 * Displays three key metrics:
 * - Total Resumes Uploaded (total_cvs)
 * - Resumes Parsed (parsed_cvs)
 * - Resumes Still Processing (pending_cvs)
 */
const ResumeProcessingStatus: React.FC = () => {
  const {
    status,
    isLoading,
    error,
    lastUpdated,
    isAllProcessed,
    processingProgress,
    refreshStatus,
    clearError,
  } = useResumeProcessingStatus();

  /**
   * Format the last updated timestamp
   */
  const formatLastUpdated = (date: Date | null): string => {
    if (!date) return "";

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  /**
   * Handle manual refresh
   */
  const handleRefresh = async () => {
    await refreshStatus();
  };

  /**
   * Handle error dismissal
   */
  const handleDismissError = () => {
    clearError();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Status Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Resume Processing Status
                </h2>
                <p className="text-indigo-100 text-sm">
                  Real-time processing overview
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Refresh status"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error State */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">
                      Failed to fetch processing status
                    </h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleDismissError}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !status && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <ArrowPathIcon className="h-6 w-6 text-indigo-500 animate-spin" />
                <span className="text-gray-600 font-medium">
                  Loading processing status...
                </span>
              </div>
            </div>
          )}

          {/* Status Display */}
          {status && (
            <div className="space-y-6">
              {/* Completion Status Banner */}
              {isAllProcessed && status.total_cvs > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    <div>
                      <h3 className="text-sm font-semibold text-green-800">
                        All resumes have been processed!
                      </h3>
                      <p className="text-sm text-green-600 mt-1">
                        {status.total_cvs} resume
                        {status.total_cvs !== 1 ? "s" : ""} successfully parsed
                        and ready for search.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Resumes */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                        Total Resumes
                      </p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">
                        {status.total_cvs.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <DocumentTextIcon className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Parsed Resumes */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 uppercase tracking-wide">
                        Parsed Resumes
                      </p>
                      <p className="text-3xl font-bold text-green-900 mt-2">
                        {status.parsed_cvs.toLocaleString()}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>

                {/* Processing Resumes */}
                <div
                  className={`rounded-lg p-6 border ${
                    status.pending_cvs > 0
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                      : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium uppercase tracking-wide ${
                          status.pending_cvs > 0
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        Still Processing
                      </p>
                      <p
                        className={`text-3xl font-bold mt-2 ${
                          status.pending_cvs > 0
                            ? "text-amber-900"
                            : "text-gray-900"
                        }`}
                      >
                        {status.pending_cvs.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        status.pending_cvs > 0 ? "bg-amber-100" : "bg-gray-100"
                      }`}
                    >
                      {status.pending_cvs > 0 ? (
                        <ClockIcon className="h-6 w-6 text-amber-600 animate-pulse" />
                      ) : (
                        <CheckCircleIcon className="h-6 w-6 text-gray-600" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {status.total_cvs > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Processing Progress
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round(processingProgress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${processingProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {status.parsed_cvs} of {status.total_cvs} resumes processed
                  </p>
                </div>
              )}

              {/* Last Updated */}
              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Auto-refreshing every 60s</span>
                </span>
              </div>
            </div>
          )}

          {/* No Data State */}
          {!status && !isLoading && !error && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No processing data available
              </h3>
              <p className="text-gray-500 mb-4">
                Unable to retrieve resume processing status.
              </p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeProcessingStatus;
