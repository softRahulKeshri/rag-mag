import React from "react";
import type { StoreResume as Resume } from "../../types";
import {
  formatFileSize,
  formatDate,
} from "./utils";
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

interface FileCardProps {
  resume: Resume;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onComment: () => void;
  onEditComment: () => void;
  onDeleteComment: () => void;
  isDeleting?: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  resume,
  onView,
  onDownload,
  onDelete,
  onComment,
  onEditComment,
  onDeleteComment,
  isDeleting = false,
}) => {
  const filename = resume.original_filename || resume.filename;

  // Format upload date for display
  const formatUploadDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* File Header */}
      <div className="flex items-start space-x-3 mb-4">
        {/* PDF Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PDF</span>
          </div>
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-sm font-medium text-gray-900 truncate"
            title={filename}
          >
            {filename}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {formatFileSize(resume.fileSize)}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              <DocumentIcon className="w-3 h-3 mr-1" />
              PDF
            </span>
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
              1
            </span>
          </div>
        </div>
      </div>

      {/* Upload Date */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Uploaded {formatUploadDate(resume.uploadedAt)}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={onView}
          disabled={isDeleting}
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500"
          }`}
        >
          <EyeIcon className="w-4 h-4 mr-1" />
          View
        </button>

        <button
          onClick={onDownload}
          disabled={isDeleting}
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent shadow-sm text-xs font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
          }`}
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
          Download
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-purple-700 bg-white hover:bg-purple-50 focus:ring-purple-500"
          }`}
          title={isDeleting ? "Deleting..." : "Delete Resume"}
        >
          {isDeleting ? (
            <ArrowPathIcon className="w-4 h-4 animate-spin" />
          ) : (
            <TrashIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Comment Section */}
      {resume.comment ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start space-x-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">HR</span>
              </div>
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">
                  HR Team
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onEditComment}
                    disabled={isDeleting}
                    className={`text-gray-400 hover:text-gray-600 ${
                      isDeleting ? "cursor-not-allowed" : ""
                    }`}
                    title="Edit Comment"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onDeleteComment}
                    disabled={isDeleting}
                    className={`text-gray-400 hover:text-red-600 ${
                      isDeleting ? "cursor-not-allowed" : ""
                    }`}
                    title="Delete Comment"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                {formatDate(resume.comment.createdAt)}
              </p>

              <p className="text-sm text-gray-700">{resume.comment.comment}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Add Comment Button */
        <button
          onClick={onComment}
          disabled={isDeleting}
          className={`w-full inline-flex items-center justify-center px-3 py-2 border border-orange-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-orange-700 bg-white hover:bg-orange-50 focus:ring-orange-500"
          }`}
        >
          <ChatBubbleLeftIcon className="w-4 h-4 mr-1" />
          Add Comment
        </button>
      )}

      {/* Edit Comment Button (shown when comment exists) */}
      {resume.comment && (
        <button
          onClick={onEditComment}
          disabled={isDeleting}
          className={`w-full mt-3 inline-flex items-center justify-center px-3 py-2 border border-orange-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-orange-700 bg-white hover:bg-orange-50 focus:ring-orange-500"
          }`}
        >
          <PencilIcon className="w-4 h-4 mr-1" />
          Edit Comment
        </button>
      )}
    </div>
  );
};

export default FileCard;
