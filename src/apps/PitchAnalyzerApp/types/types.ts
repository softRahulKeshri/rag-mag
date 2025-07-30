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
  show_only_bookmarked?: boolean;
}

export interface CompanyPitchesResponse {
  data: Pitch[];
  message?: string;
  status?: number;
}

export interface BookmarkPitchRequest {
  userEmail: string;
  pitchId: string;
  isBookmarked: boolean;
}

export interface BookmarkPitchResponse {
  data?: unknown;
  message?: string;
  status?: number;
}

// Pitch Details Types
export interface PitchDetailsRequest {
  userEmail: string;
}

export interface AnalysisSection {
  risk_flag: string;
  score: number;
  suggestions: string[];
  summary: string;
}

export interface ReferenceLink {
  reference_link: string;
  text: string;
  type: string;
}

export interface ConsolidatedAnalysis {
  final_score: number;
  rationale: string;
  red_flags: string[];
  reference_links: ReferenceLink[];
  strengths: string[];
  suggestions: string[];
  verdict: string;
  weaknesses: string[];
}

export interface PagewiseSummary {
  summary: string[];
}

export interface PitchAnalysis {
  cap_table: AnalysisSection;
  competition: AnalysisSection;
  consolidated: ConsolidatedAnalysis;
  financials: AnalysisSection;
  funding: AnalysisSection;
  pagewise_summary: PagewiseSummary;
  problem_solution: AnalysisSection;
  product_service: AnalysisSection;
  sector: AnalysisSection;
  tags_info: PitchTagsInfo;
  team: AnalysisSection;
  thesis_based: {
    ask: string;
    promoter_shareholding: string;
    rationale: string;
    score: number;
    stage: string;
  };
  valuation: AnalysisSection;
}

export interface PitchDetails {
  analysis: PitchAnalysis;
  created_at: string;
  description: string | null;
  file_url: string;
  filename: string;
  id: string;
  tagsinfo: PitchTagsInfo;
  title: string;
}

export interface PitchDetailsResponse {
  data: PitchDetails;
  message: string;
  status: number;
}

// Chat with AI Types
export interface ChatWithAIRequest {
  pitch_id: string;
  question: string;
}

export interface ChatWithAIResponse {
  answer: string;
}

export interface UseChatWithAIReturn {
  chatWithAI: (
    pitchId: string,
    query: string,
    userEmail: string
  ) => Promise<ChatWithAIResponse>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}
