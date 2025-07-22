import React, { useState } from "react";
import { useResumeStore } from "../store/resumeStore";
import { useResumeUpload } from "../hooks/useResumeUpload";
import GroupSelector from "./GroupSelector";
import FileUploadZone from "./FileUploadZone";
import type { Group } from "../types";

const UploadCenter: React.FC = () => {
  const { selectedGroup, selectGroup } = useResumeStore();
  const {
    uploadFiles,
    isUploading,
    selectedFiles,
    uploadedFiles,
    uploadStatus,
    handleFileSelect,
    handleFileDrop,
    removeFile,
    clearFiles,
    clearUploadedFiles,
  } = useResumeUpload();

  const [isUploadingState, setIsUploadingState] = useState(false);

  const handleGroupSelect = (group: Group) => {
    selectGroup(group);
  };

  const handleUpload = async () => {
    if (!selectedGroup) {
      alert("Please select a group first");
      return;
    }

    setIsUploadingState(true);
    try {
      await uploadFiles(selectedGroup.id);
      console.log("Upload completed successfully");
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            {/* Logo */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-0 w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg transform rotate-45 scale-75"></div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Upload Center
              </h1>
              <p className="text-lg text-gray-600">
                AI-Powered Talent Discovery Platform
              </p>
            </div>
          </div>

          {/* Decorative Line */}
          <div className="flex space-x-1">
            <div className="h-1 bg-blue-500 rounded-full flex-1"></div>
            <div className="h-1 bg-purple-500 rounded-full flex-1"></div>
            <div className="h-1 bg-pink-500 rounded-full flex-1"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Select Group Section */}
          <GroupSelector
            onGroupSelect={handleGroupSelect}
            selectedGroup={selectedGroup}
          />

          {/* File Upload Section */}
          <FileUploadZone
            onFileSelect={handleFileSelect}
            onFileDrop={handleFileDrop}
            selectedFiles={selectedFiles}
            uploadedFiles={uploadedFiles}
            onRemoveFile={removeFile}
            onClearAll={clearFiles}
            onClearUploaded={clearUploadedFiles}
            onUpload={handleUpload}
            isUploading={isUploading || isUploadingState}
            uploadStatus={uploadStatus}
            disabled={!selectedGroup}
          />

          {/* Upload Status */}
          {(isUploading || isUploadingState) && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-800">
                  Uploading resumes...
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
