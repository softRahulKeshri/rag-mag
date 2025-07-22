// Sidebar component types

export type SidebarSection = "upload" | "search" | "store";

export interface SidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
}

export interface NavigationItem {
  id: SidebarSection;
  title: string;
  description: string;
  icon: React.ReactNode;
}
