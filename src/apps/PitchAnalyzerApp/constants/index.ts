import { EPitchDeckStatus } from "../types";

export const FILE_CONSTRAINTS = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_TYPES: ["application/pdf"],
  ALLOWED_EXTENSIONS: [".pdf"],
} as const;

export const UI_CONSTRAINTS = {
  MAX_CHAT_MESSAGE_LENGTH: 100,
  MAX_TAGS_DISPLAY: 3,
  PAGINATION_ITEMS_PER_PAGE: 12,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const STATUS_CONFIGS = {
  completed: {
    color: "bg-gradient-to-r from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    label: "Completed",
    progress: 100,
  },
  analyzing: {
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Analyzing",
    progress: 65,
  },
  uploading: {
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Uploading",
    progress: 30,
  },
  error: {
    color: "bg-gradient-to-r from-red-500 to-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Error",
    progress: 0,
  },
} as const;

export const NAVIGATION_ITEMS = [
  { id: "landing", label: "Dashboard" },
  { id: "upload", label: "Upload" },
  { id: "processing", label: "Processing" },
  { id: "results", label: "Results" },
] as const;

export const SECTION_CONFIGS = {
  landing: {
    title: "Dashboard",
    description: "Overview and insights",
  },
  upload: {
    title: "Upload Pitch Deck",
    description: "Upload your pitch deck for analysis",
  },
  processing: {
    title: "Processing",
    description: "AI is analyzing your deck",
  },
  results: {
    title: "Analysis Results",
    description: "Review your analysis results",
  },
} as const;

export const UPLOAD_SIMULATION = {
  PROGRESS_INCREMENT: 10,
  PROGRESS_DELAY_MS: 200,
  ANALYSIS_DELAY_MS: 2000,
} as const;

export const SAMPLE_PITCH_DECKS = [
  {
    id: "1",
    name: "Example Pitch Deck",
    fileName: "example-pitch.pdf",
    uploadDate: new Date("2024-01-15"),
    status: EPitchDeckStatus.COMPLETED,
    tags: [
      { key: "Industry", value: "Tech" },
      { key: "Stage", value: "Series A" },
      { key: "Team Size", value: "15-20" },
    ],
    analysis: {
      industry: "Technology",
      stage: "Series A",
      fundingAmount: "$5M",
      teamSize: "15-20",
      marketSize: "$50B",
      competitiveAdvantage: "AI-powered solution",
      risks: ["Market competition", "Regulatory changes"],
      recommendations: [
        "Focus on enterprise sales",
        "Expand to international markets",
      ],
    },
  },
  {
    id: "2",
    name: "Another Pitch Deck",
    fileName: "another-pitch.pdf",
    uploadDate: new Date("2024-01-10"),
    status: EPitchDeckStatus.COMPLETED,
    tags: [
      { key: "Industry", value: "FinTech" },
      { key: "Stage", value: "Seed" },
    ],
    analysis: {
      industry: "FinTech",
      stage: "Seed",
      fundingAmount: "$2M",
      teamSize: "5-10",
      marketSize: "$25B",
      competitiveAdvantage: "Blockchain technology",
      risks: ["Regulatory compliance", "Security concerns"],
      recommendations: ["Partner with established banks", "Invest in security"],
    },
  },
];

export const DEFAULT_ANALYSIS = {
  industry: "Technology",
  stage: "Series A",
  fundingAmount: "$3M",
  teamSize: "10-15",
  marketSize: "$30B",
  competitiveAdvantage: "Innovative approach",
  risks: ["Market volatility", "Competition"],
  recommendations: ["Focus on product-market fit", "Build strong partnerships"],
};

export const ERROR_MESSAGES = {
  NO_FILE_SELECTED: "Please select a file to analyze.",
  INVALID_FILE: "Invalid file selected.",
  ANALYSIS_FAILED: "Failed to analyze pitch deck. Please try again.",
} as const;
