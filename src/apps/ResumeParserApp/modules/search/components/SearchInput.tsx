import React, { useRef, useEffect } from "react";
import type { SearchInputProps } from "../types";

/**
 * SearchInput Component
 *
 * Text-based search interface with group filtering and modern design.
 *
 * Features:
 * - Auto-focus on mount for better UX
 * - Group selection dropdown
 * - Real-time validation
 * - Keyboard shortcuts (Enter to search)
 * - Loading states and disabled states
 * - Modern glassmorphism design
 */
const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  setSearchQuery,
  selectedGroup,
  setSelectedGroup,
  onSearch,
  isSearching,
  groups,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search input when component mounts
  useEffect(() => {
    setTimeout(() => searchInputRef.current?.focus(), 100);
  }, []);

  // Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSearching) {
      onSearch();
    }
  };

  const isSearchDisabled =
    isSearching || !searchQuery.trim() || searchQuery.trim().length < 5;

  return (
    <div className="w-full opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
      <div className="flex items-center gap-3 bg-white rounded-xl p-2 shadow-lg max-w-4xl mx-auto">
        {/* Group Selection */}
        <div className="flex-shrink-0">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={isSearching}
            className="bg-transparent border-none outline-none px-3 py-2 text-gray-700 font-medium min-w-[140px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">All Groups</option>
            {groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* Search Input */}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Describe your ideal candidate or paste job requirements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
          className="flex-1 px-4 py-3 text-gray-900 placeholder-gray-500 bg-transparent border-none outline-none text-base disabled:cursor-not-allowed"
        />

        {/* Character Count Indicator */}
        {searchQuery.trim().length > 0 && searchQuery.trim().length < 5 && (
          <div className="flex-shrink-0 text-xs text-gray-400 px-2">
            {5 - searchQuery.trim().length} more chars
          </div>
        )}

        {/* Search Button */}
        <button
          onClick={onSearch}
          disabled={isSearchDisabled}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            isSearchDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/25"
          }`}
        >
          {isSearching ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Searching...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              Search
            </>
          )}
        </button>
      </div>

      {/* Search Tips */}
      <div className="mt-4 text-center">
        <p className="text-purple-100 text-sm">
          💡 Try: "Senior React developer with 5+ years experience in fintech"
          or "Marketing manager with digital strategy expertise"
        </p>
      </div>
    </div>
  );
};

export default SearchInput;
