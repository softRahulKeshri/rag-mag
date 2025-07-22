import React, { useState, useMemo } from "react";
import ResumeAnalyticsHeader from "./ResumeAnalyticsHeader";
import SearchAndFilterSection from "./SearchAndFilterSection";
import ResumeCard from "./ResumeCard";
import Pagination from "./Pagination";

interface Resume {
  id: number;
  filename: string;
  fileSize: string;
  fileType: string;
  group: string | undefined;
  uploadDate: string;
}

interface Group {
  name: string;
  count: number;
  isActive: boolean;
}

interface NewResumeCollectionProps {
  resumes: Resume[];
  groups: Group[];
  totalResumes: number;
  totalGroups: number;
  isLoading?: boolean;
  onView: (resume: Resume) => void;
  onDownload: (resume: Resume) => void;
  onDelete: (resume: Resume) => void;
  onAddComment: (resume: Resume) => void;
}

const NewResumeCollection: React.FC<NewResumeCollectionProps> = ({
  resumes,
  groups,
  totalResumes,
  totalGroups,
  isLoading = false,
  onView,
  onDownload,
  onDelete,
  onAddComment,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Show 6 items per page to match the image

  // Filter resumes based on search and group
  const filteredResumes = useMemo(() => {
    return resumes.filter((resume) => {
      const matchesSearch = searchQuery
        ? resume.filename.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      const matchesGroup = selectedGroup
        ? resume.group === selectedGroup
        : true;
      return matchesSearch && matchesGroup;
    });
  }, [resumes, searchQuery, selectedGroup]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredResumes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResumes = filteredResumes.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Loading Header */}
            <div className="text-center mb-8">
              <div className="h-16 w-16 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>

            {/* Loading Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
              ))}
            </div>

            {/* Loading Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-10 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-8 bg-gray-200 rounded w-1/4"></div>
                ))}
              </div>
            </div>

            {/* Loading Resume Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Analytics Header */}
        <ResumeAnalyticsHeader
          totalResumes={totalResumes}
          totalGroups={totalGroups}
        />

        {/* Search and Filter Section */}
        <SearchAndFilterSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
          groupFilters={groups}
          totalResumes={totalResumes}
          totalGroups={totalGroups}
        />

        {/* Resume Grid */}
        {filteredResumes.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || selectedGroup
                  ? "No resumes found"
                  : "No resumes uploaded yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || selectedGroup
                  ? "No resumes match your current filters."
                  : "Get started by uploading your first resume to begin tracking and analyzing your collection."}
              </p>
              {(searchQuery || selectedGroup) && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGroup(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedResumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onView={() => onView(resume)}
                  onDownload={() => onDownload(resume)}
                  onDelete={() => onDelete(resume)}
                  onAddComment={() => onAddComment(resume)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredResumes.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewResumeCollection;
