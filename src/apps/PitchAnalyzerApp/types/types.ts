/**
 * Simple Type Definitions for Pitch Upload
 */

// Upload response from the API
export interface UploadResponse {
  data: null;
  message: string;
  status: number;
}

// Hook return type
export interface UsePitchUploadReturn {
  uploadPitch: (file: File, userEmail: string) => Promise<UploadResponse>;
  uploadMultiplePitches: (
    files: File[],
    userEmail: string
  ) => Promise<UploadResponse[]>;
  isUploading: boolean;
  error: string | null;
  clearError: () => void;
}

export interface PitchTagsInfo {
  Ask?: string;
  EBIDTA?: string | null;
  FundingStage?: string;
  Market?: string;
  Problem?: string;
  Solution?: string;
  Technology?: string[];
}

export interface Pitch {
  created_at: string;
  description: string | null;
  file_url: string;
  filename: string;
  id: string;
  is_bookmarked: boolean;
  sector_category: string;
  tagsinfo: PitchTagsInfo;
  title: string | null;
}

export interface CompanyPitchesRequest {
  userEmail: string;
  filterBy: string[];
}

export interface CompanyPitchesResponse {
  data: Pitch[];
  message?: string;
  status?: number;
}
