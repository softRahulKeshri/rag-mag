import React, { useState } from "react";
import { useResumeSearch } from "../hooks/useResumeSearch";
import type { SearchResult } from "../types";
import { BrandColors, TailwindColorClasses } from "../../../theme/colors";

// Icons for the action buttons - Document/Text icon (improved)
const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const FolderIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "w-5 h-5"}
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className || "w-4 h-4"}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const ResumeSearch: React.FC = () => {
  const {
    searchResults,
    isLoading,
    error,
    filters,
    setQuery,
    setStatusFilter,
    setDateRange,
    clearFilters,
    performSearch,
  } = useResumeSearch();

  const [searchInput, setSearchInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");

  const handleSearch = () => {
    setQuery(searchInput);
    performSearch();
  };

  const handleStatusFilterChange = (status: string) => {
    const currentStatuses = filters.status;
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status];
    setStatusFilter(newStatuses);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (status: SearchResult["status"]) => {
    const statusConfig = {
      uploading: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        text: "Uploading",
      },
      processing: {
        color: `${TailwindColorClasses.bg.uiBlue100} ${TailwindColorClasses.text.uiBlue600} ${TailwindColorClasses.border.uiBlue200}`,
        text: "Processing",
      },
      completed: {
        color: "bg-green-100 text-green-800 border-green-200",
        text: "Completed",
      },
      error: {
        color: "bg-red-100 text-red-800 border-red-200",
        text: "Error",
      },
      uploaded: {
        color: `${TailwindColorClasses.bg.neutral200} ${TailwindColorClasses.text.neutral700} ${TailwindColorClasses.border.neutral300}`,
        text: "Uploaded",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Purple Section - AI-Powered Resume Matching */}
      <div
        className="relative px-6 py-12 rounded-b-3xl"
        style={{ backgroundColor: "rgb(139, 92, 246)" }}
      >
        {/* Star Icon */}
        <div className="absolute top-8 right-8 text-white opacity-80">
          <StarIcon />
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI-Powered Resume Matching
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-white opacity-90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Let our advanced AI find your perfect candidates. We analyze skills,
            experience, and potential matches using state-of-the-art language
            models to deliver precise results.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {/* Search by Text Button */}
            <button
              className="flex flex-col items-center justify-center px-8 py-6 rounded-xl transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: BrandColors.gradient.orange }}
            >
              <DocumentIcon />
              <span className="mt-2 font-semibold text-white">
                Search by Text
              </span>
            </button>

            {/* Upload JD Button */}
            <button className="flex flex-col items-center justify-center px-8 py-6 rounded-xl border-2 border-white bg-white bg-opacity-10 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-opacity-20">
              <DocumentIcon />
            </button>
          </div>

          {/* Search Bar Component */}
          <div className="bg-white rounded-2xl p-2 shadow-xl max-w-4xl mx-auto">
            <div className="flex items-center space-x-3">
              {/* Group Dropdown */}
              <div className="relative">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="appearance-none bg-transparent pl-10 pr-8 py-3 text-gray-700 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="All Groups">All Groups</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
                <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-300"></div>

              {/* Search Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Describe your ideal candidate or paste job requirements..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full px-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
                style={{ backgroundColor: BrandColors.gradient.orange }}
              >
                <SearchIcon />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom White Section - Ready to Find Your Perfect Match */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Start by entering your desired{" "}
            <span className="text-blue-600 font-semibold">skills</span>,{" "}
            <span className="text-blue-600 font-semibold">experience</span>, or{" "}
            <span className="text-blue-600 font-semibold">
              job requirements
            </span>{" "}
            above to discover candidates that perfectly align with your needs.
          </p>
        </div>
      </div>

      {/* Search Results Section - Only show when there are results or filters applied */}
      {(searchResults.length > 0 ||
        filters.query ||
        filters.status.length > 0 ||
        filters.dateRange.start ||
        filters.dateRange.end) && (
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Filters
              </h3>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Status
                </label>
                <div className="flex flex-wrap gap-4">
                  {["uploaded", "processing", "completed", "error"].map(
                    (status) => (
                      <label
                        key={status}
                        className="flex items-center cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => handleStatusFilterChange(status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Date Range
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="date"
                    value={
                      filters.dateRange.start?.toISOString().split("T")[0] || ""
                    }
                    onChange={(e) =>
                      setDateRange(
                        e.target.value ? new Date(e.target.value) : null,
                        filters.dateRange.end
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={
                      filters.dateRange.end?.toISOString().split("T")[0] || ""
                    }
                    onChange={(e) =>
                      setDateRange(
                        filters.dateRange.start,
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
              >
                Clear all filters
              </button>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Search Results ({searchResults.length})
                </h3>
              </div>

              {isLoading && (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600 text-lg">Searching...</p>
                </div>
              )}

              {error && (
                <div className="p-12 text-center">
                  <p className="text-red-600 text-lg">Error: {error}</p>
                </div>
              )}

              {!isLoading && !error && searchResults.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-600 text-lg">No results found</p>
                </div>
              )}

              {!isLoading && !error && searchResults.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-6 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">
                            {result.original_filename || result.fileName}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <span>{formatFileSize(result.fileSize)}</span>
                            <span>•</span>
                            <span>
                              Uploaded: {result.uploadDate.toLocaleDateString()}
                            </span>
                            {result.group && (
                              <>
                                <span>•</span>
                                <span>Group: {result.group}</span>
                              </>
                            )}
                          </div>
                          {result.parsedData && (
                            <div className="space-y-1">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Name:</span>{" "}
                                {result.parsedData.personalInfo.name}
                              </p>
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Email:</span>{" "}
                                {result.parsedData.personalInfo.email}
                              </p>
                              {result.parsedData.skills.length > 0 && (
                                <p className="text-sm text-gray-700">
                                  <span className="font-medium">Skills:</span>{" "}
                                  {result.parsedData.skills
                                    .slice(0, 5)
                                    .join(", ")}
                                  {result.parsedData.skills.length > 5 && "..."}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ml-6">
                          {getStatusBadge(result.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSearch;
