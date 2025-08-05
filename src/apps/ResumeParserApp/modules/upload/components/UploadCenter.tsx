import React, { useState, useCallback, useEffect } from "react";
import FileUploadZone from "./FileUploadZone";
import GroupSelector from "./GroupSelector";
import UploadProgressModal from "./UploadProgressModal";
import { useResumeUpload } from "../hooks/useResumeUpload";
import type { Group } from "../../../types/api";
import {
  DocumentTextIcon,
  DocumentIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
  CloudArrowUpIcon,
  DocumentPlusIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const UploadCenter: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
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

  // Auto-close modal when upload is successful
  useEffect(() => {
    if (uploadStatus === "success" && showUploadModal) {
      // Add a small delay to show the success message before closing
      const timer = setTimeout(() => {
        setShowUploadModal(false);
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
    }
  }, [uploadStatus, showUploadModal]);

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

    setShowUploadModal(true);
    await uploadFiles(selectedGroup.id.toString());
  }, [selectedGroup, selectedFiles.length, uploadFiles]);

  const handleCloseUploadModal = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleCancelUpload = useCallback(() => {
    cancelUpload();
    setShowUploadModal(false);
  }, [cancelUpload]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
      <div className="h-full flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          {/* Two-Column Layout with Improved Spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            {/* Left Column - Group Selection & Guidelines & Uploaded Files */}
            <div className="flex flex-col h-full">
              {/* Select Group Section - Compact & Elegant */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 p-5 mb-4 flex-shrink-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <DocumentPlusIcon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Groups
                    </h2>
                  </div>
                </div>
                <GroupSelector
                  onGroupSelect={handleGroupSelect}
                  selectedGroup={selectedGroup}
                />
              </div>

              {/* Warning Message - Compact Design */}
              {!selectedGroup && (
                <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/60 rounded-xl flex-shrink-0">
                  <div className="flex items-start space-x-2.5">
                    <div className="w-5 h-5 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ExclamationTriangleIcon className="w-3 h-3 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-orange-800 leading-relaxed">
                        Please select a group to organize and upload your CVs.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content Area - Takes remaining height */}
              <div className="flex-1 flex flex-col min-h-0">
                {/* Upload Guidelines - Premium Design */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 p-5 mb-4 flex-shrink-0">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Upload Guidelines
                      </h3>
                    </div>
                  </div>

                  {/* Guidelines Grid - Better Alignment */}
                  <div className="space-y-3">
                    {/* Supported Formats */}
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DocumentTextIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Supported formats
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200/50">
                          PDF
                        </span>
                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200/50">
                          DOCX
                        </span>
                      </div>
                    </div>

                    {/* Total Size Limit */}
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DocumentIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Total size limit
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200/50">
                        200MB total
                      </span>
                    </div>

                    {/* File Limit */}
                    <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <InformationCircleIcon className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          File limit
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-lg border border-blue-200/50">
                        100 files max
                      </span>
                    </div>
                  </div>
                </div>

                {/* Upload Progress - Show in left column when modal is closed */}
                {!showUploadModal && isUploading && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 p-5 mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        <CloudArrowUpIcon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Uploading Files...
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Processing {selectedFiles.length} files with
                          AI-powered analysis
                        </p>
                      </div>
                    </div>

                    {/* Overall Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Overall Progress
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {Math.round(uploadProgress.overall || 0)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                          style={{
                            width: `${uploadProgress.overall || 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* File List - Compact */}
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {selectedFiles.map((file, index) => {
                        const overallProgress = uploadProgress.overall || 0;
                        const isCompleted = overallProgress >= 100;

                        return (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg border border-gray-100"
                          >
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-5 h-5 bg-green-100 rounded-lg flex items-center justify-center">
                                  <CheckCircleIcon className="w-3 h-3 text-green-600" />
                                </div>
                              ) : (
                                <div className="w-5 h-5 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <CloudArrowUpIcon className="w-3 h-3 text-blue-600" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">
                                {file.name}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              {isCompleted ? (
                                <span className="text-xs font-medium text-green-600">
                                  Done
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
                  </div>
                )}

                {/* Uploaded Files Section - Takes remaining space */}
                {!showUploadModal && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/60 p-5 flex-1 flex flex-col min-h-0">
                    <div className="flex items-center justify-between mb-4 flex-shrink-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                          <ClockIcon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Recently Uploaded
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {uploadedFiles.length > 0
                              ? `${uploadedFiles.length} files processed successfully`
                              : "No recent uploads"}
                          </p>
                        </div>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <button
                          onClick={clearUploadedFiles}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Uploaded Files List or No Uploads State */}
                    <div className="flex-1 flex flex-col min-h-0">
                      {uploadedFiles.length > 0 ? (
                        <div className="space-y-2 overflow-y-auto flex-1">
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
                                  {formatFileSize(file.size)} •{" "}
                                  {file.uploadedAt.toLocaleTimeString()}
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
                      ) : (
                        <div className="flex flex-col items-center justify-center flex-1">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <ClockIcon className="w-8 h-8 text-gray-400" />
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            No Recent Uploads
                          </h4>
                          {/* <p className="text-xs text-gray-500 text-center max-w-xs">
                            Upload your first CV to see it appear here. All
                            successfully uploaded files will be listed in this
                            section.
                          </p> */}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  onRemoveFile={removeFile}
                  onClearAll={clearFiles}
                  uploadStatus={uploadStatus}
                  disabled={!selectedGroup || isUploading}
                  onUpload={handleUpload}
                  selectedGroup={selectedGroup}
                  isUploading={isUploading}
                />
              </div>

              {/* Enhanced Upload Progress - Only show when uploading */}
              {isUploading && (
                <UploadProgressModal
                  isOpen={showUploadModal}
                  onClose={handleCloseUploadModal}
                  onCancel={handleCancelUpload}
                  selectedFiles={selectedFiles}
                  uploadProgress={uploadProgress}
                  uploadStatus={uploadStatus}
                  error={null}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCenter;
