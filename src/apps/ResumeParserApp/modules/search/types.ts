// Search Module Types
export interface SearchFilters {
  query: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  group?: string | undefined; // Group ID or undefined for "All Groups"
}

// New API Response Types
export interface SearchApiResponse {
  answer: {
    candidate_details: CandidateDetail[];
    summary: string;
  };
  results: SearchResult[];
}

export interface CandidateDetail {
  candidate_name: string;
  details: string;
  file_name: string;
  score_card: ScoreCard;
  comment?: string;
  commented_at?: string;
}

export interface ScoreCard {
  clarity_score: number;
  experience_score: number;
  loyalty_score: number;
  reputation_score: number;
}

export interface SearchResult {
  chunk_index: number;
  id: string;
  score: number;
  source_file: string;
  text: string;
  group: string;
}

// Legacy types for backward compatibility
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
