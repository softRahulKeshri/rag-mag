import { useState, useCallback, useEffect, useMemo } from "react";
import {
  CloudArrowUpIcon,
  XMarkIcon,
  DocumentIcon,
  DocumentMagnifyingGlassIcon,
  SparklesIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { usePitchUpload } from "../hooks/usePitchUpload";
import { useCompanyPitches } from "../hooks/useCompanyPitches";

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
      setLoadingMessage("");
      setMessageIndex(0);
    }
  }, [
    selectedFiles,
    userEmail,
    uploadMultiplePitches,
    loadingMessages,
    fetchCompanyPitches,
  ]);

  // Rotate loading messages
  useEffect(() => {
    if (showLoadingScreen) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showLoadingScreen, loadingMessages, messageIndex]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRecentPitches = () => {
    return pitches.slice(0, 3);
  };

  if (showLoadingScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] to-[#EAEAEC] flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-[#BFD6FF]/50 p-12 max-w-md w-full mx-4">
          <div className="text-center">
            {/* Animated Icon */}
            <div className="relative mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-[#3077F3] to-[#1E50A8] rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                <SparklesIcon className="w-10 h-10 text-white animate-pulse" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#10B981] rounded-full animate-ping border-2 border-white"></div>
            </div>

            {/* Loading Text */}
            <h2 className="text-2xl font-bold text-[#2E3141] mb-4">
              Analyzing Pitch Deck
            </h2>
            <p className="text-[#6D6F7A] mb-8 leading-relaxed">
              {loadingMessage}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#D5D6D9] rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-[#3077F3] to-[#1E50A8] h-2 rounded-full animate-pulse"
                style={{ width: "60%" }}
              ></div>
            </div>

            {/* Status Indicators */}
            <div className="flex justify-center space-x-2">
              {loadingMessages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index <= messageIndex ? "bg-[#3077F3]" : "bg-[#C0C1C6]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
     

      {/* Upload Area */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#D5D6D9]/50 p-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-8 h-8 bg-[#EFF5FF] rounded-lg flex items-center justify-center flex-shrink-0">
            <CloudArrowUpIcon className="w-5 h-5 text-[#3077F3]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#2E3141] mb-1">
              Upload Pitch Deck
            </h2>
            <p className="text-[#6D6F7A]">
              Drag and drop your PDF pitch deck or click to browse files
            </p>
          </div>
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            isDragOver
              ? "border-[#3077F3] bg-[#EFF5FF]/50"
              : "border-[#C0C1C6] hover:border-[#94BAFD] hover:bg-[#F5F5F5]/50"
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
            <div className="w-16 h-16 bg-gradient-to-br from-[#EFF5FF] to-[#E3EDFF] rounded-2xl flex items-center justify-center mx-auto">
              <CloudArrowUpIcon className="w-8 h-8 text-[#3077F3]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#2E3141] mb-2">
                Drop your pitch deck here
              </h3>
              <p className="text-[#6D6F7A] mb-4">
                Supports PDF files up to 50MB
              </p>
              <button className="inline-flex items-center px-4 py-2 bg-[#3077F3] text-white rounded-lg hover:bg-[#1E50A8] transition-colors duration-200">
                Browse Files
              </button>
            </div>
          </div>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#2E3141] mb-4">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-3">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl border border-[#D5D6D9]"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#FEF2F2] rounded-lg flex items-center justify-center">
                      <DocumentIcon className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#2E3141]">{file.name}</p>
                      <p className="text-sm text-[#6D6F7A]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 text-[#ABADB3] hover:text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#3077F3] to-[#1E50A8] text-white rounded-xl hover:from-[#1E50A8] hover:to-[#11397E] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Analyze Pitch Deck
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XMarkIcon className="h-5 w-5 text-[#F87171]" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#991B1B]">
                  Upload Error
                </h3>
                <p className="text-sm text-[#B91C1C] mt-1">{error}</p>
                <button
                  onClick={clearError}
                  className="mt-2 text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Pitches Section */}
      {getRecentPitches().length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-[#D5D6D9]/50 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-8 h-8 bg-[#ECFDF5] rounded-lg flex items-center justify-center flex-shrink-0">
              <DocumentMagnifyingGlassIcon className="w-5 h-5 text-[#10B981]" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#2E3141] mb-1">
                Recent Pitches
              </h2>
              <p className="text-[#6D6F7A]">
                Your recently uploaded pitch decks
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {getRecentPitches().map((pitch) => (
              <div
                key={pitch.id}
                className="group relative p-4 border border-[#D5D6D9] rounded-xl hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#3077F3] to-[#1E50A8] rounded-lg flex items-center justify-center shadow-lg">
                    <DocumentIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#2E3141]">
                      {pitch.title || pitch.filename}
                    </h3>
                    <p className="text-sm text-[#6D6F7A]">
                      Uploaded {formatDate(pitch.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#065F46]">
                      <CheckCircleIcon className="w-3 h-3 mr-1" />
                      Analyzed
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
