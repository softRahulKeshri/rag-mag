import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  ResumeParserState,
  Group,
  Resume,
  UploadState,
  UploadedFile,
} from "../types";

interface ResumeParserActions {
  // Group management
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  selectGroup: (group: Group | null) => void;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;

  // Resume management
  setResumes: (resumes: Resume[]) => void;
  addResume: (resume: Resume) => void;
  updateResume: (id: string, updates: Partial<Resume>) => void;
  deleteResume: (id: string) => void;
  updateResumeProgress: (id: string, progress: number) => void;
  setResumeStatus: (id: string, status: Resume["status"]) => void;

  // Upload management
  setUploadState: (state: Partial<UploadState>) => void;
  addSelectedFiles: (files: File[]) => void;
  removeSelectedFile: (fileName: string) => void;
  clearSelectedFiles: () => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  setUploadError: (fileName: string, error: string) => void;
  clearUploadErrors: () => void;
  addUploadedFile: (file: UploadedFile) => void;
  clearUploadedFiles: () => void;
  setUploadStatus: (status: UploadState["uploadStatus"]) => void;

  // Search and filters
  setSearchQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setDateRangeFilter: (start: Date | null, end: Date | null) => void;
  clearFilters: () => void;

  // Utility actions
  resetState: () => void;
}

const initialState: ResumeParserState = {
  groups: [
    {
      id: "1",
      name: "AI",
      description: "AI and Machine Learning team",
      createdAt: new Date("2024-01-01"),
      resumeCount: 0,
    },
    {
      id: "2",
      name: "Software Engineers",
      description: "Engineering team candidates",
      createdAt: new Date("2024-01-02"),
      resumeCount: 0,
    },
    {
      id: "3",
      name: "Product Managers",
      description: "Product team candidates",
      createdAt: new Date("2024-01-03"),
      resumeCount: 0,
    },
    {
      id: "4",
      name: "Designers",
      description: "Design team candidates",
      createdAt: new Date("2024-01-04"),
      resumeCount: 0,
    },
  ],
  selectedGroup: null,
  resumes: [],
  uploadState: {
    isUploading: false,
    selectedFiles: [],
    uploadProgress: {},
    errors: {},
    uploadStatus: "idle",
    uploadedFiles: [],
  },
  searchQuery: "",
  filters: {
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
  },
};

export const useResumeStore = create<ResumeParserState & ResumeParserActions>()(
  devtools(
    (set) => ({
      ...initialState,

      // Group management
      setGroups: (groups) => set({ groups }),
      addGroup: (group) =>
        set((state) => ({
          groups: [...state.groups, group],
        })),
      selectGroup: (group) => set({ selectedGroup: group }),
      updateGroup: (id, updates) =>
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === id ? { ...group, ...updates } : group
          ),
        })),
      deleteGroup: (id) =>
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
          selectedGroup:
            state.selectedGroup?.id === id ? null : state.selectedGroup,
        })),

      // Resume management
      setResumes: (resumes) => set({ resumes }),
      addResume: (resume) =>
        set((state) => ({
          resumes: [...state.resumes, resume],
        })),
      updateResume: (id, updates) =>
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === id ? { ...resume, ...updates } : resume
          ),
        })),
      deleteResume: (id) =>
        set((state) => ({
          resumes: state.resumes.filter((resume) => resume.id !== id),
        })),
      updateResumeProgress: (id, progress) =>
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === id ? { ...resume, progress } : resume
          ),
        })),
      setResumeStatus: (id, status) =>
        set((state) => ({
          resumes: state.resumes.map((resume) =>
            resume.id === id ? { ...resume, status } : resume
          ),
        })),

      // Upload management
      setUploadState: (state) =>
        set((currentState) => ({
          uploadState: { ...currentState.uploadState, ...state },
        })),
      addSelectedFiles: (files) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            selectedFiles: [...state.uploadState.selectedFiles, ...files],
          },
        })),
      removeSelectedFile: (fileName) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            selectedFiles: state.uploadState.selectedFiles.filter(
              (file) => file.name !== fileName
            ),
          },
        })),
      clearSelectedFiles: () =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            selectedFiles: [],
            uploadProgress: {},
            errors: {},
          },
        })),
      setUploadProgress: (fileName, progress) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            uploadProgress: {
              ...state.uploadState.uploadProgress,
              [fileName]: progress,
            },
          },
        })),
      setUploadError: (fileName, error) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            errors: {
              ...state.uploadState.errors,
              [fileName]: error,
            },
          },
        })),
      clearUploadErrors: () =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            errors: {},
          },
        })),
      addUploadedFile: (file) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            uploadedFiles: [...state.uploadState.uploadedFiles, file],
          },
        })),
      clearUploadedFiles: () =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            uploadedFiles: [],
          },
        })),
      setUploadStatus: (status) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            uploadStatus: status,
          },
        })),

      // Search and filters
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setStatusFilter: (statuses) =>
        set((state) => ({
          filters: { ...state.filters, status: statuses },
        })),
      setDateRangeFilter: (start, end) =>
        set((state) => ({
          filters: {
            ...state.filters,
            dateRange: { start, end },
          },
        })),
      clearFilters: () =>
        set(() => ({
          filters: {
            status: [],
            dateRange: { start: null, end: null },
          },
        })),

      // Utility actions
      resetState: () => set(initialState),
    }),
    {
      name: "resume-parser-store",
    }
  )
);
