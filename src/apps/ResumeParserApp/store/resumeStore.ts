import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  IResumeParserState,
  IGroup,
  IResume,
  IUploadState,
} from "../types";

interface ResumeParserActions {
  // Group management
  setGroups: (groups: IGroup[]) => void;
  addGroup: (group: IGroup) => void;
  selectGroup: (group: IGroup | null) => void;
  updateGroup: (id: string, updates: Partial<IGroup>) => void;
  deleteGroup: (id: string) => void;

  // Resume management
  setResumes: (resumes: IResume[]) => void;
  addResume: (resume: IResume) => void;
  updateResume: (id: string, updates: Partial<IResume>) => void;
  deleteResume: (id: string) => void;
  updateResumeProgress: (id: string, progress: number) => void;
  setResumeStatus: (id: string, status: IResume["status"]) => void;

  // Upload management
  setUploadState: (state: Partial<IUploadState>) => void;
  addSelectedFiles: (files: File[]) => void;
  removeSelectedFile: (fileName: string) => void;
  clearSelectedFiles: () => void;
  setUploadProgress: (fileName: string, progress: number) => void;
  setUploadError: (fileName: string, error: string) => void;
  clearUploadErrors: () => void;

  // Search and filters
  setSearchQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setDateRangeFilter: (start: Date | null, end: Date | null) => void;
  clearFilters: () => void;

  // Utility actions
  resetState: () => void;
}

const initialState: IResumeParserState = {
  groups: [
    {
      id: "1",
      name: "Software Engineers",
      description: "Engineering team candidates",
      createdAt: new Date("2024-01-01"),
      resumeCount: 0,
    },
    {
      id: "2",
      name: "Product Managers",
      description: "Product team candidates",
      createdAt: new Date("2024-01-02"),
      resumeCount: 0,
    },
    {
      id: "3",
      name: "Designers",
      description: "Design team candidates",
      createdAt: new Date("2024-01-03"),
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

export const useResumeStore = create<
  IResumeParserState & ResumeParserActions
>()(
  devtools(
    (set) => ({
      ...initialState,

      // Group management
      setGroups: (groups: IGroup[]) => set({ groups }),
      addGroup: (group: IGroup) =>
        set((state) => ({
          groups: [...state.groups, group],
        })),
      selectGroup: (group: IGroup | null) => set({ selectedGroup: group }),
      updateGroup: (id: string, updates: Partial<IGroup>) =>
        set((state) => ({
          groups: state.groups.map((group: IGroup) =>
            group.id === id ? { ...group, ...updates } : group
          ),
        })),
      deleteGroup: (id: string) =>
        set((state) => ({
          groups: state.groups.filter((group: IGroup) => group.id !== id),
          selectedGroup:
            state.selectedGroup?.id === id ? null : state.selectedGroup,
        })),

      // Resume management
      setResumes: (resumes: IResume[]) => set({ resumes }),
      addResume: (resume: IResume) =>
        set((state) => ({
          resumes: [...state.resumes, resume],
        })),
      updateResume: (id: string, updates: Partial<IResume>) =>
        set((state) => ({
          resumes: state.resumes.map((resume: IResume) =>
            resume.id === id ? { ...resume, ...updates } : resume
          ),
        })),
      deleteResume: (id: string) =>
        set((state) => ({
          resumes: state.resumes.filter((resume: IResume) => resume.id !== id),
        })),
      updateResumeProgress: (id: string, progress: number) =>
        set((state) => ({
          resumes: state.resumes.map((resume: IResume) =>
            resume.id === id ? { ...resume, progress } : resume
          ),
        })),
      setResumeStatus: (id: string, status: IResume["status"]) =>
        set((state) => ({
          resumes: state.resumes.map((resume: IResume) =>
            resume.id === id ? { ...resume, status } : resume
          ),
        })),

      // Upload management
      setUploadState: (state: Partial<IUploadState>) =>
        set((currentState) => ({
          uploadState: { ...currentState.uploadState, ...state },
        })),
      addSelectedFiles: (files: File[]) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            selectedFiles: [...state.uploadState.selectedFiles, ...files],
          },
        })),
      removeSelectedFile: (fileName: string) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            selectedFiles: state.uploadState.selectedFiles.filter(
              (file: File) => file.name !== fileName
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
      setUploadProgress: (fileName: string, progress: number) =>
        set((state) => ({
          uploadState: {
            ...state.uploadState,
            uploadProgress: {
              ...state.uploadState.uploadProgress,
              [fileName]: progress,
            },
          },
        })),
      setUploadError: (fileName: string, error: string) =>
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

      // Search and filters
      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      setStatusFilter: (statuses: string[]) =>
        set((state) => ({
          filters: { ...state.filters, status: statuses },
        })),
      setDateRangeFilter: (start: Date | null, end: Date | null) =>
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
