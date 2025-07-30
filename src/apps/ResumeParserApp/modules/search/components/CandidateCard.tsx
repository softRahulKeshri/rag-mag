import React, { useCallback } from "react";
import type { CandidateCardProps } from "../types";
import { buildResumeApiUrl } from "../../store/components/ResumeCollection/utils";

/**
 * CandidateCard Component
 *
 * Displays individual candidate information in a modern card layout.
 *
 * Features:
 * - Score visualizations with color coding
 * - Candidate highlights and details
 * - Interactive hover effects
 * - Responsive design
 * - Action buttons for viewing details
 * - Professional score breakdown
 */
const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onViewDetails,
}) => {
  // Get score color based on value
  const getScoreColor = useCallback((score: number): string => {
    if (score >= 8) return "text-green-600 bg-green-50";
    if (score >= 6) return "text-yellow-600 bg-yellow-50";
    if (score >= 4) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  }, []);

  // Get score label
  const getScoreLabel = useCallback((score: number): string => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    if (score >= 4) return "Fair";
    return "Poor";
  }, []);

  // Format score for display
  const formatScore = useCallback(
    (score: number): string => score.toFixed(1),
    []
  );

  // Get initials for avatar
  const getInitials = useCallback((name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {getInitials(candidate.name)}
          </div>

          {/* Name and File */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {candidate.name}
            </h3>
            <p className="text-sm text-gray-500 truncate">
              {candidate.filename}
            </p>
          </div>
        </div>

        {/* Overall Score */}
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${getScoreColor(
            candidate.averageScore || 0
          )}`}
        >
          {formatScore(candidate.averageScore || 0)}/10
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Clarity</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatScore(candidate.clarityScore || 0)}
            </span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (candidate.clarityScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Experience</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatScore(candidate.experienceScore || 0)}
            </span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (candidate.experienceScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Loyalty</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatScore(candidate.loyaltyScore || 0)}
            </span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (candidate.loyaltyScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-2">
          <div className="text-xs text-gray-600 mb-1">Reputation</div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">
              {formatScore(candidate.reputationScore || 0)}
            </span>
            <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
              <div
                className="h-full bg-orange-500 transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (candidate.reputationScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights */}
      {candidate.highlights && candidate.highlights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Key Highlights
          </h4>
          <div className="space-y-1">
            {candidate.highlights.slice(0, 3).map((highlight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {highlight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Group Badge */}
      {candidate.group && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <svg
              className="w-3 h-3 mr-1 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-1c0-1.1.9-2 2-2h2l.72-3.28a2 2 0 011.96-1.72c.34 0 .68.09.96.26L14 12.5v3l-2.5-1.5c-.28-.17-.62-.26-.96-.26a2 2 0 00-1.96 1.72L8 18H4z" />
            </svg>
            {candidate.group}
          </span>
        </div>
      )}

      {/* Comment Indicator */}
      {candidate.comment && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-blue-800 font-medium mb-1">
                HR Comment
              </p>
              <p className="text-sm text-blue-700">{candidate.comment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails?.(candidate)}
          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          View Details
        </button>

        <button
          onClick={() => {
            const viewUrl = buildResumeApiUrl(candidate.id);

            const viewFile = async () => {
              try {
                console.log(
                  `🔄 Loading resume for viewing: "${candidate.name}" from URL: ${viewUrl}`
                );

                // Fetch the file
                const response = await fetch(viewUrl);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get the file as a blob
                const blob = await response.blob();

                // Create a blob URL for viewing
                const blobUrl = window.URL.createObjectURL(blob);

                // Open in new tab for viewing
                window.open(blobUrl, "_blank");

                // Clean up the blob URL after a delay to allow the tab to open
                setTimeout(() => {
                  window.URL.revokeObjectURL(blobUrl);
                }, 1000);

                console.log(
                  `✅ Opened resume "${candidate.name}" for viewing in new tab`
                );
              } catch (error) {
                console.error(
                  `❌ Failed to load resume for viewing "${candidate.name}":`,
                  error
                );

                // Fallback: try to open the URL directly
                try {
                  window.open(viewUrl, "_blank");
                  console.log(
                    `✅ Fallback: Opened resume "${candidate.name}" directly in new tab`
                  );
                } catch (fallbackError) {
                  console.error("❌ Fallback also failed:", fallbackError);
                  alert(
                    `Unable to view resume "${candidate.name}" - please try again`
                  );
                }
              }
            };

            viewFile();
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center flex-shrink-0"
          title="View Resume"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </button>

        <button
          onClick={() => {
            const downloadUrl = buildResumeApiUrl(candidate.id);

            const downloadFile = async () => {
              try {
                console.log(
                  `🔄 Starting download for "${candidate.name}" from URL: ${downloadUrl}`
                );

                // Fetch the file from the download endpoint
                const response = await fetch(downloadUrl);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get the file as a blob
                const blob = await response.blob();

                // Create a blob URL
                const blobUrl = window.URL.createObjectURL(blob);

                // Create download link
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download =
                  candidate.filename || `${candidate.name}_resume.pdf`;
                link.style.display = "none";

                // Append to body, click, and cleanup
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up the blob URL
                window.URL.revokeObjectURL(blobUrl);

                console.log(`✅ Successfully downloaded "${candidate.name}"`);
              } catch (error) {
                console.error(
                  `❌ Failed to download resume "${candidate.name}":`,
                  error
                );

                // Try direct download as fallback
                try {
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download =
                    candidate.filename || `${candidate.name}_resume.pdf`;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  console.log(
                    `✅ Fallback download initiated for "${candidate.name}"`
                  );
                } catch (fallbackError) {
                  console.error(
                    "❌ Fallback download also failed:",
                    fallbackError
                  );
                  alert(
                    `Unable to download resume "${candidate.name}" - please try again or contact support`
                  );
                }
              }
            };

            downloadFile();
          }}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center flex-shrink-0"
          title="Download Resume"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </button>
      </div>

      {/* Match Score Indicator */}
      {candidate.matchScore && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Match Score</span>
            <span className="font-medium">
              {getScoreLabel(candidate.averageScore || 0)} •{" "}
              {formatScore(candidate.matchScore * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateCard;
