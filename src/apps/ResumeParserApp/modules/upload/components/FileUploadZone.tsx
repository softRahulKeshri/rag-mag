import React, { useCallback, useRef } from "react";
import type { UploadedFile } from "../types";
import {
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface FileUploadZoneProps {
  onFileSelect: (files: FileList | File[]) => void;
  onFileDrop: (files: FileList) => void;
  selectedFiles: File[];
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileName: string) => void;
  onClearAll: () => void;
  onClearUploaded: () => void;
  uploadStatus: "idle" | "uploading" | "success" | "error";
  uploadProgress?: Record<string, number>;
  disabled?: boolean;
}

const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  onFileSelect,
  onFileDrop,
  selectedFiles,
  uploadedFiles,
  onRemoveFile,
  onClearAll,
  onClearUploaded,
  uploadStatus,
  uploadProgress = {},
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFileDrop(files);
      }
    },
    [onFileDrop, disabled]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;

      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files);
      }
    },
    [onFileSelect, disabled]
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileProgress = (fileName: string): number => {
    return uploadProgress[fileName] || 0;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Drag & Drop Zone */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${
          disabled
            ? "border-gray-300 bg-gray-50 cursor-not-allowed"
            : "border-gray-300 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 cursor-pointer transform hover:scale-105"
        }`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Enhanced Document Icon */}
        <div className="mx-auto w-24 h-24 mb-8">
          <div className="relative">
            <DocumentTextIcon
              className={`w-full h-full ${
                disabled ? "text-gray-400" : "text-gray-500"
              }`}
            />
            {!disabled && (
              <div className="absolute inset-0 rounded-full border-2 border-blue-300 opacity-0 animate-ping"></div>
            )}
          </div>
        </div>

        {/* Enhanced Text */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          Drag & Drop CVs Here
        </h3>
        <p className="text-base text-gray-600 mb-4">or click to browse files</p>
        <p className="text-sm text-gray-500">
          Supports PDF, DOC, DOCX • Max 10MB per file
        </p>
      </div>

      {/* Selected Files - Enhanced with Scroll for 10+ files */}
      {selectedFiles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Selected Files ({selectedFiles.length})
                </h4>
                <p className="text-sm text-gray-500">Ready for upload</p>
              </div>
            </div>
            <button
              onClick={onClearAll}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Scrollable container for 10+ files */}
          <div
            className={`space-y-3 ${
              selectedFiles.length > 10 ? "max-h-80 overflow-y-auto pr-2" : ""
            }`}
          >
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>

                    {/* Progress bar for uploading files */}
                    {uploadStatus === "uploading" && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${getFileProgress(file.name)}%` }}
                          />
                        </div>
                        <p className="text-xs text-blue-600 mt-1">
                          {Math.round(getFileProgress(file.name))}% uploaded
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveFile(file.name)}
                  disabled={uploadStatus === "uploading"}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {/* File count indicator for scrollable list */}
          {selectedFiles.length > 10 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                Showing all {selectedFiles.length} files • Scroll to see more
              </p>
            </div>
          )}
        </div>
      )}

      {/* Uploaded Files - Enhanced */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <p className="text-sm text-gray-500">
                  Successfully processed and analyzed
                </p>
              </div>
            </div>
            <button
              onClick={onClearUploaded}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Scrollable container for uploaded files */}
          <div
            className={`space-y-3 ${
              uploadedFiles.length > 10 ? "max-h-80 overflow-y-auto pr-2" : ""
            }`}
          >
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircleIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • Uploaded successfully
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Processed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Upload Status Messages */}
      {uploadStatus === "uploading" && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="animate-spin w-6 h-6 text-blue-600"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-blue-900 mb-1">
                Uploading Files...
              </h4>
              <p className="text-sm text-blue-700">
                Processing {selectedFiles.length} files with AI-powered analysis
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
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
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-red-900 mb-1">
                Upload Failed
              </h4>
              <p className="text-sm text-red-700">
                There was an error uploading your files. Please try again.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
