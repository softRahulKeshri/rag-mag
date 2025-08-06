import React, { useCallback } from "react";
import type { CandidateCardProps } from "../types";
import { resumeApi } from "../../../../../lib/axios";
import { buildResumeApiUrl } from "../../store/components/ResumeCollection/utils";

/**
 * Candidate Card Component
 *
 * Displays individual candidate information in a card format with:
 * - Personal information (name, email, phone, location)
 * - Professional details (current role, experience, education)
 * - Skills and match score
 * - Action buttons for viewing details, viewing resume, and downloading resume
 * - Responsive design with hover effects
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
    <div className="bg-white rounded-2xl border border-neutral-n200 p-6 hover:border-brand-gradient-blue/30 hover:shadow-xl hover:shadow-brand-gradient-blue/10 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Enhanced Avatar */}
          <div className="w-14 h-14 bg-gradient-to-br from-brand-gradient-purple to-brand-gradient-blue rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
            {getInitials(candidate.name)}
          </div>

          {/* Enhanced Name and Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-neutral-n900 truncate mb-1 group-hover:text-primary-ui-blue-p600 transition-colors duration-200">
              {candidate.name}
            </h3>

            {/* Job Profile */}
            {candidate.jobProfile && (
              <p className="text-sm font-medium text-purple-600 mb-1 truncate">
                {candidate.jobProfile}
              </p>
            )}

            {/* Total Experience */}
            {candidate.totalExperience && (
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-4 h-4 text-orange-600 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="text-sm font-medium text-neutral-n700">
                  {candidate.totalExperience}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Overall Score */}
        <div className="flex flex-col items-end gap-2">
          <div
            className={`px-4 py-2 rounded-xl text-lg font-bold flex-shrink-0 shadow-sm ${getScoreColor(
              candidate.averageScore || 0
            )}`}
          >
            {formatScore(candidate.averageScore || 0)}/10
          </div>
          <span className="text-xs font-medium text-neutral-n600">
            {getScoreLabel(candidate.averageScore || 0)}
          </span>
        </div>
      </div>

      {/* Contact Information */}
      {candidate.email && candidate.email.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary-ui-blue-p100 to-primary-ui-blue-p50 rounded-xl border border-primary-ui-blue-p200">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-primary-ui-blue-p600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span className="text-sm font-medium text-primary-ui-blue-p700 truncate">
              {candidate.email[0]}
            </span>
          </div>
        </div>
      )}

      {/* Education Information */}
      {candidate.college && candidate.college.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-4 h-4 text-purple-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
            </svg>
            <h4 className="text-sm font-semibold text-neutral-n800">
              Education
            </h4>
          </div>
          <div className="space-y-1">
            {candidate.college.slice(0, 2).map((college, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-n600 leading-relaxed">
                  {college}
                </p>
              </div>
            ))}
            {candidate.college.length > 2 && (
              <p className="text-xs text-neutral-n500 ml-3">
                +{candidate.college.length - 2} more
              </p>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Score Breakdown */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          <h4 className="text-sm font-semibold text-neutral-n800">
            Performance Metrics
          </h4>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-primary-ui-blue-p100 to-primary-ui-blue-p50 rounded-xl p-3 border border-primary-ui-blue-p200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-primary-ui-blue-p700">
                Clarity
              </span>
              <span className="text-sm font-bold text-primary-ui-blue-p600">
                {formatScore(candidate.clarityScore || 0)}
              </span>
            </div>
            <div className="w-full h-2 bg-primary-ui-blue-p200 rounded-full overflow-hidden progress-bar">
              <div
                className="h-full bg-gradient-to-r from-brand-gradient-blue to-brand-gradient-cyan transition-all duration-500 ease-out animate-progress-fill"
                style={{
                  width: `${Math.min(
                    (candidate.clarityScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-3 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-green-700">
                Experience
              </span>
              <span className="text-sm font-bold text-green-600">
                {formatScore(candidate.experienceScore || 0)}
              </span>
            </div>
            <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden progress-bar">
              <div
                className="h-full bg-gradient-to-r from-brand-gradient-cyan to-green-500 transition-all duration-500 ease-out animate-progress-fill"
                style={{
                  width: `${Math.min(
                    (candidate.experienceScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-purple-700">
                Loyalty
              </span>
              <span className="text-sm font-bold text-purple-600">
                {formatScore(candidate.loyaltyScore || 0)}
              </span>
            </div>
            <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden progress-bar">
              <div
                className="h-full bg-gradient-to-r from-brand-gradient-purple to-purple-500 transition-all duration-500 ease-out animate-progress-fill"
                style={{
                  width: `${Math.min(
                    (candidate.loyaltyScore || 0) * 10,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-3 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-orange-700">
                Reputation
              </span>
              <span className="text-sm font-bold text-orange-600">
                {formatScore(candidate.reputationScore || 0)}
              </span>
            </div>
            <div className="w-full h-2 bg-orange-200 rounded-full overflow-hidden progress-bar">
              <div
                className="h-full bg-gradient-to-r from-brand-gradient-orange to-orange-500 transition-all duration-500 ease-out animate-progress-fill"
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
          <h4 className="text-sm font-medium text-neutral-n900 mb-2">
            Key Highlights
          </h4>
          <div className="space-y-1">
            {candidate.highlights.slice(0, 3).map((highlight, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm text-neutral-n600 leading-relaxed">
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
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-n100 text-neutral-n800">
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
        <div className="mb-4 p-3 bg-primary-ui-blue-p100 rounded-lg border border-primary-ui-blue-p200">
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-primary-ui-blue-p600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.6 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-primary-ui-blue-p700 font-medium mb-1">
                HR Comment
              </p>
              <p className="text-sm text-primary-ui-blue-p600">
                {candidate.comment}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onViewDetails?.(candidate)}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 btn-enhanced group"
        >
          <svg
            className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          View Details
        </button>

        <button
          onClick={() => {
            const viewFile = async () => {
              try {
                console.log(
                  `🔄 Loading resume for viewing with JWT authentication`
                );

                // Log the request details
                console.log(
                  `🔐 JWT Token for candidate resume view API call:`,
                  {
                    endpoint: `/resume/${candidate.id}`,
                    method: "GET",
                    candidateId: candidate.id,
                    candidateName: candidate.name,
                    timestamp: new Date().toISOString(),
                  }
                );

                // Use axios with JWT authentication
                const response = await resumeApi.get(
                  `/resume/${candidate.id}`,
                  {
                    responseType: "blob",
                  }
                );

                // Get the file as a blob
                const blob = response.data;

                // Create a blob URL for viewing
                const blobUrl = window.URL.createObjectURL(blob);
                window.open(blobUrl, "_blank");
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
              } catch (error) {
                console.error(`Failed to view resume:`, error);

                // Handle specific error cases
                if (error && typeof error === "object" && "response" in error) {
                  const axiosError = error as { response?: { status: number } };

                  if (axiosError.response?.status === 401) {
                    alert("Authentication failed. Please login again.");
                    return;
                  } else if (axiosError.response?.status === 404) {
                    alert("Resume file not found.");
                    return;
                  } else if (axiosError.response?.status === 403) {
                    alert(
                      "Access denied. You don't have permission to view this file."
                    );
                    return;
                  }
                }

                // Fallback: try to open the URL directly
                try {
                  const viewUrl = buildResumeApiUrl(candidate.id);
                  window.open(viewUrl, "_blank");
                } catch {
                  alert(`Unable to view resume - please try again`);
                }
              }
            };
            viewFile();
          }}
          className="px-4 py-3 border-2 border-blue-500 text-blue-600 rounded-xl font-medium hover:bg-blue-500 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center flex-shrink-0 btn-enhanced group"
          title="View Resume"
        >
          <svg
            className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
        </button>

        <button
          onClick={() => {
            const downloadFile = async () => {
              try {
                console.log(`🔄 Downloading resume with JWT authentication`);

                // Log the request details
                console.log(
                  `🔐 JWT Token for candidate resume download API call:`,
                  {
                    endpoint: `/resume/${candidate.id}`,
                    method: "GET",
                    candidateId: candidate.id,
                    candidateName: candidate.name,
                    filename:
                      candidate.filename || `${candidate.name}_resume.pdf`,
                    timestamp: new Date().toISOString(),
                  }
                );

                // Use axios with JWT authentication
                const response = await resumeApi.get(
                  `/resume/${candidate.id}`,
                  {
                    responseType: "blob",
                  }
                );

                // Get the file as a blob
                const blob = response.data;

                // Create a blob URL for download
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.download =
                  candidate.filename || `${candidate.name}_resume.pdf`;
                link.style.display = "none";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
              } catch (error) {
                console.error(`Failed to download resume:`, error);

                // Handle specific error cases
                if (error && typeof error === "object" && "response" in error) {
                  const axiosError = error as { response?: { status: number } };

                  if (axiosError.response?.status === 401) {
                    alert("Authentication failed. Please login again.");
                    return;
                  } else if (axiosError.response?.status === 404) {
                    alert("Resume file not found.");
                    return;
                  } else if (axiosError.response?.status === 403) {
                    alert(
                      "Access denied. You don't have permission to download this file."
                    );
                    return;
                  }
                }

                // Fallback: try to download the URL directly
                try {
                  const downloadUrl = buildResumeApiUrl(candidate.id);
                  const link = document.createElement("a");
                  link.href = downloadUrl;
                  link.download =
                    candidate.filename || `${candidate.name}_resume.pdf`;
                  link.target = "_blank";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch {
                  alert(`Unable to download resume - please try again`);
                }
              }
            };
            downloadFile();
          }}
          className="px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-xl font-medium hover:bg-orange-500 hover:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center flex-shrink-0 btn-enhanced group"
          title="Download Resume"
        >
          <svg
            className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-200"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </button>
      </div>

      {/* Match Score Indicator */}
      {candidate.matchScore && (
        <div className="mt-3 pt-3 border-t border-neutral-n150">
          <div className="flex items-center justify-between text-xs text-neutral-n500">
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
