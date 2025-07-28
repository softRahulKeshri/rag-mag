import React, { useState, useEffect } from "react";
import { useCommentApi } from "../../../../hooks/useCommentApi";
import type { StoreResume, ResumeComment } from "../../types";
import { formatDate } from "./utils";
import {
  XMarkIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  TrashIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-lg w-full mx-4 border border-gray-200/50">
        {/* Enhanced Header */}
        <div className="relative px-8 py-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {resume.comment ? "Edit Comment" : "Add Comment"}
              </h2>
              <p className="text-sm text-gray-600">
                Share your thoughts and feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Error Display */}
        {error && (
          <div className="mx-8 mt-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  Error occurred
                </h4>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Content */}
        <div className="p-8">
          {/* Enhanced Resume Info */}
          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200/50">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <DocumentTextIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {resume.filename}
                </h3>
                <p className="text-xs text-blue-600 font-medium">
                  Uploaded {formatDate(resume.uploadedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                <SparklesIcon className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-medium text-blue-600">
                  AI Ready
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-semibold text-gray-800 mb-3"
              >
                Your Comment
              </label>
              <div className="relative">
                <textarea
                  id="comment"
                  rows={5}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                  placeholder="Share your insights, feedback, or notes about this resume..."
                  disabled={isLoading}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {commentText.length}/500
                </div>
                {/* Textarea glow effect */}
                <div className="absolute inset-0 rounded-xl border-2 border-blue-300 opacity-0 peer-focus:opacity-20 transition-opacity duration-200 pointer-events-none"></div>
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={isLoading || !commentText.trim()}
                  className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    isLoading || !commentText.trim()
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 transform hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : resume.comment ? (
                    <>
                      <SparklesIcon className="w-4 h-4 mr-2" />
                      Update Comment
                    </>
                  ) : (
                    <>
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                      Add Comment
                    </>
                  )}
                </button>

                {resume.comment && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                      isLoading
                        ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                        : "border-red-300 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                    }`}
                  >
                    <TrashIcon className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                  isLoading
                    ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-200/50">
            <div className="p-8">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Delete Comment
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Are you sure you want to delete this comment? This action
                    cannot be undone and all associated data will be permanently
                    removed.
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleDeleteCancel}
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                    isLoading
                      ? "border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isLoading}
                  className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 ${
                    isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Delete Comment
                    </>
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
