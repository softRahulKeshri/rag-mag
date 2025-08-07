import React, { useState } from "react";
import { resumeApi } from "../../../../../../lib/axios";
import { buildResumeApiUrl } from "./utils";
import ResumeCard from "./ResumeCard";
import Pagination from "./Pagination";
import DeleteConfirmModal from "./DeleteConfirmModal";
import CommentDialog from "./CommentDialog";
import type { ResumeData, ResumeComment } from "../../../../../../types/global";

interface ResumeGridProps {
  filteredResumes: ResumeData[];
  paginatedResumes: ResumeData[];
  currentPage: number;
  totalPages: number;
  onDelete: (resume: ResumeData) => void;
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
  onDelete,
  onResumeDeleted,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
  onPageChange,
}) => {
  const [selectedResume, setSelectedResume] = React.useState<ResumeData | null>(
    null
  );
  const [isCommentDialogOpen, setIsCommentDialogOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = React.useState<ResumeData | null>(
    null
  );

  const handleCommentClick = (resume: ResumeData) => {
    setSelectedResume(resume);
    setIsCommentDialogOpen(true);
  };

  const handleDeleteClick = (resume: ResumeData) => {
    setResumeToDelete(resume);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (resumeToDelete) {
      onDelete(resumeToDelete);
      onResumeDeleted(resumeToDelete.id);
      setShowDeleteModal(false);
      setResumeToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setResumeToDelete(null);
  };

  // Handle pagination change
  const handlePageChange = (page: number) => {
    onPageChange({} as React.ChangeEvent<unknown>, page);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Enhanced Resume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
        {paginatedResumes.map((resume) => (
          <ResumeCard
            key={resume.id}
            resume={resume}
            onView={() => {
              try {
                // For viewing, we'll fetch the file and create a blob URL to display inline
                const viewFile = async () => {
                  try {
                    console.log(
                      `🔄 Loading resume for viewing: "${
                        resume.originalFilename || resume.filename
                      }" with JWT authentication`
                    );

                    // Log the request details
                    console.log(`🔐 JWT Token for resume view API call:`, {
                      endpoint: `/resume/${resume.id}`,
                      method: "GET",
                      resumeId: resume.id,
                      filename: resume.originalFilename || resume.filename,
                      timestamp: new Date().toISOString(),
                    });

                    // Use axios with JWT authentication
                    const response = await resumeApi.get(
                      `/resume/${resume.id}`,
                      {
                        responseType: "blob",
                      }
                    );

                    // Get the file as a blob
                    const blob = response.data;

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
                        resume.originalFilename || resume.filename
                      }" for viewing in new tab`
                    );
                  } catch (error) {
                    console.error(
                      `❌ Failed to load resume for viewing "${
                        resume.originalFilename || resume.filename
                      }":`,
                      error
                    );

                    // Handle specific error cases
                    if (
                      error &&
                      typeof error === "object" &&
                      "response" in error
                    ) {
                      const axiosError = error as {
                        response?: { status: number };
                      };

                      if (axiosError.response?.status === 401) {
                        alert("Authentication failed. Please login again.");
                        return;
                      } else if (axiosError.response?.status === 404) {
                        alert("Resume file not found.");
                        return;
                      } else if (axiosError.response?.status === 403) {
                        alert(
                          "Access denied. You don't have permission to view this file."
                        );
                        return;
                      }
                    }

                    // Fallback: try to open the URL directly
                    try {
                      const fileUrl = buildResumeApiUrl(resume.id);
                      window.open(fileUrl, "_blank");
                      console.log(
                        `✅ Fallback: Opened resume "${
                          resume.originalFilename || resume.filename
                        }" directly in new tab`
                      );
                    } catch (fallbackError) {
                      console.error("❌ Fallback also failed:", fallbackError);
                      alert(
                        `Unable to view resume "${
                          resume.originalFilename || resume.filename
                        }" - please try again`
                      );
                    }
                  }
                };

                viewFile();
              } catch (error) {
                console.error(
                  `❌ Failed to open resume "${
                    resume.originalFilename || resume.filename
                  }":`,
                  error
                );
                alert(
                  `Unable to view resume "${
                    resume.originalFilename || resume.filename
                  }" - please try again`
                );
              }
            }}
            onDownload={() => {
              // Download functionality can be added here
              console.log("Download functionality not implemented yet");
            }}
            onDelete={() => handleDeleteClick(resume)}
            onAddComment={() => handleCommentClick(resume)}
            onEditComment={() => handleCommentClick(resume)}
            onDeleteComment={() => {
              console.log(`Deleting comment for resume ID: ${resume.id}`);
              onCommentDeleted(resume.id);
            }}
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
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        resume={resumeToDelete}
      />

      {/* Comment Dialog */}
      {selectedResume && (
        <CommentDialog
          open={isCommentDialogOpen}
          onClose={() => setIsCommentDialogOpen(false)}
          resume={selectedResume}
          onCommentAdded={onCommentAdded}
          onCommentUpdated={onCommentUpdated}
          onCommentDeleted={onCommentDeleted}
        />
      )}
    </div>
  );
};

export default ResumeGrid;
