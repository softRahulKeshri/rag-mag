import { getApiConfig, pitchApi } from "../../../lib/axios";

/**
 * Build API URL for pitch download operations
 * @param pitchId - The pitch ID
 * @returns The complete API URL for downloading the pitch
 */
export const buildPitchDownloadUrl = (pitchId: string): string => {
  const { FULL_URLS } = getApiConfig();
  return `${FULL_URLS.PITCH}/download/${pitchId}`;
};

/**
 * Download a pitch file by ID with JWT authentication
 * @param pitchId - The pitch ID
 * @param filename - The filename to save as
 */
export const downloadPitch = async (
  pitchId: string,
  filename: string
): Promise<void> => {
  try {
    console.log(
      `🔄 Starting download for "${filename}" with pitch ID: ${pitchId}`
    );

    console.log(`📥 Download URL: /download/${pitchId}`);

    // Log the request details
    console.log(`🔐 JWT Token for downloadPitch API call:`, {
      endpoint: `/download/${pitchId}`,
      method: "GET",
      pitchId,
      filename,
      timestamp: new Date().toISOString(),
    });

    // Use axios with JWT authentication
    const response = await pitchApi.get(`/download/${pitchId}`, {
      responseType: "blob",
    });

    // Get the file as a blob
    const blob = response.data;

    // Create a blob URL
    const blobUrl = window.URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.style.display = "none";

    // Append to body, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the blob URL
    window.URL.revokeObjectURL(blobUrl);

    console.log(`✅ Successfully downloaded "${filename}"`);
  } catch (error) {
    console.error(`❌ Error downloading "${filename}":`, error);

    // Handle specific error cases
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status: number } };

      if (axiosError.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (axiosError.response?.status === 404) {
        throw new Error("Pitch file not found.");
      } else if (axiosError.response?.status === 403) {
        throw new Error(
          "Access denied. You don't have permission to download this file."
        );
      }
    }

    throw error;
  }
};

/**
 * Open a pitch file in a new tab for viewing with JWT authentication
 * @param pitchId - The pitch ID
 */
export const viewPitch = async (pitchId: string): Promise<void> => {
  try {
    console.log(`🔄 Opening pitch for viewing with ID: ${pitchId}`);

    // Log the request details
    console.log(`🔐 JWT Token for viewPitch API call:`, {
      endpoint: `/download/${pitchId}`,
      method: "GET",
      pitchId,
      timestamp: new Date().toISOString(),
    });

    // Use axios with JWT authentication
    const response = await pitchApi.get(`/download/${pitchId}`, {
      responseType: "blob",
    });

    // Get the file as a blob
    const blob = response.data;

    // Create a blob URL for viewing
    const blobUrl = window.URL.createObjectURL(blob);

    // Open in new tab for viewing
    window.open(blobUrl, "_blank");

    // Clean up the blob URL after a delay to allow the tab to open
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
    }, 1000);

    console.log(`✅ Successfully opened pitch for viewing`);
  } catch (error) {
    console.error(`❌ Error opening pitch for viewing:`, error);

    // Handle specific error cases
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as { response?: { status: number } };

      if (axiosError.response?.status === 401) {
        throw new Error("Authentication failed. Please login again.");
      } else if (axiosError.response?.status === 404) {
        throw new Error("Pitch file not found.");
      } else if (axiosError.response?.status === 403) {
        throw new Error(
          "Access denied. You don't have permission to view this file."
        );
      }
    }

    throw error;
  }
};
