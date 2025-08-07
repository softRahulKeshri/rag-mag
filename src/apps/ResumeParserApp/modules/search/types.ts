// Search API and component types for Resume Search functionality

/**
 * Search Filters Interface
 * Used for filtering search results by various criteria
 */
export interface SearchFilters {
  query: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  group?: string | undefined; // Group ID or undefined for "All Groups"
}

/**
 * Complete Search API Response Structure
 * Matches the backend API response format
 */
export interface SearchApiResponse {
  answer: {
    candidate_details: CandidateDetail[];
    summary: string;
  };
  results: SearchResult[];
}

/**
 * Individual Candidate Details from API
 * Contains candidate information and scoring
 */
export interface CandidateDetail {
  candidate_name: string;
  college: string[];
  comment?: string | null;
  commented_at?: string | null;
  cv_id: number;
  details: string;
  email: string[];
  file_name: string;
  job_profile: string;
  phone: string[];
  score_card: ScoreCard;
  total_experience: string;
}

/**
 * Score Card for candidate evaluation
 * Contains various scoring metrics
 */
export interface ScoreCard {
  clarity_score: number;
  experience_score: number;
  loyalty_score: number;
  reputation_score: number;
}

/**
 * Raw search result chunk from API
 * Contains document chunk information
 */
export interface SearchResult {
  chunk_index: number;
  id: string;
  score: number;
  source_file: string;
  text: string;
  group: string;
}

/**
 * Transformed Candidate Result for UI
 * Frontend-optimized candidate representation
 */
export interface CandidateResult {
  id: string;
  name: string;
  email?: string[];
  phone?: string[];
  location?: string;
  currentRole?: string;
  jobProfile?: string;
  totalExperience?: string;
  college?: string[];
  skills?: string[];
  matchScore?: number;
  filename?: string;
  rawText?: string;
  highlights?: string[];
  clarityScore?: number;
  experienceScore?: number;
  loyaltyScore?: number;
  reputationScore?: number;
  averageScore?: number;
  details?: string;
  group?: string;
  comment?: string | null;
  commentedAt?: string | null;
  cvId?: number;
}

/**
 * Group Interface for filtering
 * Represents resume groups/categories
 */
export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  resumeCount?: number;
}

/**
 * Search Component Props
 */
export interface ResumeSearchProps {
  onSearchResults?: (results: CandidateResult[]) => void;
}

/**
 * HeroSection Component Props
 */
export interface HeroSectionProps {
  activeTab: number;
  onTabChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newValue: number
  ) => void;
  children: React.ReactNode;
}

/**
 * SearchInput Component Props
 */
export interface SearchInputProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onSearch: () => void;
  isSearching: boolean;
  groups: Group[];
}

/**
 * UploadJD Component Props
 */
export interface UploadJDProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  selectedGroup: string;
  setSelectedGroup: (group: string) => void;
  onUpload: () => void;
  isUploading: boolean;
  groups: Group[];
  error: string | null;
  setError: (error: string | null) => void;
}

/**
 * SearchResults Component Props
 */
export interface SearchResultsProps {
  searchResults: CandidateResult[];
  searchSummary: string | null;
  selectedGroup: string;
  onClearSearch: () => void;
}

/**
 * CandidateCard Component Props
 */
export interface CandidateCardProps {
  candidate: CandidateResult;
  onViewDetails?: (candidate: CandidateResult) => void;
}

/**
 * LoadingState Component Props
 */
export interface LoadingStateProps {
  isSearching: boolean;
}

/**
 * EmptyState Component Props
 */
export interface EmptyStateProps {
  hasSearched: boolean;
  isSearching: boolean;
}

/**
 * NoResults Component Props
 */
export interface NoResultsProps {
  onClearSearch: () => void;
}

/**
 * Legacy interfaces (keeping for backward compatibility)
 */
export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: string[];
  summary?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}
