import React, { useState, useEffect } from "react";
import { useResumeSearch } from "../hooks/useResumeSearch";
import { useGroupApi } from "../../../hooks/useGroupApi";
import type { ScoreCard, CandidateDetail } from "../types";
import type { Group } from "../../../types/api";
import { BrandColors } from "../../../theme/colors";
import {
  DocumentTextIcon,
  PlusIcon,
  FolderIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

// Dummy data for testing the UI
const dummyCandidates: CandidateDetail[] = [
  {
    candidate_name: "John Doe",
    details:
      "Experienced React developer with 5+ years in frontend development. Strong skills in TypeScript, Redux, and modern web technologies. Led development of multiple enterprise applications and has a proven track record of delivering high-quality code.",
    file_name: "john_doe_resume.pdf",
    score_card: {
      clarity_score: 9,
      experience_score: 8,
      loyalty_score: 7,
      reputation_score: 9,
    },
    comment:
      "Excellent technical skills and great cultural fit. Highly recommended for senior positions.",
    commented_at: "2024-01-15T10:30:00Z",
  },
  {
    candidate_name: "Sarah Johnson",
    details:
      "Full-stack developer with expertise in React, Node.js, and cloud technologies. 3+ years of experience building scalable applications. Strong problem-solving skills and excellent communication abilities.",
    file_name: "sarah_johnson_resume.pdf",
    score_card: {
      clarity_score: 7,
      experience_score: 6,
      loyalty_score: 8,
      reputation_score: 7,
    },
    comment: "Good potential, needs some mentoring but shows promise.",
    commented_at: "2024-01-14T14:20:00Z",
  },
  {
    candidate_name: "Michael Chen",
    details:
      "Senior software engineer with 7+ years specializing in React and TypeScript. Expert in performance optimization and architectural design. Has led multiple teams and delivered projects worth millions.",
    file_name: "michael_chen_resume.pdf",
    score_card: {
      clarity_score: 8,
      experience_score: 9,
      loyalty_score: 6,
      reputation_score: 8,
    },
  },
  {
    candidate_name: "Emily Rodriguez",
    details:
      "Frontend developer with 2 years of experience in React and modern JavaScript. Quick learner with strong attention to detail. Passionate about creating user-friendly interfaces and improving user experience.",
    file_name: "emily_rodriguez_resume.pdf",
    score_card: {
      clarity_score: 6,
      experience_score: 5,
      loyalty_score: 9,
      reputation_score: 6,
    },
    comment:
      "Junior developer with great potential. Would be perfect for entry-level positions.",
    commented_at: "2024-01-13T09:15:00Z",
  },
];

const ResumeSearch: React.FC = () => {
  const {
    searchResults,
    isLoading,
    error,
    filters,
    summary,
    setQuery,
    setGroupFilter,
    performSearch,
  } = useResumeSearch();

  const { getGroups, isLoading: groupsLoading } = useGroupApi();
  const [searchInput, setSearchInput] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All Groups");
  const [groups, setGroups] = useState<Group[]>([]);
  const [showDummyData, setShowDummyData] = useState(true); // For testing UI

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getGroups();
        setGroups(fetchedGroups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
      }
    };

    fetchGroups();
  }, [getGroups]);

  const handleSearch = () => {
    setQuery(searchInput);

    // Set group filter based on selection
    const selectedGroupId =
      selectedGroup === "All Groups"
        ? undefined
        : groups.find((g) => g.name === selectedGroup)?.id.toString();

    setGroupFilter(selectedGroupId);
    setShowDummyData(false); // Hide dummy data when real search is performed
    performSearch();
  };

  const calculateAverageScore = (scoreCard: ScoreCard): number => {
    return (
      (scoreCard.clarity_score +
        scoreCard.experience_score +
        scoreCard.loyalty_score +
        scoreCard.reputation_score) /
      4
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 8) return "text-green-600 bg-green-100";
    if (score >= 6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  // Use dummy data for UI testing, real data for actual search
  const displayResults = showDummyData ? dummyCandidates : searchResults;
  const displaySummary = showDummyData
    ? "Found 4 highly qualified candidates matching your search criteria. Results are sorted by average score with the best matches first."
    : summary;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Purple Section - AI-Powered Resume Matching */}
      <div
        className="relative px-6 py-12 rounded-b-3xl"
        style={{ backgroundColor: BrandColors.gradient.purple }}
      >
        {/* Star Icon */}
        <div className="absolute top-8 right-8 text-white opacity-80">
          <StarIcon className="w-6 h-6" />
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
              className="flex flex-col items-center justify-center px-8 py-6 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg"
              style={{ backgroundColor: BrandColors.gradient.orange }}
            >
              <DocumentTextIcon className="w-5 h-5 text-white" />
              <span className="mt-2 font-semibold text-white">
                Search by Text
              </span>
            </button>

            {/* Upload JD Button */}
            <button className="flex flex-col items-center justify-center px-8 py-6 rounded-xl border-2 border-white bg-white bg-opacity-10 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-opacity-20 shadow-lg">
              <PlusIcon className="w-5 h-5 text-white" />
              <span className="mt-2 font-semibold text-white">Upload JD</span>
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
                  disabled={groupsLoading}
                >
                  <option value="All Groups">All Groups</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.name}>
                      {group.name}
                    </option>
                  ))}
                </select>
                <FolderIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                {groupsLoading && (
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                  </div>
                )}
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
                className="flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ backgroundColor: BrandColors.gradient.orange }}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
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

      {/* Search Results Section - Show dummy data by default for UI testing */}
      {(displayResults.length > 0 || filters.query) && (
        <div className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            {/* Summary Section */}
            {displaySummary && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Search Summary
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {displaySummary}
                </p>
                {showDummyData && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    💡 This is dummy data for UI testing. Perform a real search
                    to see actual results.
                  </p>
                )}
              </div>
            )}

            {/* Results Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Search Results ({displayResults.length})
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

              {!isLoading && !error && displayResults.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-gray-600 text-lg">No results found</p>
                </div>
              )}

              {!isLoading && !error && displayResults.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {displayResults.map((candidate, index) => {
                    const avgScore = calculateAverageScore(
                      candidate.score_card
                    );
                    const scoreColor = getScoreColor(avgScore);
                    const scoreLabel = getScoreLabel(avgScore);

                    return (
                      <div
                        key={`${candidate.candidate_name}-${index}`}
                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Candidate Header */}
                            <div className="flex items-center space-x-3 mb-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-xl font-semibold text-gray-900">
                                  {candidate.candidate_name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  File: {candidate.file_name}
                                </p>
                              </div>
                            </div>

                            {/* Candidate Details */}
                            <div className="mb-4">
                              <p className="text-gray-700 leading-relaxed">
                                {candidate.details}
                              </p>
                            </div>

                            {/* Score Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  Clarity
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {candidate.score_card.clarity_score}/10
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  Experience
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {candidate.score_card.experience_score}/10
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  Loyalty
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {candidate.score_card.loyalty_score}/10
                                </div>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  Reputation
                                </div>
                                <div className="text-lg font-semibold text-gray-900">
                                  {candidate.score_card.reputation_score}/10
                                </div>
                              </div>
                            </div>

                            {/* Comment */}
                            {candidate.comment && (
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                <p className="text-sm text-blue-800">
                                  <span className="font-medium">Comment:</span>{" "}
                                  {candidate.comment}
                                </p>
                                {candidate.commented_at && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    {new Date(
                                      candidate.commented_at
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Average Score Badge */}
                          <div className="ml-6 flex flex-col items-center">
                            <div
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${scoreColor}`}
                            >
                              {scoreLabel}
                            </div>
                            <div className="text-2xl font-bold text-gray-900 mt-2">
                              {avgScore.toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Avg Score
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
