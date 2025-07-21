import React, { useState, useEffect } from "react";
import { useResumeStore } from "../store/resumeStore";
import type { IResume } from "../types";

const ResumeSearch: React.FC = () => {
  const {
    resumes,
    searchQuery,
    setSearchQuery,
    filters,
    setStatusFilter,
    clearFilters,
  } = useResumeStore();
  const [searchResults, setSearchResults] = useState<IResume[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Filter options
  const statusOptions = [
    {
      value: "completed",
      label: "Completed",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "uploading",
      label: "Uploading",
      color: "bg-blue-100 text-blue-800",
    },
    { value: "error", label: "Error", color: "bg-red-100 text-red-800" },
  ];

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults(resumes);
        return;
      }

      setIsSearching(true);

      // Simulate search delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      const filtered = resumes.filter((resume: IResume) => {
        const matchesQuery =
          resume.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (resume.parsedData?.personalInfo.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (resume.parsedData?.personalInfo.email || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        const matchesStatus =
          filters.status.length === 0 || filters.status.includes(resume.status);

        return matchesQuery && matchesStatus;
      });

      setSearchResults(filtered);
      setIsSearching(false);
    };

    performSearch();
  }, [searchQuery, resumes, filters.status]);

  const handleStatusFilterChange = (status: string) => {
    const currentFilters = filters.status;
    const newFilters = currentFilters.includes(status)
              ? currentFilters.filter((s: string) => s !== status)
      : [...currentFilters, status];

    setStatusFilter(newFilters);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusBadge = (status: IResume["status"]) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          option?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {option?.label || status}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Resumes
          </h1>
          <p className="text-lg text-gray-600">
            Find perfect candidates with AI-powered search
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Resumes
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, email, or filename..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {isSearching && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusFilterChange(option.value)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.status.includes(option.value)
                        ? option.color
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                {filters.status.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Search Results ({searchResults.length})
            </h2>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No resumes found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "Try adjusting your search terms or filters."
                  : "Upload some resumes to get started."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {searchResults.map((resume) => (
                <div
                  key={resume.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-10 h-10 text-gray-400">
                        <svg fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {resume.fileName}
                        </h3>
                        {resume.parsedData?.personalInfo.name && (
                          <p className="text-sm text-gray-600">
                            {resume.parsedData.personalInfo.name}
                            {resume.parsedData.personalInfo.email && (
                              <span className="text-gray-400">
                                {" "}
                                • {resume.parsedData.personalInfo.email}
                              </span>
                            )}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatFileSize(resume.fileSize)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(resume.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(resume.status)}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeSearch;
