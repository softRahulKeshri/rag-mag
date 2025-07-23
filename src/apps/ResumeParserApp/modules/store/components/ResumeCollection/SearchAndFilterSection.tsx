import React from "react";

interface GroupFilter {
  name: string;
  count: number;
  isActive: boolean;
}

interface SearchAndFilterSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGroup: string | null;
  onGroupSelect: (group: string | null) => void;
  groupFilters: GroupFilter[];
  totalResumes: number;
  totalGroups: number;
}

const SearchAndFilterSection: React.FC<SearchAndFilterSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedGroup,
  onGroupSelect,
  groupFilters,
  totalResumes,
  totalGroups,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Section Header */}
      <div className="flex items-center mb-4">
        <svg
          className="w-5 h-5 text-gray-400 mr-2"
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
        <h2 className="text-lg font-semibold text-gray-900">Search & Filter</h2>
      </div>

      {/* Summary Text */}
      <p className="text-sm text-gray-600 mb-4">
        {totalGroups} groups available • {totalResumes} total resumes
      </p>

      {/* Search Bar */}
      <div className="mb-6">
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
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search resumes by filename..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Filter by Group Section */}
      <div>
        <div className="flex items-center mb-3">
          <svg
            className="w-4 h-4 text-gray-400 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Filter by Group
          </span>
        </div>

        {/* Group Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {groupFilters.map((group) => (
            <button
              key={group.name}
              onClick={() =>
                onGroupSelect(selectedGroup === group.name ? null : group.name)
              }
              className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedGroup === group.name
                  ? "bg-blue-100 text-blue-800 border border-blue-200"
                  : group.isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                  : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                />
              </svg>
              {group.name} {group.count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilterSection;
