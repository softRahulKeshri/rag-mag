import React, { useCallback, useRef } from "react";
import type { UploadedFile } from "../types";
import {
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
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
  // New props for upload functionality
  onUpload?: () => void;
  selectedGroup?: { id: number; name: string } | null;
  isUploading?: boolean;
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
  onUpload,
  selectedGroup,
  isUploading = false,
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
    <div className="h-full flex flex-col">
      {/* Drag & Drop Zone - Fixed height */}
      <div className="flex-shrink-0 mb-6">
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            disabled
              ? "border-gray-300 bg-gray-50 cursor-not-allowed"
              : "border-blue-300 scale-105 bg-gradient-to-br from-gray-50 to-white hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 cursor-pointer transform hover:scale-105"
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
          <div className="mx-auto w-20 h-20 mb-6">
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Drag & Drop CVs Here
          </h3>
          <p className="text-sm text-gray-600 mb-3">or click to browse files</p>
         
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
        {/* Selected Files - Enhanced with Scroll for 10+ files */}
        {selectedFiles.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h4>
                  <p className="text-xs text-gray-500">Ready for upload</p>
                </div>
              </div>
              <button
                onClick={onClearAll}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Scrollable container for files */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DocumentTextIcon className="w-4 h-4 text-blue-600" />
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
                        <div className="mt-1">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-1 rounded-full transition-all duration-300"
                              style={{
                                width: `${getFileProgress(file.name)}%`,
                              }}
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
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button - Always visible, conditionally enabled */}
        {onUpload && (
          <div
            className={`${
              selectedFiles.length > 0
                ? "mt-2 pt-4"
                : "mt-4"
            }`}
          >
            <div className="text-center">
              <button
                onClick={onUpload}
                disabled={
                  !selectedGroup || selectedFiles.length === 0 || isUploading
                }
                className={`inline-flex items-center px-8 py-3 border-2 border-transparent text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 ${
                  selectedGroup && selectedFiles.length > 0 && !isUploading
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500/30 transform hover:-translate-y-1 hover:shadow-2xl border-blue-500/20"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                }`}
              >
                <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                {isUploading
                  ? `Uploading ${selectedFiles.length} Files...`
                  : selectedGroup && selectedFiles.length > 0
                  ? `Upload ${selectedFiles.length} CVs`
                  : "Upload CVs"}
              </button>

             
            </div>
          </div>
        )}

        {/* Uploaded Files - Enhanced */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircleIcon className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    Uploaded Files ({uploadedFiles.length})
                  </h4>
                  <p className="text-xs text-gray-500">
                    Successfully processed and analyzed
                  </p>
                </div>
              </div>
              <button
                onClick={onClearUploaded}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>

            {/* Scrollable container for uploaded files */}
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center space-x-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircleIcon className="w-4 h-4 text-green-600" />
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
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="animate-spin w-5 h-5 text-blue-600"
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
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Uploading Files...
                </h4>
                <p className="text-xs text-blue-700">
                  Processing {selectedFiles.length} files with AI-powered
                  analysis
                </p>
              </div>
            </div>
          </div>
        )}

        {uploadStatus === "error" && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
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
                <h4 className="text-sm font-semibold text-red-900 mb-1">
                  Upload Failed
                </h4>
                <p className="text-xs text-red-700">
                  There was an error uploading your files. Please try again.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadZone;
