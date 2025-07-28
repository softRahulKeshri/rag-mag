import React from "react";
import type { StoreResume as Resume, ResumeComment } from "../../types";
import FileCard from "./FileCard";
import CommentDialog from "./CommentDialog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import { API_CONFIG } from "../../../../theme/constants";

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

  // Enhanced file URL builder function
  const getFileUrl = (resume: Resume): string => {
    // First priority: use cloud_url if available
    if (resume.cloud_url) {
      return resume.cloud_url;
    }

    // Fallback: construct URL using filepath and base API URL
    if (resume.filepath) {
      // Remove any leading slashes and construct full URL
      const cleanPath = resume.filepath.startsWith("/")
        ? resume.filepath.substring(1)
        : resume.filepath;
      return `${API_CONFIG.baseURL}/${cleanPath}`;
    }

    // Last resort: return empty string (will show error)
    return "";
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Results Summary */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <DocumentTextIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Showing {startIndex + 1}-
                {Math.min(endIndex, filteredResumes.length)} of{" "}
                {filteredResumes.length} results
              </div>
              {(selectedGroup || searchQuery) && (
                <div className="flex items-center space-x-2 mt-1">
                  <FunnelIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Filtered from {paginatedResumes.length} total resumes
                  </span>
                </div>
              )}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Page</span>
              <div className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-semibold rounded-lg">
                {currentPage}
              </div>
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Resume Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedResumes.map((resume) => (
          <FileCard
            key={resume.id}
            resume={resume}
            onView={() => {
              const fileUrl = getFileUrl(resume);

              if (fileUrl) {
                try {
                  // Open the file URL in a new tab for viewing
                  window.open(fileUrl, "_blank");
                  console.log(
                    `✅ Opened resume "${
                      resume.original_filename || resume.filename
                    }" in new tab using URL: ${fileUrl}`
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
                console.warn("No URL available for viewing resume:", resume);
                alert(
                  `Unable to view resume "${
                    resume.original_filename || resume.filename
                  }" - no file URL available`
                );
              }
            }}
            onDownload={() => {
              const fileUrl = getFileUrl(resume);

              if (fileUrl) {
                const downloadFile = async () => {
                  try {
                    console.log(
                      `🔄 Starting download for "${
                        resume.original_filename || resume.filename
                      }" from URL: ${fileUrl}`
                    );

                    // Fetch the file from the URL (cloud_url or constructed filepath URL)
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
                      link.download =
                        resume.original_filename || resume.filename;
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
              } else {
                console.warn(
                  "No URL available for downloading resume:",
                  resume
                );
                alert(
                  `Unable to download resume "${
                    resume.original_filename || resume.filename
                  }" - no file URL available`
                );
              }
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
        <div className="flex justify-center mt-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
            <nav className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() =>
                  onPageChange(
                    {} as React.ChangeEvent<unknown>,
                    currentPage - 1
                  )
                }
                disabled={currentPage === 1}
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
                  currentPage === 1
                    ? "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                }`}
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() =>
                      onPageChange({} as React.ChangeEvent<unknown>, page)
                    }
                    className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 border border-indigo-500 shadow-lg"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() =>
                  onPageChange(
                    {} as React.ChangeEvent<unknown>,
                    currentPage + 1
                  )
                }
                disabled={currentPage === totalPages}
                className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200 ${
                  currentPage === totalPages
                    ? "text-gray-300 bg-gray-50 border-gray-200 cursor-not-allowed"
                    : "text-gray-600 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                }`}
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </nav>
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
