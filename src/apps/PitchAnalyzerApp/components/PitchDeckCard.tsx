import { useMemo } from "react";
import {
  DocumentTextIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import type { IPitchDeck } from "../types";

interface IPitchDeckCardProps {
  pitchDeck: IPitchDeck;
  onClick?: () => void;
}


const PitchDeckCard = ({ pitchDeck, onClick }: IPitchDeckCardProps) => {
  // Memoized status styling for performance
  const statusConfig = useMemo(() => {
    const configs = {
      completed: {
        color: "bg-gradient-to-r from-green-500 to-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: <CheckIcon className="w-4 h-4" />,
        label: "Completed",
        progress: 100,
      },
      analyzing: {
        color: "bg-gradient-to-r from-yellow-500 to-orange-500",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: (
          <div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Analyzing"
          />
        ),
        label: "Analyzing",
        progress: 65,
      },
      uploading: {
        color: "bg-gradient-to-r from-blue-500 to-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: <ArrowUpTrayIcon className="w-4 h-4" />,
        label: "Uploading",
        progress: 30,
      },
      error: {
        color: "bg-gradient-to-r from-red-500 to-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: <ExclamationTriangleIcon className="w-4 h-4" />,
        label: "Error",
        progress: 0,
      },
    };
    return configs[pitchDeck.status];
  }, [pitchDeck.status]);

  // Memoized formatted date for performance
  const formattedDate = useMemo(() => {
    return pitchDeck.uploadDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [pitchDeck.uploadDate]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
        onClick
          ? "cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30"
          : ""
      }`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View details for ${pitchDeck.name}` : undefined}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <DocumentTextIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {pitchDeck.name}
            </h3>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>
        <div
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${statusConfig.color}`}
          aria-label={`Status: ${statusConfig.label}`}
        >
          {statusConfig.icon}
          <span className="capitalize">{statusConfig.label}</span>
        </div>
      </div>

      {/* Progress Bar for Processing States */}
      {(pitchDeck.status === "analyzing" ||
        pitchDeck.status === "uploading") && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{statusConfig.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ease-out ${statusConfig.color.replace(
                "bg-gradient-to-r",
                "bg-gradient-to-r"
              )}`}
              style={{ width: `${statusConfig.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {pitchDeck.tags.length > 0 && (
        <div className="mb-4">
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Pitch deck tags"
          >
            {pitchDeck.tags.slice(0, 3).map((tag, index) => (
              <span
                key={`${tag.key}-${index}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200"
                role="listitem"
              >
                <span className="font-semibold text-gray-600">{tag.key}:</span>
                <span className="ml-1">{tag.value}</span>
              </span>
            ))}
            {pitchDeck.tags.length > 3 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                +{pitchDeck.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Analysis Preview */}
      {pitchDeck.analysis && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm">
            Analysis Summary
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {pitchDeck.analysis.industry && (
              <div className="flex items-center space-x-2">
                <TagIcon className="w-3 h-3 text-blue-600" />
                <div>
                  <span className="text-gray-500">Industry:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {pitchDeck.analysis.industry}
                  </span>
                </div>
              </div>
            )}
            {pitchDeck.analysis.stage && (
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="w-3 h-3 text-green-600" />
                <div>
                  <span className="text-gray-500">Stage:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {pitchDeck.analysis.stage}
                  </span>
                </div>
              </div>
            )}
            {pitchDeck.analysis.teamSize && (
              <div className="flex items-center space-x-2">
                <UsersIcon className="w-3 h-3 text-purple-600" />
                <div>
                  <span className="text-gray-500">Team:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {pitchDeck.analysis.teamSize}
                  </span>
                </div>
              </div>
            )}
            {pitchDeck.analysis.fundingAmount && (
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="w-3 h-3 text-orange-600" />
                <div>
                  <span className="text-gray-500">Funding:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {pitchDeck.analysis.fundingAmount}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {pitchDeck.status === "completed" && "Ready for review"}
          {pitchDeck.status === "analyzing" && "AI analysis in progress"}
          {pitchDeck.status === "uploading" && "Uploading file"}
          {pitchDeck.status === "error" && "Analysis failed"}
        </div>
        {onClick && (
          <button
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Details
            <ArrowRightIcon className="w-3 h-3 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PitchDeckCard;
