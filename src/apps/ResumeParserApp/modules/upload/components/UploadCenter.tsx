import React, { useState, useCallback } from "react";
import FileUploadZone from "./FileUploadZone";
import GroupSelector from "./GroupSelector";
import { useResumeUpload } from "../hooks/useResumeUpload";
import type { Group } from "../../../types/api";

const UploadCenter: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const {
    isUploading,
    selectedFiles,
    uploadStatus,
    uploadedFiles,
    uploadProgress,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    clearUploadedFiles,
    uploadFiles,
    cancelUpload,
  } = useResumeUpload();

  const handleGroupSelect = useCallback((group: Group | null) => {
    setSelectedGroup(group);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedGroup) {
      alert("Please select a group before uploading files.");
      return;
    }

    if (selectedFiles.length === 0) {
      alert("Please select files to upload.");
      return;
    }

    await uploadFiles(selectedGroup.id.toString());
  }, [selectedGroup, selectedFiles.length, uploadFiles]);

  // Calculate overall upload progress
  const overallProgress = uploadProgress.overall || 0;

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <div className="h-full flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          {/* Two-Column Layout with Improved Spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column - Group Selection & Guidelines */}
            <div className="flex flex-col space-y-6">
              {/* Select Group Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      Select Group
                    </h2>
                    <p className="text-gray-600">
                      Choose your target group for CV uploads to keep your files
                      organized
                    </p>
                  </div>
                </div>
                <GroupSelector
                  onGroupSelect={handleGroupSelect}
                  selectedGroup={selectedGroup}
                />
              </div>

              {/* Warning Message */}
              {!selectedGroup && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-5 h-5 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-orange-800">
                        Please select a group to organize and upload your CVs.
                      </span>
                      <p className="text-xs text-orange-700 mt-1">
                        This helps maintain a structured talent database for
                        better searchability.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Guidelines */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upload Guidelines
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Supported Formats */}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Supported formats:
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        PDF
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        DOCX
                      </span>
                    </div>
                  </div>

                  {/* Total Size Limit */}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      Total size limit:
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      200MB total
                    </span>
                  </div>

                  {/* File Limit */}
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      File limit:
                    </span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      100 files max
                    </span>
                  </div>

                  {/* AI Processing Info */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-purple-900 mb-1">
                          AI-Powered Processing
                        </h4>
                        <p className="text-xs text-purple-700">
                          Your CVs will be automatically analyzed using advanced
                          AI to extract key information, skills, and experience
                          for better searchability.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Upload Area & Files */}
            <div className="flex flex-col h-full">
              {/* File Upload Zone - Fixed height container */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-6 h-full flex flex-col">
                <FileUploadZone
                  onFileSelect={handleFileSelect}
                  onFileDrop={handleFileDrop}
                  selectedFiles={selectedFiles}
                  uploadedFiles={uploadedFiles}
                  onRemoveFile={removeFile}
                  onClearAll={clearFiles}
                  onClearUploaded={clearUploadedFiles}
                  uploadStatus={uploadStatus}
                  uploadProgress={uploadProgress}
                  disabled={!selectedGroup || isUploading}
                  onUpload={handleUpload}
                  selectedGroup={selectedGroup}
                  isUploading={isUploading}
                />
              </div>

              {/* Enhanced Upload Progress - Only show when uploading */}
              {isUploading && (
                <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600 animate-spin"
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
                      <div>
                        <h3 className="text-sm font-semibold text-blue-900">
                          Uploading {selectedFiles.length} files...
                        </h3>
                        <p className="text-xs text-blue-700">
                          {Math.round(overallProgress)}% complete
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-medium text-blue-800">
                        {Math.round(overallProgress)}%
                      </div>
                      <button
                        onClick={cancelUpload}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-blue-600">
                    Please wait while we process and analyze your files with
                    AI...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
