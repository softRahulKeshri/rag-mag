import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";
import { useToast } from "../../../components/ui/useToast";

// Types for the new API response
interface AnalyzePitchResult {
  filename: string;
  pitch_id?: string;
  status: "queued" | "error";
  detail?: string;
}

interface AnalyzePitchResponse {
  results: AnalyzePitchResult[];
}

export const usePitchUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const uploadPitch = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("files", file);

        const response = await pitchApi.post<AnalyzePitchResponse>(
          "/analyze-pitches",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Handle the new API response format
        const result = response.data;

        // The API returns { results: [{ filename, pitch_id, status }] }
        if (result.results && result.results.length > 0) {
          const fileResult = result.results[0];

          if (fileResult.status === "error") {
            const errorMsg = fileResult.detail || "Upload failed";
            setError(errorMsg);

            // Show user-friendly error toast for upload failure
            showToast(
              `Unable to upload ${file.name}. Please try again or contact support if the problem persists.`,
              "error",
              5000
            );

            throw new Error(errorMsg);
          }

          // Show success toast for upload success
          showToast(
            `Successfully uploaded ${file.name} for analysis`,
            "success",
            3000
          );

          return {
            data: fileResult,
            message: `Successfully queued ${fileResult.filename} for analysis`,
            status: 200,
            pitch_id: fileResult.pitch_id,
            filename: fileResult.filename,
          };
        }

        return result;
      } catch (error) {
        // Show user-friendly error messages instead of technical details
        let userFriendlyMessage =
          "Something went wrong while uploading the file";

        if (error instanceof Error) {
          if (error.message.includes("404")) {
            userFriendlyMessage =
              "Upload service not found. Please try again later";
          } else if (error.message.includes("500")) {
            userFriendlyMessage =
              "Upload service is temporarily unavailable. Please try again later";
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            userFriendlyMessage =
              "Unable to connect to the upload service. Please check your internet connection";
          } else if (error.message.includes("timeout")) {
            userFriendlyMessage = "Upload timed out. Please try again";
          } else if (error.message.includes("413")) {
            userFriendlyMessage =
              "File is too large. Please try a smaller file";
          }
        }

        setError(userFriendlyMessage);

        // Show user-friendly error toast for upload failure
        showToast(
          `Unable to upload ${file.name}. ${userFriendlyMessage}`,
          "error",
          5000
        );

        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [showToast]
  );

  const uploadMultiplePitches = useCallback(
    async (files: File[]) => {
      setIsUploading(true);
      setError(null);

      try {
        // Upload all files at once using FormData
        const formData = new FormData();

        files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await pitchApi.post<AnalyzePitchResponse>(
          "/analyze-pitches",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const result = response.data;

        // Transform the API response to match expected format
        if (result.results && Array.isArray(result.results)) {
          const results = result.results.map(
            (fileResult: AnalyzePitchResult) => {
              if (fileResult.status === "error") {
                return {
                  data: null,
                  message: `Failed to upload ${fileResult.filename}: ${fileResult.detail}`,
                  status: 400,
                };
              } else {
                return {
                  data: fileResult,
                  message: `Successfully queued ${fileResult.filename} for analysis`,
                  status: 200,
                  pitch_id: fileResult.pitch_id,
                  filename: fileResult.filename,
                };
              }
            }
          );

          // Count successes and failures
          const successes = results.filter((r) => r.status === 200).length;
          const failures = results.filter((r) => r.status === 400).length;

          // Show appropriate toast based on results
          if (successes > 0 && failures === 0) {
            showToast(
              `Successfully uploaded ${successes} pitch deck${
                successes > 1 ? "s" : ""
              } for analysis`,
              "success",
              3000
            );
          } else if (successes > 0 && failures > 0) {
            showToast(
              `Uploaded ${successes} pitch deck${
                successes > 1 ? "s" : ""
              } successfully, ${failures} failed`,
              "warning",
              4000
            );
          } else if (failures > 0) {
            showToast(
              `Unable to upload ${failures} pitch deck${
                failures > 1 ? "s" : ""
              }. Please try again or contact support if the problem persists.`,
              "error",
              5000
            );
          }

          return results;
        }

        return result;
      } catch (error) {
        // Show user-friendly error messages instead of technical details
        let userFriendlyMessage = "Something went wrong while uploading files";

        if (error instanceof Error) {
          if (error.message.includes("404")) {
            userFriendlyMessage =
              "Upload service not found. Please try again later";
          } else if (error.message.includes("500")) {
            userFriendlyMessage =
              "Upload service is temporarily unavailable. Please try again later";
          } else if (
            error.message.includes("network") ||
            error.message.includes("fetch")
          ) {
            userFriendlyMessage =
              "Unable to connect to the upload service. Please check your internet connection";
          } else if (error.message.includes("timeout")) {
            userFriendlyMessage = "Upload timed out. Please try again";
          } else if (error.message.includes("413")) {
            userFriendlyMessage =
              "One or more files are too large. Please try smaller files";
          }
        }

        setError(userFriendlyMessage);

        // Show user-friendly error toast for upload failure
        showToast(
          `Unable to upload pitch decks. ${userFriendlyMessage}`,
          "error",
          5000
        );

        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [showToast]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    uploadPitch,
    uploadMultiplePitches,
    isUploading,
    error,
    clearError,
  };
};
