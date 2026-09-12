/**
 * Source-repo links for a project, normalised into one list.
 *
 * Most projects carry a single `github` URL; a few are split across repos and
 * use `repos` instead. Callers render one button per entry, so a single-repo
 * project keeps its plain "Code" label while a split project labels each half.
 */
import type { Project, ProjectRepo } from "@/types";

export function projectRepos(project: Project, singleLabel: string): ProjectRepo[] {
  if (project.repos?.length) return project.repos;
  if (project.github) return [{ label: singleLabel, url: project.github }];
  return [];
}
