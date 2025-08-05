import React from "react";
import type { StoreResume as Resume, ResumeComment } from "../../types";
import FileCard from "./FileCard";
import CommentDialog from "./CommentDialog";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Pagination from "./Pagination";
import { buildResumeApiUrl } from "./utils";

interface ResumeGridProps {
  filteredResumes: Resume[];
  paginatedResumes: Resume[];
  currentPage: number;
  totalPages: number;
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
      {/* Enhanced Resume Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
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
