import React, { useRef, useCallback } from "react";
import type { UploadJDProps } from "../types";

/**
 * UploadJD Component
 *
 * Job description upload interface with drag-and-drop functionality.
 *
 * Features:
 * - Drag and drop file upload
 * - File type validation (PDF, DOC, DOCX, TXT)
 * - File size validation (max 10MB)
 * - Group selection
 * - Visual feedback for file selection
 * - Error handling and validation messages
 * - Modern design with upload animations
 */
const UploadJD: React.FC<UploadJDProps> = ({
  selectedFile,
  setSelectedFile,
  selectedGroup,
  setSelectedGroup,
  onUpload,
  isUploading,
  groups,
  error,
  setError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file type and size
  const validateAndSetFile = useCallback(
    (file: File) => {
      setError(null);

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, DOCX, or TXT file");
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("File size must be less than 10MB");
        return;
      }

      setSelectedFile(file);
    },
    [setSelectedFile, setError]
  );

  // Handle file selection via input
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  // Handle drag and drop
  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files?.[0];
      if (file) {
        validateAndSetFile(file);
      }
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    []
  );

  // Format file size for display
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Get file type icon
  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.includes("pdf")) {
      return (
        <svg
          className="w-8 h-8 text-red-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
    if (fileType.includes("word") || fileType.includes("document")) {
      return (
        <svg
          className="w-8 h-8 text-blue-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      );
    }
    return (
      <svg
        className="w-8 h-8 text-gray-500"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
      </svg>
    );
  }, []);

  const isUploadDisabled = !selectedFile || isUploading;

  return (
    <div className="w-full space-y-6">
      {/* Group Selection */}
      <div className="flex justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 inline-flex">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={isUploading}
            className="bg-transparent border-none outline-none px-4 py-2 text-white font-medium min-w-[160px] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="" className="text-gray-900">
              All Groups
            </option>
            {groups.map((group) => (
              <option
                key={group.id}
                value={group.name}
                className="text-gray-900"
              >
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/30 rounded-xl p-8 text-center hover:border-white/50 transition-all duration-200 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />

        {selectedFile ? (
          /* Selected File Display */
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              {getFileIcon(selectedFile.type)}
            </div>
            <div>
              <p className="text-white font-medium">{selectedFile.name}</p>
              <p className="text-purple-100 text-sm">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setError(null);
              }}
              disabled={isUploading}
              className="text-purple-200 hover:text-white text-sm underline disabled:cursor-not-allowed"
            >
              Remove file
            </button>
          </div>
        ) : (
          /* Upload Prompt */
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg
                className="w-12 h-12 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-white font-medium mb-2">
                Drop your job description here
              </p>
              <p className="text-purple-100 text-sm">
                or click to browse files
              </p>
            </div>
            <div className="text-purple-200 text-xs">
              Supports PDF, DOC, DOCX, TXT (max 10MB)
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-center">
          <p className="text-red-100 text-sm">{error}</p>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex justify-center">
        <button
          onClick={onUpload}
          disabled={isUploadDisabled}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
            isUploadDisabled
              ? "bg-white/20 text-white/50 cursor-not-allowed"
              : "bg-white text-purple-600 hover:bg-white/90 hover:-translate-y-0.5 shadow-lg"
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-purple-600/30 border-t-purple-600 rounded-full animate-spin"></div>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              Analyze & Search
            </>
          )}
        </button>
      </div>

      {/* Upload Tips */}
      <div className="text-center">
        <p className="text-purple-100 text-sm">
          💡 Upload a detailed job description for better candidate matching
        </p>
      </div>
    </div>
  );
};

export default UploadJD;
