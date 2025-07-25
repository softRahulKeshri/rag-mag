export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  isActive: boolean;
}

export interface NavigationProps {
  activeTab: string;
  onTabChange: (tabId: TabId) => void;
  userEmail?: string;
}

export type TabId = "upload" | "bookmarked" | "chat";
