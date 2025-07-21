import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import type {
  IPitchAnalyzerState,
  IPitchDeck,
  IPitchAnalysis,
  IPitchAnalyzerHook,
} from "../types";
import { EPitchDeckStatus } from "../types";
import { validateFile, generateId } from "../utils";
import {
  SAMPLE_PITCH_DECKS,
  DEFAULT_ANALYSIS,
  UPLOAD_SIMULATION,
  ERROR_MESSAGES,
} from "../constants";

const INITIAL_STATE: IPitchAnalyzerState = {
  pitchDecks: SAMPLE_PITCH_DECKS,
  uploadState: {
    selectedFile: null,
    isUploading: false,
    uploadProgress: 0,
  },
  isLoading: false,
  error: null,
};

const usePitchAnalyzer = (): IPitchAnalyzerHook => {
  const [state, setState] = useState<IPitchAnalyzerState>(INITIAL_STATE);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const completedDecks = useMemo(
    () =>
      state.pitchDecks.filter(
        (deck) => deck.status === EPitchDeckStatus.COMPLETED
      ),
    [state.pitchDecks]
  );

  const analyzingDecks = useMemo(
    () =>
      state.pitchDecks.filter(
        (deck) => deck.status === EPitchDeckStatus.ANALYZING
      ),
    [state.pitchDecks]
  );

  const uploadingDecks = useMemo(
    () =>
      state.pitchDecks.filter(
        (deck) => deck.status === EPitchDeckStatus.UPLOADING
      ),
    [state.pitchDecks]
  );

  const updateState = useCallback(
    (updater: (prev: IPitchAnalyzerState) => IPitchAnalyzerState) => {
      if (isMountedRef.current) {
        setState(updater);
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    (file: File) => {
      const validation = validateFile(file);

      if (!validation.isValid) {
        updateState((prev) => ({
          ...prev,
          error: validation.error || ERROR_MESSAGES.INVALID_FILE,
        }));
        return;
      }

      updateState((prev) => ({
        ...prev,
        uploadState: {
          ...prev.uploadState,
          selectedFile: file,
        },
        error: null,
      }));
    },
    [updateState]
  );

  const handleFileRemove = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      uploadState: {
        ...prev.uploadState,
        selectedFile: null,
        uploadProgress: 0,
      },
      error: null,
    }));
  }, [updateState]);

  const simulateUploadProgress = useCallback(async () => {
    for (let i = 0; i <= 100; i += UPLOAD_SIMULATION.PROGRESS_INCREMENT) {
      if (!isMountedRef.current) return;

      await new Promise((resolve) =>
        setTimeout(resolve, UPLOAD_SIMULATION.PROGRESS_DELAY_MS)
      );

      updateState((prev) => ({
        ...prev,
        uploadState: {
          ...prev.uploadState,
          uploadProgress: i,
        },
      }));
    }
  }, [updateState]);

  const createPitchDeck = useCallback(
    (fileName: string): IPitchDeck => ({
      id: generateId(),
      name: fileName.replace(".pdf", ""),
      fileName,
      uploadDate: new Date(),
      status: EPitchDeckStatus.UPLOADING,
      tags: [],
    }),
    []
  );

  const generateTagsFromAnalysis = useCallback(
    (analysis: IPitchAnalysis) => [
      { key: "Industry", value: analysis.industry },
      { key: "Stage", value: analysis.stage },
      ...(analysis.teamSize
        ? [{ key: "Team Size", value: analysis.teamSize }]
        : []),
    ],
    []
  );

  const handleAnalyze = useCallback(async () => {
    if (!state.uploadState.selectedFile) {
      updateState((prev) => ({
        ...prev,
        error: ERROR_MESSAGES.NO_FILE_SELECTED,
      }));
      return;
    }

    const newPitchDeck = createPitchDeck(state.uploadState.selectedFile.name);

    try {
      updateState((prev) => ({
        ...prev,
        pitchDecks: [newPitchDeck, ...prev.pitchDecks],
        uploadState: {
          ...prev.uploadState,
          isUploading: true,
          uploadProgress: 0,
        },
        isLoading: true,
        error: null,
      }));

      await simulateUploadProgress();

      updateState((prev) => ({
        ...prev,
        pitchDecks: prev.pitchDecks.map((deck) =>
          deck.id === newPitchDeck.id
            ? { ...deck, status: EPitchDeckStatus.ANALYZING }
            : deck
        ),
      }));

      await new Promise((resolve) =>
        setTimeout(resolve, UPLOAD_SIMULATION.ANALYSIS_DELAY_MS)
      );

      if (!isMountedRef.current) return;

      const analysis: IPitchAnalysis = { ...DEFAULT_ANALYSIS };
      const tags = generateTagsFromAnalysis(analysis);

      updateState((prev) => ({
        ...prev,
        pitchDecks: prev.pitchDecks.map((deck) =>
          deck.id === newPitchDeck.id
            ? { ...deck, status: EPitchDeckStatus.COMPLETED, tags, analysis }
            : deck
        ),
        uploadState: {
          selectedFile: null,
          isUploading: false,
          uploadProgress: 0,
        },
        isLoading: false,
      }));
    } catch (error) {
      if (!isMountedRef.current) return;

      console.error("Analysis failed:", error);
      updateState((prev) => ({
        ...prev,
        pitchDecks: prev.pitchDecks.map((deck) =>
          deck.id === newPitchDeck.id
            ? { ...deck, status: EPitchDeckStatus.ERROR }
            : deck
        ),
        uploadState: {
          selectedFile: null,
          isUploading: false,
          uploadProgress: 0,
        },
        isLoading: false,
        error: ERROR_MESSAGES.ANALYSIS_FAILED,
      }));
    }
  }, [
    state.uploadState.selectedFile,
    updateState,
    createPitchDeck,
    simulateUploadProgress,
    generateTagsFromAnalysis,
  ]);

  const handlePitchDeckClick = useCallback((pitchDeck: IPitchDeck) => {
    console.log("Pitch deck clicked:", pitchDeck);
  }, []);

  const clearError = useCallback(() => {
    updateState((prev) => ({ ...prev, error: null }));
  }, [updateState]);

  return {
    state,
    completedDecks,
    analyzingDecks,
    uploadingDecks,
    handleFileSelect,
    handleFileRemove,
    handleAnalyze,
    handlePitchDeckClick,
    clearError,
    cleanup: () => {
      isMountedRef.current = false;
    },
  };
};

export default usePitchAnalyzer;
