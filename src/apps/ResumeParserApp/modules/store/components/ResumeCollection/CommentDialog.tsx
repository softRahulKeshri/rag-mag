import React, { useState, useEffect } from "react";
import { useCommentApi } from "../../../../hooks/useCommentApi";
import type { StoreResume, ResumeComment } from "../../types";
import { formatDate } from "./utils";

interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  resume: StoreResume;
  onCommentAdded: (resumeId: number, comment: ResumeComment) => void;
  onCommentUpdated: (resumeId: number, comment: ResumeComment) => void;
  onCommentDeleted: (resumeId: number) => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  open,
  onClose,
  resume,
  onCommentAdded,
  onCommentUpdated,
  onCommentDeleted,
}) => {
  const [commentText, setCommentText] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { createOrUpdateComment, deleteComment, isLoading, error, clearError } =
    useCommentApi();

  // Reset form when dialog opens/closes or resume changes
  useEffect(() => {
    if (open) {
      setCommentText(resume.comment?.comment || "");
      clearError();
    } else {
      setCommentText("");
      setIsDeleteModalOpen(false);
    }
  }, [open, resume.comment?.comment, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      console.log(
        `💬 Submitting comment for resume ${resume.id}:`,
        commentText
      );

      // Call the API to create or update the comment
      const newComment = await createOrUpdateComment(
        resume.id,
        commentText.trim()
      );

      console.log(`✅ Comment saved successfully:`, newComment);

      // Notify parent component
      if (resume.comment) {
        await onCommentUpdated(resume.id, newComment);
      } else {
        await onCommentAdded(resume.id, newComment);
      }

      onClose();
    } catch (error) {
      console.error("❌ Error saving comment:", error);
      // Error is already handled by the hook and will be displayed
    }
  };

  const handleDelete = () => {
    if (resume.comment) {
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (resume.comment) {
      try {
        console.log(`🗑️ Deleting comment for resume ${resume.id}`);

        // Call the API to delete the comment
        await deleteComment(resume.id);

        console.log(`✅ Comment deleted successfully`);

        // Notify parent component
        await onCommentDeleted(resume.id);
        onClose();
      } catch (error) {
        console.error("❌ Error deleting comment:", error);
        // Error is already handled by the hook and will be displayed
      }
    }
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {resume.comment ? "Edit Comment" : "Add Comment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Resume Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs font-bold">PDF</span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  {resume.filename}
                </h3>
                <p className="text-xs text-gray-500">
                  Uploaded {formatDate(resume.uploadedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Comment Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Comment
              </label>
              <textarea
                id="comment"
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your comment here..."
                disabled={isLoading}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={isLoading || !commentText.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : resume.comment ? (
                    "Update Comment"
                  ) : (
                    "Add Comment"
                  )}
                </button>

                {resume.comment && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Comment
                  </h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this comment? This action
                    cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentDialog;
