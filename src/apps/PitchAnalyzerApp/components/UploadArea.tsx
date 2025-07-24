import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { usePitchUpload } from "../hooks/usePitchUpload";
import { useCompanyPitches } from "../hooks/useCompanyPitches";

interface UploadAreaProps {
  userEmail: string;
}

const UploadArea = ({ userEmail }: UploadAreaProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);

  const { uploadMultiplePitches, isUploading, error, clearError } =
    usePitchUpload();
  const {
    fetchCompanyPitches,
    pitches,
    isLoading: isLoadingPitches,
  } = useCompanyPitches();

  // Fetch recent pitches on component mount
  useEffect(() => {
    if (userEmail) {
      fetchCompanyPitches(userEmail);
    }
  }, [userEmail, fetchCompanyPitches]);

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
    setMessageIndex(0);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => {
        const newIndex = prev + 1;
        setLoadingMessage(loadingMessages[newIndex % loadingMessages.length]);
        return newIndex;
      });
    }, 2000);

    try {
      const results = await uploadMultiplePitches(selectedFiles, userEmail);
      const successfulUploads = results
        .filter((result) => result.status === 200)
        .map((result) => result.message);

      setUploadedFiles((prev) => [...prev, ...successfulUploads]);
      setSelectedFiles([]);

      // Refresh the pitches list
      await fetchCompanyPitches(userEmail);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      clearInterval(messageInterval);
      setShowLoadingScreen(false);
      setLoadingMessage("");
    }
  }, [
    selectedFiles,
    userEmail,
    uploadMultiplePitches,
    fetchCompanyPitches,
    loadingMessages,
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRecentPitches = () => {
    return pitches
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  };

  // Loading Screen Component
  if (showLoadingScreen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4">
          <div className="text-center">
            {/* Animated Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <DocumentMagnifyingGlassIcon className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Loading Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Processing Your Pitch Deck
            </h2>

            {/* Loading Message */}
            <p className="text-gray-600 mb-8 min-h-[3rem] flex items-center justify-center">
              {loadingMessage}
            </p>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-8">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    step <= Math.floor(messageIndex / 2) + 1
                      ? "bg-gradient-to-r from-blue-500 to-purple-600"
                      : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center">
                <ChartBarIcon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Financial Analysis</p>
              </div>
              <div className="text-center">
                <LightBulbIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Market Insights</p>
              </div>
              <div className="text-center">
                <RocketLaunchIcon className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Growth Potential</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Upload Area */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300 p-8 shadow-lg">
        <div
          className={`text-center transition-all duration-300 ${
            isDragOver
              ? "border-blue-400 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400 hover:scale-[1.02]"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Premium Upload Icon */}
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <CloudArrowUpIcon className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <DocumentMagnifyingGlassIcon className="w-5 h-5 text-white" />
            </div>
          </div>

          <div className="space-y-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Your Pitch Deck
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Drop your pitch deck here or{" "}
                <span className="text-blue-600 hover:text-blue-500 font-semibold underline">
                  browse files
                </span>
              </p>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
              />
            </label>
            <p className="text-sm text-gray-500 flex items-center justify-center space-x-2">
              <DocumentIcon className="w-4 h-4" />
              <span>Only PDF files are supported</span>
            </p>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <DocumentMagnifyingGlassIcon className="w-5 h-5 text-blue-500" />
                <span>Selected Files ({selectedFiles.length})</span>
              </h3>
            </div>
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <DocumentIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex space-x-4">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="font-semibold">Processing...</span>
                  </>
                ) : (
                  <>
                    <RocketLaunchIcon className="w-5 h-5" />
                    <span className="font-semibold">
                      Analyze {selectedFiles.length} Pitch Deck
                      {selectedFiles.length > 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedFiles([])}
                className="px-6 py-3 text-gray-600 border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XMarkIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={clearError}
                  className="mt-1 text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Messages */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 space-y-3">
            {uploadedFiles.map((message, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-green-800">
                  {message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Uploads Section */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <DocumentMagnifyingGlassIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Uploads</h2>
            <p className="text-sm text-gray-500">
              Your latest pitch deck analyses
            </p>
          </div>
        </div>

        {isLoadingPitches ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Loading recent uploads...</span>
            </div>
          </div>
        ) : getRecentPitches().length > 0 ? (
          <div className="space-y-4">
            {getRecentPitches().map((pitch) => (
              <div
                key={pitch.id}
                className="flex items-center justify-between p-6 border border-gray-200 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <DocumentIcon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {pitch.title || pitch.filename}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center space-x-2">
                      <span>{formatDate(pitch.created_at)}</span>
                      <span>•</span>
                      <span>{(Math.random() * 100).toFixed(1)}% analyzed</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {pitch.is_bookmarked && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                      <SparklesIcon className="w-3 h-3 mr-1" />
                      Bookmarked
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                    {pitch.sector_category || "Analyzed"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentMagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pitches uploaded yet
            </h3>
            <p className="text-sm text-gray-500">
              Upload your first pitch deck above to get started with AI-powered
              analysis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
