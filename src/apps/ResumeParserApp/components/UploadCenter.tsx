import React, { useState } from "react";
import { useResumeStore } from "../store/resumeStore";
import { useResumeUpload } from "../hooks/useResumeUpload";
import GroupSelector from "./GroupSelector";
import FileUploadZone from "./FileUploadZone";
import type { Group } from "../types";

const UploadCenter: React.FC = () => {
  const { selectedGroup, selectGroup } = useResumeStore();
  const { uploadFiles, isUploading } = useResumeUpload();
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
      // Show success message or redirect
      console.log("Upload completed successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      // Show error message
    } finally {
      setIsUploadingState(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {/* Geometric Logo */}
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg transform rotate-45"></div>
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg transform rotate-45 scale-75"></div>
              <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-pink-500 to-blue-500 rounded-lg transform rotate-45 scale-50"></div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
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

        {/* Content */}
        <div className="space-y-6">
          {/* Group Selector */}
          <GroupSelector
            onGroupSelect={handleGroupSelect}
            selectedGroup={selectedGroup}
          />

          {/* File Upload Zone */}
          <FileUploadZone
            onUpload={handleUpload}
            disabled={!selectedGroup || isUploading || isUploadingState}
          />
        </div>

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
  );
};

export default UploadCenter;
