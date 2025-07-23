// Sidebar component types
import { Section } from "./shared";

export interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export interface NavigationItem {
  id: Section;
  title: string;
  description: string;
  icon: React.ReactNode;
}
