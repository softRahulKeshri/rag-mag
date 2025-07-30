import React from "react";
import type { StoreResume as Resume, ResumeComment } from "../../types";
import FileCard from "./FileCard";
import CommentDialog from "./CommentDialog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Pagination from "./Pagination";
import { DocumentTextIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { buildResumeApiUrl } from "./utils";

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
  onCommentDeleted: (resumeId: number) => void;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  isDeleting?: boolean;
  deletingResumeId?: number | null;
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
  isDeleting = false,
  deletingResumeId = null,
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
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Results Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-semibold text-gray-900">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredResumes.length)} of{" "}
                {filteredResumes.length} results
              </div>
              {(selectedGroup || searchQuery) && (
                <div className="flex items-center space-x-2 mt-1">
                  <FunnelIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span className="text-xs sm:text-sm text-gray-600">
                    Filtered from {paginatedResumes.length} total resumes
                  </span>
                </div>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600">Page</span>
              <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-semibold rounded-lg">
                {currentPage}
              </div>
              <span className="text-xs sm:text-sm text-gray-600">
                of {totalPages}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Resume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {paginatedResumes.map((resume) => (
          <FileCard
            key={resume.id}
            resume={resume}
            onView={() => {
              const fileUrl = buildResumeApiUrl(resume.id);

              try {
                // For viewing, we'll fetch the file and create a blob URL to display inline
                const viewFile = async () => {
                  try {
                    console.log(
                      `🔄 Loading resume for viewing: "${
                        resume.original_filename || resume.filename
                      }" from URL: ${fileUrl}`
                    );

                    // Fetch the file
                    const response = await fetch(fileUrl);
                    if (!response.ok) {
                      throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    // Get the file as a blob
                    const blob = await response.blob();

                    // Create a blob URL for viewing
                    const blobUrl = window.URL.createObjectURL(blob);

                    // Open in new tab for viewing
                    window.open(blobUrl, "_blank");

                    // Clean up the blob URL after a delay to allow the tab to open
                    setTimeout(() => {
                      window.URL.revokeObjectURL(blobUrl);
                    }, 1000);

                    console.log(
                      `✅ Opened resume "${
                        resume.original_filename || resume.filename
                      }" for viewing in new tab`
                    );
                  } catch (error) {
                    console.error(
                      `❌ Failed to load resume for viewing "${
                        resume.original_filename || resume.filename
                      }":`,
                      error
                    );

                    // Fallback: try to open the URL directly
                    try {
                      window.open(fileUrl, "_blank");
                      console.log(
                        `✅ Fallback: Opened resume "${
                          resume.original_filename || resume.filename
                        }" directly in new tab`
                      );
                    } catch (fallbackError) {
                      console.error("❌ Fallback also failed:", fallbackError);
                      alert(
                        `Unable to view resume "${
                          resume.original_filename || resume.filename
                        }" - please try again`
                      );
                    }
                  }
                };

                viewFile();
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
            }}
            onDownload={() => {
              const fileUrl = buildResumeApiUrl(resume.id);

              const downloadFile = async () => {
                try {
                  console.log(
                    `🔄 Starting download for "${
                      resume.original_filename || resume.filename
                    }" from URL: ${fileUrl}`
                  );

                  // Fetch the file from the new download endpoint
                  const response = await fetch(fileUrl);
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
                    `❌ Failed to download resume "${
                      resume.original_filename || resume.filename
                    }":`,
                    error
                  );

                  // Try direct download as fallback
                  try {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = resume.original_filename || resume.filename;
                    link.target = "_blank";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    console.log(
                      `✅ Fallback download initiated for "${
                        resume.original_filename || resume.filename
                      }"`
                    );
                  } catch (fallbackError) {
                    console.error(
                      "❌ Fallback download also failed:",
                      fallbackError
                    );
                    alert(
                      `Unable to download resume "${
                        resume.original_filename || resume.filename
                      }" - please try again or contact support`
                    );
                  }
                }
              };

              downloadFile();
            }}
            onDelete={() => handleDeleteClick(resume)}
            onComment={() => handleCommentClick(resume)}
            onEditComment={() => handleCommentClick(resume)}
            onDeleteComment={() => {
              console.log(`Deleting comment for resume ID: ${resume.id}`);
              onCommentDeleted(resume.id);
            }}
            isDeleting={isDeleting && deletingResumeId === resume.id}
          />
        ))}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 sm:mt-12">
          <div className="w-full max-w-4xl">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredResumes.length}
              itemsPerPage={10}
              onPageChange={(page) =>
                onPageChange({} as React.ChangeEvent<unknown>, page)
              }
            />
          </div>
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
