import React, { useEffect, useState } from "react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useResumeProcessingStatus } from "../hooks/useResumeProcessingStatus";

/**
 * FloatingResumeProcessingStatus Component
 *
 * A compact floating status bar that appears at the bottom center of the page
 * only when resumes are still being processed. Automatically hides when
 * processing is complete.
 *
 * Features:
 * - Only shows when pending_cvs > 0
 * - Auto-hides with fade animation when processing completes
 * - Polls API every 10 seconds for updates
 * - Accessible with aria-live for screen readers
 * - Clean, minimal design with brand gradient
 * - Smooth fade-in/fade-out transitions
 * - Click to open detailed modal view
 */
const FloatingResumeProcessingStatus: React.FC = () => {
  const { status, processingProgress, refreshStatus } =
    useResumeProcessingStatus();

  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determine if we should show the floating UI
  const shouldShow = status && status.pending_cvs > 0;

  // Handle visibility transitions
  useEffect(() => {
    if (shouldShow && !isVisible) {
      // Show the floating UI
      setIsVisible(true);
      setIsFadingOut(false);
    } else if (!shouldShow && isVisible) {
      // Start fade out animation
      setIsFadingOut(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
      }, 300); // Match the CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [shouldShow, isVisible]);

  // Auto-refresh every 60 seconds when visible
  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      refreshStatus();
    }, 60000); // 60 seconds

    return () => clearInterval(interval);
  }, [isVisible, refreshStatus]);

  // Handle modal open/close
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        handleCloseModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isModalOpen]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

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

  return (
    <>
      {/* Floating Status Bar */}
      <div
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${
          isFadingOut ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
        aria-live="polite"
        aria-label="Resume processing status"
      >
        {/* Main Floating Card - Clickable */}
        <button
          onClick={handleOpenModal}
          className="bg-white rounded-xl shadow-2xl border border-gray-200/60 backdrop-blur-sm w-[320px] h-20 flex items-center px-4 hover:shadow-3xl hover:scale-105 transition-all duration-200 cursor-pointer"
          aria-label="Click to view detailed processing status"
        >
          {/* Left Section - Icon and Status */}
          <div className="flex items-center space-x-3 flex-1">
            {/* Animated Icon */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <ArrowPathIcon className="h-4 w-4 text-white animate-spin" />
              </div>
              {/* Subtle pulse ring */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg animate-ping opacity-20" />
            </div>

            {/* Status Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Processing resumes...
              </p>
              <p className="text-xs text-gray-500">
                {status?.parsed_cvs} of {status?.total_cvs} completed
              </p>
            </div>
          </div>

          {/* Right Section - Progress */}
          <div className="flex flex-col items-end space-y-1 ml-3">
            {/* Percentage */}
            <span className="text-sm font-bold text-gray-900">
              {Math.round(processingProgress)}%
            </span>

            {/* Progress Bar */}
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
          </div>
        </button>

        {/* Subtle shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl -z-10" />
      </div>

      {/* Detailed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <ArrowPathIcon className="h-5 w-5 text-white" />
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

                {/* Close Button */}
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Completion Status Banner */}
              {status && status.pending_cvs === 0 && status.total_cvs > 0 && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Total Resumes */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                        Total Resumes
                      </p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">
                        {status?.total_cvs.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
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
                        {status?.parsed_cvs.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Processing Resumes */}
                <div
                  className={`rounded-lg p-6 border ${
                    status?.pending_cvs && status.pending_cvs > 0
                      ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                      : "bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium uppercase tracking-wide ${
                          status?.pending_cvs && status.pending_cvs > 0
                            ? "text-amber-600"
                            : "text-gray-600"
                        }`}
                      >
                        Still Processing
                      </p>
                      <p
                        className={`text-3xl font-bold mt-2 ${
                          status?.pending_cvs && status.pending_cvs > 0
                            ? "text-amber-900"
                            : "text-gray-900"
                        }`}
                      >
                        {status?.pending_cvs.toLocaleString() || 0}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        status?.pending_cvs && status.pending_cvs > 0
                          ? "bg-amber-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {status?.pending_cvs && status.pending_cvs > 0 ? (
                        <svg
                          className="h-6 w-6 text-amber-600 animate-pulse"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-6 w-6 text-gray-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {status && status.total_cvs > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
                <span>Last updated: {formatLastUpdated(new Date())}</span>
                <span className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>Auto-refreshing every 60s</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingResumeProcessingStatus;
