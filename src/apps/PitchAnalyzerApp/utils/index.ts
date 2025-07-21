import type { IPitchDeck, EPitchDeckStatus, IAppStats } from "../types";
import { FILE_CONSTRAINTS } from "../constants";

export const validateFile = (
  file: File
): { isValid: boolean; error?: string } => {
  const isPdfFile = FILE_CONSTRAINTS.ALLOWED_TYPES.includes(
    file.type as "application/pdf"
  );
  if (!isPdfFile) {
    return { isValid: false, error: "Please select a valid PDF file." };
  }

  const isFileSizeValid = file.size <= FILE_CONSTRAINTS.MAX_SIZE_BYTES;
  if (!isFileSizeValid) {
    return {
      isValid: false,
      error: `File size must be less than ${FILE_CONSTRAINTS.MAX_SIZE_MB}MB.`,
    };
  }

  return { isValid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const kilobyte = 1024;
  const sizeUnits = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte));
  const sizeInUnit = bytes / Math.pow(kilobyte, unitIndex);

  return `${parseFloat(sizeInUnit.toFixed(2))} ${sizeUnits[unitIndex]}`;
};

export const filterPitchDecksByStatus = (
  pitchDecks: IPitchDeck[],
  status: EPitchDeckStatus
): IPitchDeck[] => {
  return pitchDecks.filter((deck) => deck.status === status);
};

export const groupPitchDecksByStatus = (pitchDecks: IPitchDeck[]) => {
  return {
    completed: filterPitchDecksByStatus(pitchDecks, "completed"),
    analyzing: filterPitchDecksByStatus(pitchDecks, "analyzing"),
    uploading: filterPitchDecksByStatus(pitchDecks, "uploading"),
    error: filterPitchDecksByStatus(pitchDecks, "error"),
  };
};

export const calculateAppStats = (pitchDecks: IPitchDeck[]): IAppStats => {
  const completedCount = filterPitchDecksByStatus(
    pitchDecks,
    "completed"
  ).length;
  const analyzingCount = filterPitchDecksByStatus(
    pitchDecks,
    "analyzing"
  ).length;
  const uploadingCount = filterPitchDecksByStatus(
    pitchDecks,
    "uploading"
  ).length;
  const inProgressCount = analyzingCount + uploadingCount;

  const averageScore = completedCount > 0 ? "8.5" : "0.0";

  return {
    total: pitchDecks.length,
    completed: completedCount,
    inProgress: inProgressCount,
    avgScore: averageScore,
  };
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const generateUniqueId = (): string => {
  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substr(2, 9);
  return timestamp + randomString;
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  functionToDebounce: T,
  delayInMs: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => functionToDebounce(...args), delayInMs);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  functionToThrottle: T,
  throttleLimitMs: number
): ((...args: Parameters<T>) => void) => {
  let isThrottled = false;

  return (...args: Parameters<T>) => {
    if (!isThrottled) {
      functionToThrottle(...args);
      isThrottled = true;
      setTimeout(() => (isThrottled = false), throttleLimitMs);
    }
  };
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const convertToTitleCase = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );
};

export const generateId = (): string => {
  return generateUniqueId();
};
