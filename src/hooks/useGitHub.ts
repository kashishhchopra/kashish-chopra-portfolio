import { useEffect, useState } from "react";
import {
  fetchProfile,
  fetchRepos,
  summarizeLanguages,
  GitHubError,
  type GitHubProfile,
  type GitHubRepo,
} from "@/lib/github";

export type GitHubStatus = "idle" | "loading" | "success" | "empty" | "error";

interface GitHubState {
  status: GitHubStatus;
  profile: GitHubProfile | null;
  repos: GitHubRepo[];
  languages: { language: string; count: number }[];
  errorKind: GitHubError["kind"] | null;
  errorMessage: string | null;
}

const initial: GitHubState = {
  status: "idle",
  profile: null,
  repos: [],
  languages: [],
  errorKind: null,
  errorMessage: null,
};

/**
 * Loads live GitHub profile + repos for a username. Exposes explicit
 * loading / empty / error (incl. rate-limit) states — never fabricates data.
 */
export function useGitHub(username: string | undefined) {
  const [state, setState] = useState<GitHubState>(initial);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!username) {
      setState({ ...initial, status: "empty" });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, status: "loading", errorKind: null, errorMessage: null }));

    (async () => {
      try {
        const [profile, repos] = await Promise.all([
          fetchProfile(username),
          fetchRepos(username),
        ]);
        if (cancelled) return;
        const visibleRepos = repos.filter((r) => !r.fork);
        setState({
          status: visibleRepos.length === 0 && profile.public_repos === 0 ? "empty" : "success",
          profile,
          repos: visibleRepos.sort(
            (a, b) => +new Date(b.updated_at) - +new Date(a.updated_at),
          ),
          languages: summarizeLanguages(repos),
          errorKind: null,
          errorMessage: null,
        });
      } catch (err) {
        if (cancelled) return;
        const ge = err instanceof GitHubError ? err : null;
        setState({
          ...initial,
          status: "error",
          errorKind: ge?.kind ?? "unknown",
          errorMessage: ge?.message ?? "Could not load GitHub data.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username, reloadKey]);

  const reload = () => setReloadKey((k) => k + 1);
  return { ...state, reload };
}
