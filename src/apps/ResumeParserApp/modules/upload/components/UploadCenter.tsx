import React, { useState, useCallback } from "react";
import FileUploadZone from "./FileUploadZone";
import GroupSelector from "./GroupSelector";
import { useResumeUpload } from "../hooks/useResumeUpload";
import type { Group } from "../../../types/api";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

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
  const overallProgress =
    Object.keys(uploadProgress).length > 0
      ? Object.values(uploadProgress).reduce(
          (sum, progress) => sum + progress,
          0
        ) / Object.keys(uploadProgress).length
      : 0;

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CloudArrowUpIcon className="w-10 h-10 text-white" />
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-2xl border-2 border-blue-300 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-2xl border border-purple-300 animate-pulse opacity-30"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Center
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            AI-Powered Talent Discovery Platform - Upload and organize your CVs
            with intelligent parsing and analysis
          </p>
        </div>

        {/* Select Group Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
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
          <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl">
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
                  This helps maintain a structured talent database for better
                  searchability.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* File Upload Zone */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-8">
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
          />
        </div>

        {/* Enhanced Upload Progress */}
        {isUploading && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
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
              <div className="text-sm font-medium text-blue-800">
                {Math.round(overallProgress)}%
              </div>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <p className="text-xs text-blue-600">
              Please wait while we process and analyze your files with AI...
            </p>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={
              !selectedGroup || selectedFiles.length === 0 || isUploading
            }
            className={`inline-flex items-center px-8 py-4 border border-transparent text-base font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
              selectedGroup && selectedFiles.length > 0 && !isUploading
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 transform hover:-translate-y-0.5 hover:shadow-xl"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <CloudArrowUpIcon className="w-6 h-6 mr-3" />
            {isUploading
              ? `Uploading ${selectedFiles.length} Files...`
              : `Upload ${selectedFiles.length || ""} CVs`.trim()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
