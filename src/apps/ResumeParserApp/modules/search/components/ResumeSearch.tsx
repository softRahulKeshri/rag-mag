import React, { useState, useEffect } from "react";
import { useResumeSearch } from "../hooks/useResumeSearch";
import type { SearchResult } from "../types";

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

  useEffect(() => {
    // Auto-search when filters change
    if (
      filters.query ||
      filters.status.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end
    ) {
      performSearch();
    }
  }, [filters, performSearch]);

  const handleSearch = async () => {
    setQuery(searchInput);
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
      uploading: { color: "bg-yellow-100 text-yellow-800", text: "Uploading" },
      processing: { color: "bg-blue-100 text-blue-800", text: "Processing" },
      completed: { color: "bg-green-100 text-green-800", text: "Completed" },
      error: { color: "bg-red-100 text-red-800", text: "Error" },
      uploaded: { color: "bg-gray-100 text-gray-800", text: "Uploaded" },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search Resumes
        </h1>
        <p className="text-gray-600">
          Find and filter resumes based on various criteria
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search resumes by name, skills, or content..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {["uploaded", "processing", "completed", "error"].map((status) => (
              <label key={status} className="flex items-center">
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
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Date Range
          </label>
          <div className="flex space-x-4">
            <input
              type="date"
              value={filters.dateRange.start?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                setDateRange(
                  e.target.value ? new Date(e.target.value) : null,
                  filters.dateRange.end
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="self-center text-gray-500">to</span>
            <input
              type="date"
              value={filters.dateRange.end?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                setDateRange(
                  filters.dateRange.start,
                  e.target.value ? new Date(e.target.value) : null
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Clear all filters
        </button>
      </div>

      {/* Results */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Search Results ({searchResults.length})
          </h3>
        </div>

        {isLoading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Searching...</p>
          </div>
        )}

        {error && (
          <div className="p-6 text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        )}

        {!isLoading && !error && searchResults.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-600">No results found</p>
          </div>
        )}

        {!isLoading && !error && searchResults.length > 0 && (
          <div className="divide-y divide-gray-200">
            {searchResults.map((result) => (
              <div key={result.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">
                      {result.original_filename || result.fileName}
                    </h4>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
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
                      <div className="mt-3">
                        <p className="text-sm text-gray-700">
                          <strong>Name:</strong>{" "}
                          {result.parsedData.personalInfo.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Email:</strong>{" "}
                          {result.parsedData.personalInfo.email}
                        </p>
                        {result.parsedData.skills.length > 0 && (
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Skills:</strong>{" "}
                            {result.parsedData.skills.slice(0, 5).join(", ")}
                            {result.parsedData.skills.length > 5 && "..."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">{getStatusBadge(result.status)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeSearch;
