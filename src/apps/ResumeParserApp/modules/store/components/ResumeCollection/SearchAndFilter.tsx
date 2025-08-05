import React from "react";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";
import type { GroupStat } from "../../types";

interface SearchAndFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  groupStats: GroupStat[];
  groupsLoading: boolean;
  groupsError: string | null;
  clearGroupsError: () => void;
  refreshGroups: () => void;
  isLoading: boolean;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  groupStats,
  groupsLoading,
  groupsError,
  clearGroupsError,
  refreshGroups,
  isLoading,
}) => {
  return (
    <div className="mb-6 space-y-4">
      {/* Compact Search and Filter Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 p-4">
        <div className="flex items-start space-x-3 mb-4">
          <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MagnifyingGlassIcon className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Search & Filter
            </h2>
            <p className="text-sm text-gray-600">
              Find and filter resumes in your collection
            </p>
          </div>
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Compact Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Resumes
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, skills, experience..."
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white/90 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Compact Group Filter */}
          <div className="lg:w-72">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Group
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={selectedGroup || ""}
                onChange={(e) => setSelectedGroup(e.target.value || null)}
                className="block w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none transition-all duration-200 hover:bg-white"
                disabled={isLoading || groupsLoading}
              >
                <option value="">All Groups ({groupStats.length})</option>
                {groupStats.map((stat) => (
                  <option key={stat.groupId} value={stat.group}>
                    {stat.group} ({stat.count})
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(searchQuery || selectedGroup) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                <FunnelIcon className="w-3 h-3 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-blue-800">
                Active filters:
              </span>
            </div>

            {searchQuery && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                Search: "{searchQuery}"
                <button
                  onClick={() => setSearchQuery("")}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none focus:bg-blue-200 transition-colors duration-150"
                >
                  <svg
                    className="w-3 h-3"
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
              </span>
            )}

            {selectedGroup && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                Group: {selectedGroup}
                <button
                  onClick={() => setSelectedGroup(null)}
                  className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600 focus:outline-none focus:bg-green-200 transition-colors duration-150"
                >
                  <svg
                    className="w-3 h-3"
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
              </span>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Error Display */}
      {groupsError && (
        <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-4 w-4 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Error loading groups
              </h3>
              <div className="text-sm text-red-700 mb-3">
                <p>{groupsError}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={refreshGroups}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Retry
                </button>
                <button
                  onClick={clearGroupsError}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
