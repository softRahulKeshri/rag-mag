import {
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import type { IPitchDeck } from "../types";
import PitchDeckCard from "./PitchDeckCard";

interface IPitchDeckListingProps {
  pitchDecks: IPitchDeck[];
  onPitchDeckClick?: (pitchDeck: IPitchDeck) => void;
  isLoading?: boolean;
}

const PitchDeckListing = ({
  pitchDecks,
  onPitchDeckClick,
  isLoading = false,
}: IPitchDeckListingProps) => {
  if (isLoading) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Loading Pitch Decks
          </h2>
          <p className="text-gray-600">
            Please wait while we fetch your analysis results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-2xl h-64"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (pitchDecks.length === 0) {
    return (
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-12">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
            <DocumentTextIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            No pitch decks yet
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Upload your first pitch deck to get started with AI-powered analysis
            and insights
          </p>

          {/* Empty State Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-blue-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ArrowUpTrayIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Upload Deck</h4>
              <p className="text-sm text-gray-600">
                Start with your first pitch deck
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">Get Insights</h4>
              <p className="text-sm text-gray-600">AI analyzes your content</p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <DocumentTextIcon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                Review Results
              </h4>
              <p className="text-sm text-gray-600">Detailed analysis reports</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Group decks by status for better organization
  const completedDecks = pitchDecks.filter(
    (deck) => deck.status === "completed"
  );
  const processingDecks = pitchDecks.filter(
    (deck) => deck.status === "analyzing" || deck.status === "uploading"
  );
  const errorDecks = pitchDecks.filter((deck) => deck.status === "error");

  return (
    <div className="space-y-8">
      {/* Processing Section */}
      {processingDecks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Processing</h2>
                <p className="text-sm text-gray-600">
                  {processingDecks.length} deck
                  {processingDecks.length !== 1 ? "s" : ""} being analyzed
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processingDecks.map((pitchDeck) => (
              <PitchDeckCard
                key={pitchDeck.id}
                pitchDeck={pitchDeck}
                onClick={() => onPitchDeckClick?.(pitchDeck)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completedDecks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Completed Analysis
                </h2>
                <p className="text-sm text-gray-600">
                  {completedDecks.length} deck
                  {completedDecks.length !== 1 ? "s" : ""} ready for review
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedDecks.map((pitchDeck) => (
              <PitchDeckCard
                key={pitchDeck.id}
                pitchDeck={pitchDeck}
                onClick={() => onPitchDeckClick?.(pitchDeck)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Section */}
      {errorDecks.length > 0 && (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Failed Analysis
                </h2>
                <p className="text-sm text-gray-600">
                  {errorDecks.length} deck{errorDecks.length !== 1 ? "s" : ""}{" "}
                  with errors
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Error</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {errorDecks.map((pitchDeck) => (
              <PitchDeckCard
                key={pitchDeck.id}
                pitchDeck={pitchDeck}
                onClick={() => onPitchDeckClick?.(pitchDeck)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {pitchDecks.length}
            </div>
            <div className="text-sm text-gray-600">Total Decks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {completedDecks.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {processingDecks.length}
            </div>
            <div className="text-sm text-gray-600">Processing</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {errorDecks.length}
            </div>
            <div className="text-sm text-gray-600">Errors</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PitchDeckListing;
