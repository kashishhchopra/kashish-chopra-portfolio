import { portfolio } from "@/data/portfolio";

/**
 * Merges experience, projects and education into one chronological stream,
 * rendered as a system log. Everything is derived from `portfolio.ts`, so a new
 * project or role appears in the timeline without touching this file.
 */

export type LogLevel = "BOOT" | "RUN" | "DEPLOY" | "TASK";
export type LogStream = "education" | "internship" | "project" | "leadership";

export interface LogEntry {
  id: string;
  level: LogLevel;
  stream: LogStream;
  /** Displayed in the timestamp column. */
  time: string;
  title: string;
  subtitle: string;
  detail: string[];
  tags: string[];
  /** Route this entry links to, when it has one. */
  to?: string;
  live?: boolean;
}

const MONTHS: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

/**
 * Turns "Jun 2026", "2025" or "Expected 2027" into a sortable number.
 * Unparseable input sorts last rather than throwing.
 */
export function sortKey(value: string): number {
  const year = value.match(/\d{4}/);
  if (!year) return 0;
  const month = value.slice(0, 3).toLowerCase();
  return Number(year[0]) * 100 + (MONTHS[month] ?? 12);
}

const LEVEL_BY_STREAM: Record<LogStream, LogLevel> = {
  education: "BOOT",
  internship: "RUN",
  project: "DEPLOY",
  leadership: "TASK",
};

export function buildLog(): LogEntry[] {
  const entries: LogEntry[] = [];

  portfolio.education.forEach((e, i) => {
    entries.push({
      id: `edu-${i}`,
      level: LEVEL_BY_STREAM.education,
      stream: "education",
      time: e.year,
      title: e.qualification,
      subtitle: e.institution,
      detail: [e.score, e.location].filter((x): x is string => !!x),
      tags: [],
      to: "/about",
    });
  });

  portfolio.experience.forEach((e) => {
    const stream: LogStream = e.type === "Internship" ? "internship" : "leadership";
    entries.push({
      id: `exp-${e.id}`,
      level: LEVEL_BY_STREAM[stream],
      stream,
      time: `${e.start} → ${e.end}`,
      title: e.role,
      subtitle: e.organization,
      detail: e.responsibilities,
      tags: e.tools ?? [],
      to: "/experience",
      live: e.current,
    });
  });

  portfolio.projects.forEach((p) => {
    entries.push({
      id: `proj-${p.id}`,
      level: LEVEL_BY_STREAM.project,
      stream: "project",
      time: p.year,
      title: p.name,
      subtitle: p.tagline,
      detail: p.features,
      tags: p.technologies,
      to: `/projects/${p.id}`,
    });
  });

  // Newest first; a currently-running entry always leads its year.
  return entries.sort((a, b) => {
    if (a.live !== b.live) return a.live ? -1 : 1;
    return sortKey(b.time) - sortKey(a.time);
  });
}

export const streamLabels: Record<LogStream, string> = {
  internship: "Internships",
  project: "Projects",
  leadership: "Leadership",
  education: "Education",
};
