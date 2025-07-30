import { getApiConfig } from "../../../lib/axios";

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
 * Download a pitch file by ID
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

    const downloadUrl = buildPitchDownloadUrl(pitchId);
    console.log(`📥 Download URL: ${downloadUrl}`);

    // Fetch the file from the download endpoint
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the file as a blob
    const blob = await response.blob();

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
    throw error;
  }
};

/**
 * Open a pitch file in a new tab for viewing
 * @param pitchId - The pitch ID
 */
export const viewPitch = (pitchId: string): void => {
  try {
    const viewUrl = buildPitchDownloadUrl(pitchId);
    window.open(viewUrl, "_blank");
  } catch (error) {
    console.error(`❌ Error opening pitch for viewing:`, error);
    throw error;
  }
};
