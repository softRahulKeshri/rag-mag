import React from "react";
import type { LoadingStateProps } from "../types";
import { ResumeSearchSkeleton } from "../../../components/ResumeSkeleton";

/**
 * LoadingState Component
 *
 * Modern skeleton loading interface with animations.
 *
 * Features:
 * - Animated skeleton cards
 * - Shimmer effects
 * - Realistic content placeholders
 * - Responsive design
 * - Professional loading indicators
 */
const LoadingState: React.FC<LoadingStateProps> = ({ isSearching }) => {
  if (!isSearching) return null;

  return <ResumeSearchSkeleton />;
};

export default LoadingState;
