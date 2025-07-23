import React from "react";
import type { StoreResume as Resume, ResumeComment } from "../../types";
import FileCard from "./FileCard";
import CommentDialog from "./CommentDialog";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface ResumeGridProps {
  filteredResumes: Resume[];
  paginatedResumes: Resume[];
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  selectedGroup: string | null;
  searchQuery: string;
  onDelete: (resume: Resume) => void;
  onResumeDeleted: (resumeId: number) => void;
  onCommentAdded: (resumeId: number, comment: ResumeComment) => void;
  onCommentUpdated: (resumeId: number, comment: ResumeComment) => void;
  onCommentDeleted: (resumeId: number, commentId: number) => void;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const ResumeGrid: React.FC<ResumeGridProps> = ({
  filteredResumes,
  paginatedResumes,
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  selectedGroup,
  searchQuery,
  onDelete,
  onResumeDeleted,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
  onPageChange,
}) => {
  const [selectedResume, setSelectedResume] = React.useState<Resume | null>(
    null
  );
  const [isCommentDialogOpen, setIsCommentDialogOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [resumeToDelete, setResumeToDelete] = React.useState<Resume | null>(
    null
  );

  const handleCommentClick = (resume: Resume) => {
    setSelectedResume(resume);
    setIsCommentDialogOpen(true);
  };

  const handleDeleteClick = (resume: Resume) => {
    setResumeToDelete(resume);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (resumeToDelete) {
      onDelete(resumeToDelete);
      onResumeDeleted(resumeToDelete.id);
      setIsDeleteModalOpen(false);
      setResumeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setResumeToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to{" "}
          {Math.min(endIndex, filteredResumes.length)} of{" "}
          {filteredResumes.length} results
          {(selectedGroup || searchQuery) && (
            <span className="ml-2">
              (filtered from {filteredResumes.length} total resumes)
            </span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Resume Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedResumes.map((resume) => (
          <FileCard
            key={resume.id}
            resume={resume}
            onView={() => {
              if (resume.cloud_url) {
                try {
                  // Open the cloud URL in a new tab for viewing
                  window.open(resume.cloud_url, "_blank");
                  console.log(
                    `✅ Opened resume "${
                      resume.original_filename || resume.filename
                    }" in new tab`
                  );
                } catch (error) {
                  console.error(
                    `❌ Failed to open resume "${
                      resume.original_filename || resume.filename
                    }":`,
                    error
                  );
                  alert(
                    `Unable to view resume "${
                      resume.original_filename || resume.filename
                    }" - please try again`
                  );
                }
              } else {
                console.warn(
                  "No cloud URL available for viewing resume:",
                  resume
                );
                alert(
                  `Unable to view resume "${
                    resume.original_filename || resume.filename
                  }" - no cloud URL available`
                );
              }
            }}
            onDownload={() => {
              if (resume.cloud_url) {
                const downloadFile = async () => {
                  try {
                    console.log(
                      `🔄 Starting download for "${
                        resume.original_filename || resume.filename
                      }"`
                    );

                    // Fetch the file from the cloud URL
                    const response = await fetch(resume.cloud_url!);
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // Get the file as a blob
                    const blob = await response.blob();

                    // Create a blob URL
                    const blobUrl = window.URL.createObjectURL(blob);

                    // Create download link
                    const link = document.createElement("a");
                    link.href = blobUrl;
                    link.download = resume.original_filename || resume.filename;
                    link.style.display = "none";

                    // Append to body, click, and cleanup
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    // Clean up the blob URL
                    window.URL.revokeObjectURL(blobUrl);

                    console.log(
                      `✅ Successfully downloaded "${
                        resume.original_filename || resume.filename
                      }"`
                    );
                  } catch (error) {
                    console.error(
                      `❌ Download failed for "${
                        resume.original_filename || resume.filename
                      }":`,
                      error
                    );

                    // Fallback: try to open in new tab
                    try {
                      window.open(resume.cloud_url, "_blank");
                      alert(
                        `Download failed. Opened resume "${
                          resume.original_filename || resume.filename
                        }" in new tab. You can save it manually using Ctrl+S (or Cmd+S on Mac).`
                      );
                    } catch (fallbackError) {
                      console.error(`❌ Fallback also failed:`, fallbackError);
                      alert(
                        `Unable to download or open resume "${
                          resume.original_filename || resume.filename
                        }". Please try again or contact support.`
                      );
                    }
                  }
                };

                // Execute the download
                downloadFile();
              } else {
                console.warn(
                  "No cloud URL available for downloading resume:",
                  resume
                );
                alert(
                  `Unable to download resume "${
                    resume.original_filename || resume.filename
                  }" - no cloud URL available`
                );
              }
            }}
            onDelete={() => handleDeleteClick(resume)}
            onComment={() => handleCommentClick(resume)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() =>
                onPageChange({} as React.ChangeEvent<unknown>, currentPage - 1)
              }
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() =>
                  onPageChange({} as React.ChangeEvent<unknown>, page)
                }
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  currentPage === page
                    ? "text-white bg-blue-600 border border-blue-600"
                    : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() =>
                onPageChange({} as React.ChangeEvent<unknown>, currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Comment Dialog */}
      {selectedResume && (
        <CommentDialog
          open={isCommentDialogOpen}
          onClose={() => {
            setIsCommentDialogOpen(false);
            setSelectedResume(null);
          }}
          resume={selectedResume}
          onCommentAdded={onCommentAdded}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        resume={resumeToDelete}
      />
    </div>
  );
};

export default ResumeGrid;
