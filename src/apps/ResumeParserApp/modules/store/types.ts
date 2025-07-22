// Store Module Types
export interface StoreResume {
  id: number;
  filename: string;
  original_filename?: string;
  stored_filename?: string;
  filepath?: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  status: "uploaded" | "processing" | "completed" | "failed";
  group?: string;
  comment?: ResumeComment;
}

export interface ResumeComment {
  id: number;
  resumeId: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  hrName?: string;
}

export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  created_at?: string;
  resumeCount?: number;
  resume_count?: number;
}

export interface GroupStat {
  group: string;
  count: number;
  hasResumes: boolean;
  groupId: number;
}

export interface ResumeCollectionProps {
  resumes: StoreResume[];
  onView?: (resume: StoreResume) => void;
  onDownload?: (resume: StoreResume) => void;
  onDelete?: (resume: StoreResume) => void;
  onResumeDeleted?: (resumeId: number) => void;
  onResumeUpdated?: (resumeId: number, updatedResume: StoreResume) => void;
  onRefreshResumes?: () => Promise<void>;
  isLoading?: boolean;
}
