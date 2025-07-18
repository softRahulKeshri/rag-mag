import React from "react";
import type { Resume } from "./types";

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resume: Resume | null;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  resume,
}) => {
  if (!open || !resume) return null;

  const filename = resume.original_filename || resume.filename;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Delete Resume
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Are you sure you want to delete this resume? This action cannot be
            undone.
          </p>

          {/* Resume Info */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg text-left">
            <p className="text-sm font-medium text-gray-900">{filename}</p>
            <p className="text-xs text-gray-500 mt-1">
              {resume.group && `Group: ${resume.group}`}
            </p>
            <p className="text-xs text-gray-500">
              Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 justify-center">
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
