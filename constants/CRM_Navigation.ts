import {
  Activity,
  CircleGauge,
  FolderKanban,
  ListTodo,
  UsersRound,
  LucideIcon,
} from "lucide-react";

export interface NavRoute {
  title: string;
  path?: string;
  icon?: LucideIcon;
  ownerOnly?: boolean;
  permissions?: string[];
  roles?: string[];
  children?: NavRoute[];
  group?: string;
}

export const crmRoutes: NavRoute[] = [
  {
    title: "Dashboard",
    icon: CircleGauge,
    path: "/dashboard",
    roles: ["admin", "project_manager", "team_member"],
  },

  {
    group: "Project Management",
    title: "Projects",
    icon: FolderKanban,
    path: "/dashboard/projects",
    roles: ["admin", "project_manager", "team_member"],
  },

  {
    group: "Project Management",
    title: "Tasks",
    icon: ListTodo,
    path: "/dashboard/tasks",
    roles: ["admin", "project_manager", "team_member"],
  },

  {
    group: "Team Collaboration",
    title: "Team Members",
    icon: UsersRound,
    path: "/dashboard/team",
    roles: ["admin", "project_manager", "team_member"],
  },

  {
    group: "Team Collaboration",
    title: "Workload Summary",
    icon: UsersRound,
    path: "/dashboard/team/workload",
    roles: ["admin", "project_manager"],
  },

  {
    title: "Activity Log",
    icon: Activity,
    group: "Analytics and Settings",
    path: "/dashboard/activity-log",
    roles: ["admin", "project_manager"],
  },
];
