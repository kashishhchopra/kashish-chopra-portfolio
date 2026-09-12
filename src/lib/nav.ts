import {
  User,
  FolderGit2,
  Cpu,
  Briefcase,
  Mail,
  Activity,
  Home,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  command: string; // e.g. "/projects"
  label: string;
  path: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Central navigation registry. Used by NavigationConsole, HeroCommandCenter,
 * CommandTerminal, VoiceController and the assistant so every entry point stays
 * in sync.
 */
export const navItems: NavItem[] = [
  { command: "/home", label: "Home", path: "/", icon: Home, description: "Return to the command center" },
  { command: "/about", label: "About", path: "/about", icon: User, description: "AI identity & profile" },
  { command: "/projects", label: "Projects", path: "/projects", icon: FolderGit2, description: "Project mission database" },
  { command: "/skills", label: "Skills", path: "/skills", icon: Cpu, description: "Capability matrix" },
  { command: "/experience", label: "Experience", path: "/experience", icon: Briefcase, description: "Career timeline" },
  { command: "/status", label: "System Status", path: "/status", icon: Activity, description: "Live system dashboard" },
  { command: "/contact", label: "Contact", path: "/contact", icon: Mail, description: "Contact terminal" },
];

// The primary modules surfaced on the hero command center.
export const primaryModules = ["/projects", "/skills", "/experience", "/contact"];

export function findNavByCommand(input: string): NavItem | undefined {
  const cmd = input.trim().toLowerCase().replace(/\s+/g, "");
  const normalized = cmd.startsWith("/") ? cmd : `/${cmd}`;
  return navItems.find((n) => n.command === normalized);
}
