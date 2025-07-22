// Search Module Types
export interface SearchFilters {
  query: string;
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  group?: string;
}

export interface SearchResult {
  id: string;
  fileName: string;
  original_filename?: string;
  fileSize: number;
  uploadDate: Date;
  status: "uploading" | "processing" | "completed" | "error" | "uploaded";
  progress?: number;
  parsedData?: ParsedResumeData;
  error?: string;
  group?: string;
}

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
