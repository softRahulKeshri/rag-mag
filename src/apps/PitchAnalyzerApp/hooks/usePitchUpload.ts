import { useState, useCallback } from "react";

export const usePitchUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPitch = useCallback(async (file: File, userEmail: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userEmail", userEmail);

      const response = await fetch(
        "https://api.magure.ai/api/v1/pitch/updated-analyse-pitch",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
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
    async (files: File[], userEmail: string) => {
      setIsUploading(true);
      setError(null);

      try {
        const results = [];

        for (const file of files) {
          try {
            const result = await uploadPitch(file, userEmail);
            results.push(result);
          } catch {
            results.push({
              data: null,
              message: `Failed to upload ${file.name}`,
              status: 500,
            });
          }
        }

        return results;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Upload failed";
        setError(errorMessage);
        throw error;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadPitch]
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
