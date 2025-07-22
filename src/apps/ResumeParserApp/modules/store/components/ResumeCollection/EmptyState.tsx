import React from "react";

interface EmptyStateProps {
  selectedGroup: string | null;
  searchQuery: string;
  clearAllFilters: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  selectedGroup,
  searchQuery,
  clearAllFilters,
}) => {
  const hasFilters = selectedGroup || searchQuery;

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        {/* Icon */}
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
          <svg
            className="h-6 w-6 text-gray-400"
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

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasFilters ? "No resumes found" : "No resumes uploaded yet"}
        </h3>

        {/* Description */}
        <p className="text-gray-500 mb-6">
          {hasFilters ? (
            <>
              No resumes match your current filters.
              {selectedGroup && (
                <span className="block mt-1">
                  Group: <span className="font-medium">{selectedGroup}</span>
                </span>
              )}
              {searchQuery && (
                <span className="block mt-1">
                  Search: <span className="font-medium">"{searchQuery}"</span>
                </span>
              )}
            </>
          ) : (
            "Get started by uploading your first resume to begin tracking and analyzing your collection."
          )}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasFilters ? (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear all filters
            </button>
          ) : (
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Upload Resume
            </button>
          )}
        </div>

        {/* Additional Help Text */}
        {!hasFilters && (
          <p className="mt-4 text-sm text-gray-400">
            Supported formats: PDF, DOC, DOCX (Max 10MB)
          </p>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
