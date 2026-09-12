/**
 * GitHub public API helpers. Read-only, no token required for public data.
 * All functions return typed results; callers handle loading/empty/error/rate-limit.
 */

export interface GitHubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  avatar_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
}

export type GitHubErrorKind = "rate-limit" | "not-found" | "network" | "unknown";

export class GitHubError extends Error {
  kind: GitHubErrorKind;
  constructor(kind: GitHubErrorKind, message: string) {
    super(message);
    this.kind = kind;
    this.name = "GitHubError";
  }
}

const API = "https://api.github.com";

async function ghFetch<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
    });
  } catch {
    throw new GitHubError("network", "Network request to GitHub failed.");
  }

  if (res.status === 403 || res.status === 429) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") {
      throw new GitHubError("rate-limit", "GitHub API rate limit reached. Try again later.");
    }
    throw new GitHubError("rate-limit", "GitHub API request was throttled.");
  }
  if (res.status === 404) {
    throw new GitHubError("not-found", "GitHub user not found.");
  }
  if (!res.ok) {
    throw new GitHubError("unknown", `GitHub API error (${res.status}).`);
  }
  return (await res.json()) as T;
}

export function fetchProfile(username: string): Promise<GitHubProfile> {
  return ghFetch<GitHubProfile>(`${API}/users/${encodeURIComponent(username)}`);
}

export function fetchRepos(username: string): Promise<GitHubRepo[]> {
  return ghFetch<GitHubRepo[]>(
    `${API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
  );
}

/** Aggregate the primary languages across a user's non-forked repos. */
export function summarizeLanguages(repos: GitHubRepo[]): { language: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of repos) {
    if (r.fork || !r.language) continue;
    counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}
