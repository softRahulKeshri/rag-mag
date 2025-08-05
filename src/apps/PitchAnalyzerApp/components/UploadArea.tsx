import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { usePitchUpload } from "../hooks/usePitchUpload";
import { useCompanyPitches } from "../hooks/useCompanyPitches";
import { Tooltip } from "../../../components/ui/Tooltip";

interface UploadAreaProps {
  userEmail: string;
}

const UploadArea = ({ userEmail }: UploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  const { uploadMultiplePitches, isUploading, error, clearError } =
    usePitchUpload();
  const { fetchCompanyPitches, pitches } = useCompanyPitches();

  // Fetch recent pitches on component mount
  useEffect(() => {
    fetchCompanyPitches();
  }, [fetchCompanyPitches]);

  const loadingMessages = useMemo(
    () => [
      "Analyzing your pitch deck structure...",
      "Extracting key financial metrics...",
      "Identifying market opportunities...",
      "Evaluating competitive landscape...",
      "Generating comprehensive insights...",
      "Preparing AI-powered recommendations...",
    ],
    []
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const validFiles = files.filter(
        (file) =>
          file.type === "application/pdf" ||
          file.name.toLowerCase().endsWith(".pdf")
      );

      if (validFiles.length > 0) {
        setSelectedFiles((prev) => [...prev, ...validFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleUpload = useCallback(async () => {
    if (selectedFiles.length === 0 || !userEmail) return;

    setShowLoadingScreen(true);
    setLoadingMessage(loadingMessages[0]);

    try {
      await uploadMultiplePitches(selectedFiles);
      setSelectedFiles([]);
      fetchCompanyPitches();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setShowLoadingScreen(false);
    }
  }, [
    selectedFiles,
    userEmail,
    uploadMultiplePitches,
    fetchCompanyPitches,
    loadingMessages,
  ]);

  // Loading screen animation
  useEffect(() => {
    if (showLoadingScreen) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => {
          const next = (prev + 1) % loadingMessages.length;
          setLoadingMessage(loadingMessages[next]);
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showLoadingScreen, loadingMessages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRecentPitches = () => {
    return pitches.slice(0, 6); // Show only the 6 most recent pitches
  };

  // Loading screen overlay
  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
              <DocumentMagnifyingGlassIcon className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full animate-ping border-2 border-white"></div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Analyzing Pitch Deck
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">{loadingMessage}</p>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>

          {/* Status Indicators */}
          <div className="flex justify-center space-x-2">
            {loadingMessages.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= messageIndex ? "bg-purple-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="flex-shrink-0 p-1 text-red-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Left Column - Upload Guidelines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
          <div className="h-full flex flex-col">
            {/* Upload Guidelines Header */}
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Upload Guidelines
              </h2>
            </div>

            {/* Guidelines List */}
            <div className="space-y-4 flex-1">
              {/* Supported Formats */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Supported formats
                  </span>
                </div>
                <div className="flex space-x-1">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                    PDF
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                    DOCX
                  </span>
                </div>
              </div>

              {/* Total Size Limit */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Total size limit
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                  200MB total
                </span>
              </div>

              {/* File Limit */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <InformationCircleIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    File limit
                  </span>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
                  100 files max
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Upload Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full">
          <div className="h-full flex flex-col">
            {/* Drag and Drop Area */}
            <div className="flex-1">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer h-full flex flex-col justify-center ${
                  isDragOver
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto">
                    <CloudArrowUpIcon className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drag and Drop Pitch Deck
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Drop your PDF file here or click to browse
                    </p>
                    <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 cursor-pointer">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Files Section */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded transition-colors duration-200"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <DocumentIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        <Tooltip content={file.name}>
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {file.name}
                          </p>
                        </Tooltip>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </span>
                        <button
                          onClick={() => removeFile(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200 cursor-pointer"
                        >
                          <XMarkIcon className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Button - Always visible, conditionally enabled */}
            <div className={`${selectedFiles.length > 0 ? "mt-4" : "mt-6"}`}>
              <div className="text-center">
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || isUploading}
                  className={`inline-flex items-center px-6 py-3 border-2 border-transparent text-sm font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 ${
                    selectedFiles.length > 0 && !isUploading
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500/30 transform hover:-translate-y-1 hover:shadow-2xl border-purple-500/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                  }`}
                >
                  <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                  {isUploading
                    ? `Uploading ${selectedFiles.length} Files...`
                    : selectedFiles.length > 0
                    ? `Upload ${selectedFiles.length} Pitch${
                        selectedFiles.length > 1 ? "es" : ""
                      }`
                    : "Upload Pitch Deck"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Pitches Section - Full Width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Companies
          </h2>
          <div className="flex items-center space-x-2">
            <DocumentMagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">
              {pitches.length} total companies
            </span>
          </div>
        </div>

        {getRecentPitches().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getRecentPitches().map((pitch) => (
              <div
                key={pitch.id}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DocumentMagnifyingGlassIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Tooltip
                      content={pitch.company || pitch.title || pitch.filename}
                    >
                      <h3 className="font-medium text-gray-900 truncate">
                        {pitch.company || pitch.title || pitch.filename}
                      </h3>
                    </Tooltip>
                    <p className="text-sm text-gray-600 mb-2">
                      {pitch.industry || pitch.sector_category}
                    </p>
                    <p className="text-xs text-gray-500">
                      Uploaded {formatDate(pitch.created_at)}
                    </p>
                  </div>
                  {pitch.is_bookmarked && (
                    <div className="flex-shrink-0">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentMagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No companies uploaded yet
            </h3>
            <p className="text-gray-600">
              Upload your first pitch deck to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
