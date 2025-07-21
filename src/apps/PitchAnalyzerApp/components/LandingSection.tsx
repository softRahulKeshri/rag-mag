import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowUpTrayIcon,
  UsersIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "./StatsCard";
import QuickActionCard from "./QuickActionCard";
import type { IAppStats } from "../types";

interface ILandingSectionProps {
  stats: IAppStats;
  onUploadClick: () => void;
}

const LandingSection = ({ stats, onUploadClick }: ILandingSectionProps) => {
  return (
    <section className="mb-8">
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
          Transform Your Pitch Deck
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Upload your pitch deck and get instant AI-powered insights,
          competitive analysis, and strategic recommendations to strengthen your
          presentation.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<DocumentTextIcon className="w-6 h-6 text-white" />}
          title="Total Decks"
          value={stats.total}
        />
        <StatsCard
          icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
          title="Completed"
          value={stats.completed}
        />
        <StatsCard
          icon={<ClockIcon className="w-6 h-6 text-white" />}
          title="In Progress"
          value={stats.inProgress}
        />
        <StatsCard
          icon={<ArrowTrendingUpIcon className="w-6 h-6 text-white" />}
          title="Avg Score"
          value={stats.avgScore}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          icon={<ArrowUpTrayIcon className="w-8 h-8 text-white" />}
          title="Upload New Deck"
          description="Start analyzing your pitch deck with AI"
          actionText="Get Started"
          actionColor="text-blue-600"
          onClick={onUploadClick}
        />
        <QuickActionCard
          icon={<UsersIcon className="w-8 h-8 text-white" />}
          title="Team Insights"
          description="Collaborate with your team on analysis"
          actionText="Coming Soon"
          actionColor="text-green-600"
          disabled
        />
        <QuickActionCard
          icon={<TagIcon className="w-8 h-8 text-white" />}
          title="Market Analysis"
          description="Deep dive into market opportunities"
          actionText="Coming Soon"
          actionColor="text-purple-600"
          disabled
        />
      </div>
    </section>
  );
};

export default LandingSection;
