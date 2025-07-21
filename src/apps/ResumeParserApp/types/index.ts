import React from "react";

// App Section constants for better type safety and maintainability
export const AppSection = {
  UPLOAD: "upload",
  SEARCH: "search",
  STORE: "store",
} as const;

export type AppSectionType = (typeof AppSection)[keyof typeof AppSection];

// Section configuration interface for dynamic content rendering
export interface ISectionConfig {
  title: string;
  description: string;
  component: React.ComponentType;
}

// Section configuration map for scalable content management
export type SectionConfigMap = Record<AppSectionType, ISectionConfig>;

export interface IResume {
  id: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  status: "uploading" | "processing" | "completed" | "error";
  progress?: number;
  parsedData?: IParsedResumeData;
  error?: string;
}

export interface IParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  experience: IWorkExperience[];
  education: IEducation[];
  skills: string[];
  summary?: string;
}

export interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
  achievements?: string[];
}

export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
}

export interface IGroup {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  resumeCount: number;
}

export interface IUploadState {
  isUploading: boolean;
  selectedFiles: File[];
  uploadProgress: Record<string, number>;
  errors: Record<string, string>;
}

export interface IResumeParserState {
  groups: IGroup[];
  selectedGroup: IGroup | null;
  resumes: IResume[];
  uploadState: IUploadState;
  searchQuery: string;
  filters: {
    status: string[];
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
  };
}
