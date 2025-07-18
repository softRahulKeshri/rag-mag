import React from "react";
import type { ResumeComment } from "./types";
import { formatDate } from "./utils";

interface CommentDisplayProps {
  comment: ResumeComment;
}

const CommentDisplay: React.FC<CommentDisplayProps> = ({ comment }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div className="flex items-start space-x-2">
        {/* Comment Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 leading-relaxed">
            {comment.comment}
          </p>

          {/* Comment Metadata */}
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
            {comment.hrName && (
              <>
                <span className="font-medium text-gray-600">
                  {comment.hrName}
                </span>
                <span>•</span>
              </>
            )}
            <span>{formatDate(comment.createdAt)}</span>
            {comment.updatedAt !== comment.createdAt && (
              <>
                <span>•</span>
                <span>Edited {formatDate(comment.updatedAt)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentDisplay;
