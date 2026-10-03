import {
  Send,
  Frame,
  PieChart,
  type LucideIcon,
  FolderKanban,
  Notebook,
  AlarmClockCheck,
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
      title: "Tasks",
      url: "/tasks",
      icon: AlarmClockCheck,
      items: [
        { title: "new Task", url: "/tasks/new" },
        { title: "my Tasks", url: "/tasks" },
      ],
    },
    {
      title: "Notes",
      url: "/notes",
      icon: Notebook,
      isActive: false,
      items: [
        { title: "New note", url: "/notes/new" },
        { title: "My notes", url: "/notes" },
      ],
    },
    {
      title: "Projects",
      url: "/projects",
      icon: FolderKanban,
      items: [
        { title: "New project", url: "/projects/new" },
        { title: "All projects", url: "/projects" },
      ],
    },
  ],
  navSecondary: [{ title: "Feedback", url: "/feedback", icon: Send }],
  projects: [
    { name: "Project dashboard", url: "/projects/dashboard", icon: Frame },
    { name: "OCR project", url: "/projects/ocr", icon: PieChart },
  ],
};
