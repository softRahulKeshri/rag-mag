import React, { useCallback, useState, useMemo } from "react";
import {
  ArrowUpTrayIcon,
  XMarkIcon,
  ArrowRightIcon,
  PlusIcon,
  DocumentTextIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import type { IUploadState } from "../types";

interface IFileUploadSectionProps {
  uploadState: IUploadState;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onAnalyze: () => void;
}


const FileUploadSection = ({
  uploadState,
  onFileSelect,
  onFileRemove,
  onAnalyze,
}: IFileUploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);

  // Memoized file size for performance
  const fileSize = useMemo(() => {
    if (!uploadState.selectedFile) return null;
    return (uploadState.selectedFile.size / 1024 / 1024).toFixed(2);
  }, [uploadState.selectedFile]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type === "application/pdf") {
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleAnalyzeClick = useCallback(() => {
    if (!uploadState.isUploading) {
      onAnalyze();
    }
  }, [uploadState.isUploading, onAnalyze]);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Pitch Deck
        </h2>
        <p className="text-gray-600">
          Drag and drop your PDF file or click to browse
        </p>
      </div>

      {uploadState.selectedFile ? (
        <div className="space-y-6">
          {/* File Preview Card */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DocumentTextIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {uploadState.selectedFile.name}
                  </h3>
                  <p className="text-gray-600">{fileSize} MB • PDF Document</p>
                  <div className="flex items-center mt-2">
                    <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-green-600 font-medium">
                      File selected successfully
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onFileRemove}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Remove file"
                type="button"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Upload Progress */}
          {uploadState.isUploading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading file...</span>
                <span className="text-gray-900 font-medium">
                  {uploadState.uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadState.uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Analyze Button */}
          <button
            onClick={handleAnalyzeClick}
            disabled={uploadState.isUploading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 shadow-lg hover:shadow-xl"
            type="button"
            aria-label={
              uploadState.isUploading
                ? "Analyzing pitch deck..."
                : "Analyze pitch deck"
            }
          >
            {uploadState.isUploading ? (
              <>
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  role="status"
                  aria-label="Loading"
                />
                <span className="text-lg">Analyzing Pitch Deck...</span>
              </>
            ) : (
              <>
                <ArrowRightIcon className="w-5 h-5" />
                <span className="text-lg">Start Analysis</span>
              </>
            )}
          </button>

          {/* Analysis Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-900 mb-2">
              What happens next?
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                AI analyzes your pitch deck content and structure
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Generates insights on market positioning and competitive
                analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Provides strategic recommendations for improvement
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div
          className={`border-3 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? "border-blue-400 bg-blue-50/50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label="Upload area - drag and drop PDF files here or click to browse"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              const fileInput = document.createElement("input");
              fileInput.type = "file";
              fileInput.accept = ".pdf";
              fileInput.onchange = (event) => {
                const target = event.target as HTMLInputElement;
                if (target.files && target.files[0]) {
                  onFileSelect(target.files[0]);
                }
              };
              fileInput.click();
            }
          }}
        >
          <div className="space-y-6">
            {/* Upload Icon */}
            <div className="relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg">
                <ArrowUpTrayIcon className="w-10 h-10 text-white" />
              </div>
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-300 animate-ping opacity-20"></div>
              <div className="absolute inset-0 rounded-3xl border-2 border-blue-400 animate-pulse opacity-30"></div>
            </div>

            {/* Upload Text */}
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                {dragActive ? "Drop your file here" : "Upload your pitch deck"}
              </h3>
              <p className="text-gray-600">PDF files only • Maximum 10MB</p>
            </div>

            {/* Upload Button */}
            <label className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              <PlusIcon className="w-5 h-5 mr-3" />
              Choose PDF File
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                className="hidden"
                aria-label="Select PDF file"
              />
            </label>

            {/* Drag and Drop Hint */}
            <p className="text-sm text-gray-500">
              or drag and drop your file here
            </p>
          </div>
        </div>
      )}

      {/* File Requirements */}
      <div className="mt-8 bg-gray-50/80 rounded-2xl p-6">
        <h4 className="font-semibold text-gray-900 mb-3">File Requirements</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            PDF format only
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Maximum 10MB file size
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            Clear, readable text
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-4 h-4 text-green-500 mr-2" />
            English language preferred
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadSection;
