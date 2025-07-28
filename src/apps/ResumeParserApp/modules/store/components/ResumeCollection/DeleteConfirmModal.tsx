import React from "react";
import type { StoreResume as Resume } from "../../types";

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative mx-auto max-w-lg w-full bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-5 w-5 text-white"
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
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-white">
                Delete Resume
              </h3>
              <p className="text-red-100 text-sm">
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-600 mb-6 leading-relaxed">
            Are you sure you want to permanently delete this resume from your collection? 
            All associated data and comments will be lost.
          </p>

          {/* Resume Info Card */}
          <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200/50 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{filename}</p>
                <div className="flex items-center space-x-4 mt-1">
                  {resume.group && (
                    <span className="text-xs text-gray-500">
                      <span className="font-medium">Group:</span> {resume.group}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    <span className="font-medium">Uploaded:</span> {new Date(resume.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
