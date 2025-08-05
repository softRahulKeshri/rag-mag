import React from "react";
import type { StoreResume as Resume } from "../../types";
import { formatDate } from "./utils";
import {
  EyeIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
  ArrowPathIcon,
  PencilIcon,
  ClockIcon,
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon as TimeIcon,
} from "@heroicons/react/24/outline";

interface FileCardProps {
  resume: Resume;
  onView: () => void;
  onDelete: () => void;
  onComment: () => void;
  onEditComment: () => void;
  onDeleteComment: () => void;
  isDeleting?: boolean;
}

const FileCard: React.FC<FileCardProps> = ({
  resume,
  onView,
  onDelete,
  onComment,
  onEditComment,
  onDeleteComment,
  isDeleting = false,
}) => {
  // Use real data from API response, with proper debugging
  const candidateName = resume.name || "Unknown Candidate";
  const jobProfile = resume.job_profile || "Software Engineer";
  const totalExperience = resume.total_experience || "3-5 years";
  const availability = resume.days_available || "Available";

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
    <div className="group relative h-full">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl transform transition-transform group-hover:scale-105 opacity-0 group-hover:opacity-100"></div>

      {/* Main card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300/50 h-full flex flex-col">
        {/* Candidate Header */}
        <div className="flex items-start space-x-4 mb-6">
          {/* Candidate Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Candidate Info */}
          <div className="flex-1 min-w-0">
            <h3
              className="text-lg font-semibold text-gray-900 truncate mb-4"
              title={candidateName}
            >
              {candidateName}
            </h3>
            <div className="space-y-3">
              {/* Job Profile */}
              <div className="flex items-center">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  <BriefcaseIcon className="w-4 h-4 mr-2" />
                  {jobProfile}
                </span>
              </div>

              {/* Experience and Availability */}
              <div className="flex flex-col space-y-2">
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 w-fit">
                  <TimeIcon className="w-4 h-4 mr-2" />
                  {totalExperience}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200 w-fit">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {availability}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6 mt-auto">
          <button
            onClick={onView}
            disabled={isDeleting}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              isDeleting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            View Resume
          </button>

          <button
            onClick={onDelete}
            disabled={isDeleting}
            className={`flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
              isDeleting
                ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                : "text-red-700 bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
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

        {/* Enhanced Comment Section */}
        {resume.comment ? (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4 mb-4">
            <div className="flex items-start space-x-3">
              {/* Enhanced User Avatar */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">HR</span>
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">
                    HR Team
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={onEditComment}
                      disabled={isDeleting}
                      className={`p-1 rounded-lg transition-colors duration-200 ${
                        isDeleting
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-500 hover:text-blue-600 hover:bg-blue-100"
                      }`}
                      title="Edit Comment"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={onDeleteComment}
                      disabled={isDeleting}
                      className={`p-1 rounded-lg transition-colors duration-200 ${
                        isDeleting
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-gray-500 hover:text-red-600 hover:bg-red-100"
                      }`}
                      title="Delete Comment"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-blue-600 font-medium mb-3">
                  {formatDate(resume.comment.createdAt)}
                </p>

                <p className="text-sm text-gray-700 leading-relaxed bg-white/60 rounded-lg p-3 border border-blue-200/50">
                  {resume.comment.comment}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Enhanced Add Comment Button */
          <div className="mb-4">
            <button
              onClick={onComment}
              disabled={isDeleting}
              className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border-2 border-dashed transition-all duration-200 ${
                isDeleting
                  ? "text-gray-400 bg-gray-50 border-gray-200 cursor-not-allowed"
                  : "text-orange-700 bg-orange-50 border-orange-300 hover:bg-orange-100 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              }`}
            >
              <ChatBubbleLeftIcon className="w-5 h-5 mr-2" />
              Add Comment
            </button>
          </div>
        )}

        {/* Enhanced Edit Comment Button (shown when comment exists) */}
        {resume.comment && (
          <button
            onClick={onEditComment}
            disabled={isDeleting}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
              isDeleting
                ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
                : "text-orange-700 bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            }`}
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            Update Comment
          </button>
        )}

        {/* Upload Date at Bottom */}
        <div className="flex items-center justify-center text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200/50">
          <ClockIcon className="w-4 h-4 mr-2 text-gray-400" />
          <span className="font-medium">Uploaded:</span>
          <span className="ml-1">{formatUploadDate(resume.uploadedAt)}</span>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

export default FileCard;
