import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import type { EAppSection } from "../types";
import { SECTION_CONFIGS } from "../constants";

interface IPageHeaderProps {
  activeSection: EAppSection;
  onUploadClick: () => void;
}

const PageHeader = ({ activeSection, onUploadClick }: IPageHeaderProps) => {
  const sectionConfig = SECTION_CONFIGS[activeSection];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {sectionConfig.title}
          </h1>
          <p className="text-gray-600 mt-1">{sectionConfig.description}</p>
        </div>

        <button
          onClick={onUploadClick}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-105"
          aria-label="Upload pitch deck"
        >
          <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
          Upload Deck
        </button>
      </div>
    </div>
  );
};

export default PageHeader;
