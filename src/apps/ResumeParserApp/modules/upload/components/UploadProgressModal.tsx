import React from "react";
import {
  XMarkIcon,
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface UploadProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  error?: string | null;
}

const UploadProgressModal: React.FC<UploadProgressModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  selectedFiles,
  uploadProgress,
  uploadStatus,
  error,
}) => {
  if (!isOpen) return null;

  const overallProgress =
    Object.values(uploadProgress).reduce((sum, progress) => sum + progress, 0) /
      selectedFiles.length || 0;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <CloudArrowUpIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Uploading Files
                  </h3>
                  <p className="text-sm text-blue-100">
                    {selectedFiles.length} files being processed
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {/* Overall Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm font-semibold text-blue-600">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            {/* File List - Clean without individual progress bars */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {selectedFiles.map((file, index) => {
                const progress = uploadProgress[file.name] || 0;
                const isCompleted = progress === 100;
                const hasError = error && !isCompleted;

                return (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        </div>
                      ) : hasError ? (
                        <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                          <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                          <CloudArrowUpIcon className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>

                    {/* Status Text */}
                    <div className="flex-shrink-0 text-right">
                      {isCompleted ? (
                        <span className="text-xs font-medium text-green-600">
                          Completed
                        </span>
                      ) : hasError ? (
                        <span className="text-xs font-medium text-red-600">
                          Failed
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-blue-600">
                          Processing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Message */}
            {uploadStatus === "uploading" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-700 text-center">
                  Processing files with AI analysis...
                </p>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-700 text-center">
                  All files uploaded successfully!
                </p>
              </div>
            )}

            {uploadStatus === "error" && error && (
              <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-200">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            {uploadStatus === "uploading" && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
              >
                Cancel Upload
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-300"
            >
              {uploadStatus === "success" ? "Done" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;
