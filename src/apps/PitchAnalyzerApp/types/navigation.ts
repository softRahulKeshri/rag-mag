export interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: TabId) => void;
  userEmail?: string;
}

export type TabId = "upload" | "chat";
