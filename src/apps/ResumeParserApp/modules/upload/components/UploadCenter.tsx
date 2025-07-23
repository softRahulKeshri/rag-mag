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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src="/magure_ai_logo.svg"
              alt="Magure AI Logo"
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Upload Center
              </h1>
              <p className="text-gray-600">
                AI-Powered Talent Discovery Platform
              </p>
            </div>
          </div>
        </div>

        {/* Select Group Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Select Group
          </h2>
          <p className="text-gray-600 mb-4">
            Select your target group for CV uploads.
          </p>
          <GroupSelector
            onGroupSelect={handleGroupSelect}
            selectedGroup={selectedGroup}
          />
        </div>

        {/* Warning Message */}
        {!selectedGroup && (
          <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-orange-500"
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
              <span className="text-sm font-medium text-orange-800">
                Please select a group to organize and upload your CVs.
              </span>
            </div>
          </div>
        )}

        {/* File Upload Zone */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <FileUploadZone
            onFileSelect={handleFileSelect}
            onFileDrop={handleFileDrop}
            selectedFiles={selectedFiles}
            uploadedFiles={uploadedFiles}
            onRemoveFile={removeFile}
            onClearAll={clearFiles}
            onClearUploaded={clearUploadedFiles}
            uploadStatus={uploadStatus}
            disabled={!selectedGroup || isUploading}
          />
        </div>

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={handleUpload}
            disabled={
              !selectedGroup || selectedFiles.length === 0 || isUploading
            }
            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
              selectedGroup && selectedFiles.length > 0 && !isUploading
                ? "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
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
            {isUploading ? "Uploading..." : "Upload CVs"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
