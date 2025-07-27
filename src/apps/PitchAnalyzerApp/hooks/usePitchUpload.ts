import { useState, useCallback } from "react";
import { pitchApi } from "../../../lib/axios";

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

  const uploadPitch = useCallback(async (file: File) => {
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
          throw new Error(fileResult.detail || "Upload failed");
        }

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
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";
      setError(errorMessage);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

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
          return result.results.map((fileResult: AnalyzePitchResult) => {
            if (fileResult.status === "error") {
              return {
                data: null,
                message: `Failed to upload ${fileResult.filename}: ${fileResult.detail}`,
                status: 500,
                filename: fileResult.filename,
              };
            }

            return {
              data: fileResult,
              message: `Successfully queued ${fileResult.filename} for analysis`,
              status: 200,
              pitch_id: fileResult.pitch_id,
              filename: fileResult.filename,
            };
          });
        }

        return [];
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setError(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    []
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
