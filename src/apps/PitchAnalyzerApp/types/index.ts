export const EPitchDeckStatus = {
  UPLOADING: "uploading",
  ANALYZING: "analyzing",
  COMPLETED: "completed",
  ERROR: "error",
} as const;

export type EPitchDeckStatus =
  (typeof EPitchDeckStatus)[keyof typeof EPitchDeckStatus];

export const EAppSection = {
  LANDING: "landing",
  UPLOAD: "upload",
  PROCESSING: "processing",
  RESULTS: "results",
} as const;

export type EAppSection = (typeof EAppSection)[keyof typeof EAppSection];

export const EChatRole = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type EChatRole = (typeof EChatRole)[keyof typeof EChatRole];

export interface IPitchTag {
  key: string;
  value: string;
  color?: string;
}

export interface IPitchAnalysis {
  industry: string;
  stage: string;
  fundingAmount?: string;
  teamSize?: string;
  marketSize?: string;
  competitiveAdvantage?: string;
  risks?: string[];
  recommendations?: string[];
}

export interface IPitchDeck {
  id: string;
  name: string;
  fileName: string;
  uploadDate: Date;
  tags: IPitchTag[];
  status: EPitchDeckStatus;
  analysis?: IPitchAnalysis;
}

export interface IUploadState {
  selectedFile: File | null;
  isUploading: boolean;
  uploadProgress: number;
}

export interface IPitchAnalyzerState {
  pitchDecks: IPitchDeck[];
  uploadState: IUploadState;
  isLoading: boolean;
  error: string | null;
}

export interface IPitchAnalyzerAppProps {
  className?: string;
}

export interface ISidebarProps {
  activeSection: EAppSection;
  onSectionChange: (section: EAppSection) => void;
}

export interface IFileUploadSectionProps {
  uploadState: IUploadState;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  onAnalyze: () => void;
}

export interface IPitchDeckCardProps {
  pitchDeck: IPitchDeck;
  onClick?: () => void;
}

export interface IPitchDeckListingProps {
  pitchDecks: IPitchDeck[];
  onPitchDeckClick?: (pitchDeck: IPitchDeck) => void;
  isLoading?: boolean;
}

export interface IErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export interface IPitchChatWidgetProps {
  pitchDecks: IPitchDeck[];
  isOpen: boolean;
  onToggle: () => void;
}

export interface INavigationItem {
  id: EAppSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface IAppStats {
  total: number;
  completed: number;
  inProgress: number;
  avgScore: string;
}

export interface IChatMessage {
  id: string;
  content: string;
  role: EChatRole;
  timestamp: Date;
}

export interface IPitchDeckStats {
  completed: number;
  analyzing: number;
  uploading: number;
  total: number;
}

export interface IChatConfig {
  maxCharacters: number;
  typingDelay: number;
  initialMessage: string;
}

export interface IPitchAnalyzerHook {
  state: IPitchAnalyzerState;
  completedDecks: IPitchDeck[];
  analyzingDecks: IPitchDeck[];
  uploadingDecks: IPitchDeck[];
  handleFileSelect: (file: File) => void;
  handleFileRemove: () => void;
  handleAnalyze: () => void;
  handlePitchDeckClick: (pitchDeck: IPitchDeck) => void;
  clearError: () => void;
  cleanup: () => void;
}
