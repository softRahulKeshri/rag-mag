export interface Resume {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: "uploading" | "processing" | "completed" | "error";
  progress?: number;
  parsedData?: ParsedResumeData;
  error?: string;
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

export interface Group {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  resumeCount: number;
}

export interface UploadState {
  isUploading: boolean;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  errors: Record<string, string>;
}

export interface ResumeParserState {
  groups: Group[];
  selectedGroup: Group | null;
  resumes: Resume[];
  uploadState: UploadState;
  searchQuery: string;
  filters: {
    status: string[];
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
}
