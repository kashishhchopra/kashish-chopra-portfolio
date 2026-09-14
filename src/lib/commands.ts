import {
  Copy,
  Github,
  Linkedin,
  Mail,
  RotateCcw,
  FolderTree,
  UserCheck,
  Code2,
  Bot,
  ExternalLink,
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { navItems } from "@/lib/nav";
import type { AudienceMode, Theme } from "@/ui-context";

/**
 * A single registry of everything the site can *do*, shared by the command
 * palette and the assistant. One definition per capability means a new command
 * shows up in both surfaces without being wired twice.
 */

export type CommandGroup = "Navigate" | "Case studies" | "Actions" | "Mode" | "External";

export interface CommandContext {
  navigate: (to: string) => void;
  setMode: (mode: AudienceMode) => void;
  setTheme: (theme: Theme) => void;
  replayBoot: () => void;
  openAssistant: (question?: string) => void;
  /** Reports transient results ("Email copied") back to the caller's UI. */
  notify: (message: string) => void;
}

export interface Command {
  id: string;
  label: string;
  hint?: string;
  group: CommandGroup;
  icon: LucideIcon;
  /** Extra search terms beyond the label. */
  keywords?: string[];
  run: (ctx: CommandContext) => void | Promise<void>;
}

const email = portfolio.contact.find((c) => c.id === "email");
const github = portfolio.contact.find((c) => c.id === "github");
const linkedin = portfolio.contact.find((c) => c.id === "linkedin");

/** Copies text, falling back to a prompt-free failure notice. */
async function copy(value: string, ctx: CommandContext, label: string) {
  try {
    await navigator.clipboard.writeText(value);
    ctx.notify(`${label} copied to clipboard`);
  } catch {
    ctx.notify(`Couldn't copy — ${value}`);
  }
}

const navCommands: Command[] = navItems.map((n) => ({
  id: `nav:${n.path}`,
  label: n.label,
  hint: n.description,
  group: "Navigate",
  icon: n.icon,
  keywords: [n.command, n.path.replace("/", "")],
  run: (ctx) => ctx.navigate(n.path),
}));

const caseStudyCommands: Command[] = portfolio.projects.map((p) => ({
  id: `case:${p.id}`,
  label: p.name,
  hint: p.tagline,
  group: "Case studies",
  icon: Code2,
  keywords: [...p.technologies, ...p.categories, p.id],
  run: (ctx) => ctx.navigate(`/projects/${p.id}`),
}));

const actionCommands: Command[] = [
  ...(email
    ? [
        {
          id: "action:copy-email",
          label: "Copy email address",
          hint: email.value,
          group: "Actions" as const,
          icon: Copy,
          keywords: ["mail", "contact", "reach"],
          run: (ctx: CommandContext) => copy(email.value, ctx, "Email address"),
        },
        {
          id: "action:email",
          label: "Email Kashish",
          hint: email.value,
          group: "Actions" as const,
          icon: Mail,
          keywords: ["hire", "contact", "message"],
          run: () => {
            window.location.href = email.href;
          },
        },
      ]
    : []),
  {
    id: "action:explorer",
    label: "Open file explorer",
    hint: "Browse the portfolio as a filesystem",
    group: "Actions",
    icon: FolderTree,
    keywords: ["tree", "files", "browse", "directory"],
    run: (ctx) => ctx.navigate("/explorer"),
  },
  {
    id: "action:ask",
    label: "Ask the assistant",
    hint: "Open the chat and ask about skills, projects or availability",
    group: "Actions",
    icon: Bot,
    keywords: ["chat", "question", "ai"],
    run: (ctx) => ctx.openAssistant(),
  },
  {
    id: "action:replay-boot",
    label: "Replay boot sequence",
    group: "Actions",
    icon: RotateCcw,
    keywords: ["intro", "animation", "startup"],
    run: (ctx) => ctx.replayBoot(),
  },
];

const modeCommands: Command[] = [
  {
    id: "mode:recruiter",
    label: "Switch to Recruiter Mode",
    hint: "Outcomes, impact and hiring signals first",
    group: "Mode",
    icon: UserCheck,
    keywords: ["hiring", "hr", "simple", "overview"],
    run: (ctx) => {
      ctx.setMode("recruiter");
      ctx.notify("Recruiter Mode — showing outcomes and impact first");
    },
  },
  {
    id: "mode:developer",
    label: "Switch to Developer Mode",
    hint: "Architecture diagrams and engineering decisions expanded",
    group: "Mode",
    icon: Code2,
    keywords: ["technical", "engineer", "architecture", "deep"],
    run: (ctx) => {
      ctx.setMode("developer");
      ctx.notify("Developer Mode — architecture and decisions expanded");
    },
  },
  {
    id: "mode:theme-light",
    label: "Switch to Light theme",
    hint: "Beige and black",
    group: "Mode",
    icon: Sun,
    keywords: ["colour", "color", "beige", "bright", "appearance"],
    run: (ctx) => {
      ctx.setTheme("light");
      ctx.notify("Light theme — beige and black");
    },
  },
  {
    id: "mode:theme-dark",
    label: "Switch to Dark theme",
    hint: "Black and white",
    group: "Mode",
    icon: Moon,
    keywords: ["colour", "color", "night", "appearance"],
    run: (ctx) => {
      ctx.setTheme("dark");
      ctx.notify("Dark theme — black and white");
    },
  },
];

const externalCommands: Command[] = [
  ...(github
    ? [
        {
          id: "ext:github",
          label: "Open GitHub profile",
          hint: github.value,
          group: "External" as const,
          icon: Github,
          run: () => {
            window.open(github.href, "_blank", "noopener,noreferrer");
          },
        },
      ]
    : []),
  ...(linkedin
    ? [
        {
          id: "ext:linkedin",
          label: "Open LinkedIn profile",
          hint: linkedin.value,
          group: "External" as const,
          icon: Linkedin,
          run: () => {
            window.open(linkedin.href, "_blank", "noopener,noreferrer");
          },
        },
      ]
    : []),
  ...portfolio.contact
    .filter((c) => !["email", "github", "linkedin"].includes(c.id))
    .map((c) => ({
      id: `ext:${c.id}`,
      label: `Open ${c.label}`,
      hint: c.value,
      group: "External" as const,
      icon: ExternalLink,
      run: () => {
        window.open(c.href, "_blank", "noopener,noreferrer");
      },
    })),
];

export const commands: Command[] = [
  ...actionCommands,
  ...navCommands,
  ...caseStudyCommands,
  ...modeCommands,
  ...externalCommands,
];

/**
 * Subsequence match — "eka" finds "Enterprise Knowledge Assistant" — with a
 * score that favours earlier and tighter matches so the best hit lands first.
 */
function fuzzyScore(haystack: string, needle: string): number | null {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();

  const direct = h.indexOf(n);
  if (direct !== -1) return 1000 - direct * 2;

  let hi = 0;
  let score = 0;
  let lastHit = -1;
  for (const ch of n) {
    const found = h.indexOf(ch, hi);
    if (found === -1) return null;
    score += found === lastHit + 1 ? 6 : 2;
    if (found === 0 || h[found - 1] === " ") score += 4;
    lastHit = found;
    hi = found + 1;
  }
  return score;
}

export function searchCommands(query: string, list: Command[] = commands): Command[] {
  const q = query.trim().replace(/^\//, "");
  if (!q) return list;

  return list
    .map((c) => {
      const haystacks = [c.label, c.hint ?? "", ...(c.keywords ?? [])];
      const best = haystacks.reduce<number | null>((acc, h) => {
        const s = fuzzyScore(h, q);
        if (s === null) return acc;
        // Matches on the label itself outrank matches on keywords.
        const weighted = h === c.label ? s + 200 : s;
        return acc === null || weighted > acc ? weighted : acc;
      }, null);
      return { c, best };
    })
    .filter((r): r is { c: Command; best: number } => r.best !== null)
    .sort((a, b) => b.best - a.best)
    .map((r) => r.c);
}
