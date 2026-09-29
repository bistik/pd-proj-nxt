import {
  SquareTerminal,
  Settings2,
  LifeBuoy,
  Send,
  Frame,
  PieChart,
  type LucideIcon,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

export interface NavSecondaryItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface NavProjectItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface NavigationConfig {
  navMain: NavMainItem[];
  navSecondary: NavSecondaryItem[];
  projects: NavProjectItem[];
}

export const navigationConfig: NavigationConfig = {
  navMain: [
    {
      title: "Notes",
      url: "/notes",
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: "New note", url: "/notes/new" },
        { title: "Starred", url: "/playground/starred" },
        { title: "Settings", url: "/playground/settings" },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        { title: "General", url: "/settings/general" },
        { title: "Team", url: "/settings/team" },
      ],
    },
  ],
  navSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
  projects: [
    { name: "Project dashboard", url: "/projects/dashboard", icon: Frame },
    { name: "OCR project", url: "/projects/ocr", icon: PieChart },
  ],
};
