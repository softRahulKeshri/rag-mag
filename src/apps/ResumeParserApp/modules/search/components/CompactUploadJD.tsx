import React, { useRef, useCallback } from "react";
import type { UploadJDProps } from "../types";

/**
 * CompactUploadJD Component
 *
 * Premium job description upload interface with sophisticated design and brand colors.
 */
const CompactUploadJD: React.FC<UploadJDProps> = ({
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

  // Get file type icon with brand colors
  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.includes("pdf")) {
      return (
        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      );
    }
    if (fileType.includes("word") || fileType.includes("document")) {
      return (
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-12 h-12 bg-gradient-to-r from-neutral-n500 to-neutral-n600 rounded-xl flex items-center justify-center shadow-lg">
        <svg
          className="w-6 h-6 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
      </div>
    );
  }, []);

  const isUploadDisabled = !selectedFile || isUploading;

  return (
    <div className="space-y-6">
      {/* Group Selection */}
      <div className="relative">
        <label className="block text-sm font-semibold text-neutral-n1000 mb-3">
          <span className="bg-gradient-to-r from-brand-gradient-orange to-brand-gradient-purple bg-clip-text text-transparent">
            Filter by Group
          </span>
        </label>
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            disabled={isUploading}
            className="w-full bg-white border-2 border-[#E5E7EB] rounded-xl px-4 py-3 text-[#1F2937] font-medium focus:outline-none focus:border-[#3B82F6] focus:ring-3 focus:ring-[#3B82F6]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#F9FAFB] transition-all duration-200 hover:border-[#9CA3AF] shadow-sm appearance-none"
          >
            <option value="" className="text-[#6B7280]">
              All Groups
            </option>
            {groups.map((group) => (
              <option
                key={group.id}
                value={group.name}
                className="text-[#1F2937]"
              >
                {group.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg
              className="w-5 h-5 text-[#6B7280]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* File Upload Area */}
      <div className="relative">
        <label className="block text-sm font-semibold text-neutral-n1000 mb-3">
          <span className="bg-gradient-to-r from-brand-gradient-purple to-brand-gradient-blue bg-clip-text text-transparent">
            Upload Job Description
          </span>
        </label>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative border-3 border-dashed border-[#D1D5DB] rounded-xl p-8 text-center hover:border-[#3B82F6] hover:bg-[#F8FAFC] hover:shadow-md transition-all duration-200 cursor-pointer bg-white shadow-sm"
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
              <div className="space-y-2">
                <p className="text-neutral-n1000 font-semibold text-lg">
                  {selectedFile.name}
                </p>
                <p className="text-neutral-n700 text-sm">
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
                className="text-sm text-red-600 hover:text-red-800 underline disabled:cursor-not-allowed font-medium transition-colors"
              >
                Remove file
              </button>
            </div>
          ) : (
            /* Upload Prompt */
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-gradient-blue to-brand-gradient-cyan rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-[#1F2937] font-bold text-xl">
                  Drop your job description here
                </p>
                <p className="text-[#6B7280] text-base font-medium">
                  or click to browse files
                </p>
              </div>
              <div className="text-[#9CA3AF] text-sm font-medium mt-4 bg-[#F9FAFB] px-3 py-2 rounded-lg inline-block">
                📄 Supports PDF, DOC, DOCX, TXT (max 10MB)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Upload JD Button - NEW GRADIENT DESIGN */}
      <div className="mt-6">
        <button
          onClick={onUpload}
          disabled={isUploadDisabled}
          className={`w-full px-6 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-base ${
            isUploadDisabled
              ? "bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed border-2 border-[#E5E7EB]"
              : "bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:from-[#059669] hover:to-[#047857] hover:shadow-lg hover:shadow-[#10B981]/30 active:scale-98 transform border-2 border-transparent"
          }`}
        >
          {isUploading ? (
            <>
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Analyzing Job Description...</span>
            </>
          ) : (
            <>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
              </svg>
              <span>Analyze & Find Candidates</span>
            </>
          )}
        </button>
      </div>

     
    </div>
  );
};

export default CompactUploadJD;
