import React from "react";
import type { StoreResume as Resume } from "../../types";
import {
  formatFileSize,
  formatDate,
  getStatusColor,
  getStatusText,
} from "./utils";
import CommentDisplay from "./CommentDisplay";
import {
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

interface FileCardProps {
  resume: Resume;
  onView: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onComment: () => void;
  isDeleting?: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  resume,
  onView,
  onDownload,
  onDelete,
  onComment,
  isDeleting = false,
}) => {
  const filename = resume.original_filename || resume.filename;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* File Header */}
      <div className="flex items-start space-x-3 mb-4">
        {/* File Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DocumentIcon className="w-5 h-5 text-blue-600" />
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
          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
            <span>{formatFileSize(resume.fileSize)}</span>
            <span>•</span>
            <span>{resume.fileType.toUpperCase()}</span>
            <span>•</span>
            <span>{formatDate(resume.uploadedAt)}</span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            resume.status
          )}`}
        >
          {getStatusText(resume.status)}
        </span>
      </div>

      {/* Group Badge */}
      {resume.group && (
        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {resume.group}
          </span>
        </div>
      )}

      {/* Comment Display */}
      {resume.comment && (
        <div className="mb-4">
          <CommentDisplay comment={resume.comment} />
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2">
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
          className={`flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500"
          }`}
        >
          <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
          Download
        </button>

        <button
          onClick={onComment}
          disabled={isDeleting}
          className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500"
          }`}
          title={isDeleting ? "Cannot edit while deleting" : "Add/Edit Comment"}
        >
          <ChatBubbleLeftIcon className="w-4 h-4" />
        </button>

        <button
          onClick={onDelete}
          disabled={isDeleting}
          className={`inline-flex items-center justify-center px-3 py-2 border border-gray-300 shadow-sm text-xs font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDeleting
              ? "text-gray-400 bg-gray-100 cursor-not-allowed"
              : "text-red-700 bg-white hover:bg-red-50 focus:ring-red-500"
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
    </div>
  );
};

export default FileCard;
