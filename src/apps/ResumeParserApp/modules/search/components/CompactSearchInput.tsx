import React, { useRef, useEffect } from "react";
import type { SearchInputProps } from "../types";

/**
 * CompactSearchInput Component
 *
 * Elegant text-based search interface with sophisticated design and brand colors.
 * Features modern glassmorphism effects, smooth animations, and premium feel.
 *
 * Features:
 * - Sophisticated glassmorphism design
 * - Brand gradient colors and animations
 * - Group selection with elegant styling
 * - Real-time validation with visual feedback
 * - Keyboard shortcuts (Enter to search)
 * - Loading states with brand colors
 * - Modern, premium design
 */
const CompactSearchInput: React.FC<SearchInputProps> = ({
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
    <div className="space-y-6">
      {/* Group Selection with Elegant Design */}
      <div className="relative">
        <label className="block text-sm font-semibold text-neutral-n800 mb-3">
          <span className="bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple bg-clip-text text-transparent">
            Filter by Group
          </span>
        </label>
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={isSearching}
            className="w-full bg-white/70 backdrop-blur-sm border-2 border-neutral-n200 rounded-2xl px-4 py-3.5 text-neutral-n800 font-medium focus:outline-none focus:border-brand-gradient-blue focus:ring-4 focus:ring-brand-gradient-blue/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:border-neutral-n300 shadow-lg appearance-none"
          >
            <option value="" className="text-neutral-n600">
              All Groups
            </option>
            {groups.map((group) => (
              <option
                key={group.id}
                value={group.name}
                className="text-neutral-n800"
              >
                {group.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-neutral-n500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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

      {/* Search Input and Button with Sophisticated Design */}
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-semibold text-neutral-n800 mb-3">
            <span className="bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent">
              Describe Your Ideal Candidate
            </span>
          </label>

          <div className="relative group">
            {/* Input Field */}
            <input
              ref={searchInputRef}
              type="text"
              placeholder="e.g., Senior React developer with 5+ years experience in fintech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSearching}
              className="w-full px-5 py-4 text-neutral-n800 placeholder-neutral-n500 bg-white/70 backdrop-blur-sm border-2 border-neutral-n200 rounded-2xl outline-none disabled:cursor-not-allowed focus:border-brand-gradient-blue focus:ring-4 focus:ring-brand-gradient-blue/20 transition-all duration-300 hover:border-neutral-n300 shadow-lg font-medium text-base"
            />

            {/* Character Count Indicator */}
            {searchQuery.trim().length > 0 && searchQuery.trim().length < 5 && (
              <div className="absolute -bottom-8 left-0 text-xs font-medium text-neutral-n600">
                <span className="bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple bg-clip-text text-transparent">
                  {5 - searchQuery.trim().length} more characters needed
                </span>
              </div>
            )}

            {/* Search Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <div className="w-8 h-8 bg-gradient-to-r from-brand-gradient-cyan to-brand-gradient-blue rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button with Gradient */}
        <button
          onClick={onSearch}
          disabled={isSearchDisabled}
          className={`w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${
            isSearchDisabled
              ? "bg-neutral-n200 text-neutral-n500 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-brand-gradient-orange via-brand-gradient-purple to-brand-gradient-blue text-white hover:shadow-2xl hover:shadow-brand-gradient-purple/25 active:scale-95 transform"
          }`}
        >
          {isSearching ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analyzing Resumes...</span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span>Find Perfect Candidates</span>
            </>
          )}
        </button>
      </div>

      {/* Search Tips with Elegant Design */}
      <div className="bg-gradient-to-r from-neutral-n100 to-neutral-n150 rounded-2xl p-4 border border-neutral-n200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-n800 mb-1">
              Pro Tips for Better Results
            </p>
            <p className="text-sm text-neutral-n600 leading-relaxed">
              Try:{" "}
              <span className="font-medium text-neutral-n800">
                "Senior React developer with 5+ years"
              </span>{" "}
              or{" "}
              <span className="font-medium text-neutral-n800">
                "Marketing manager with digital strategy expertise"
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactSearchInput;
