import { Link } from "react-router-dom";
import { Github, Star, GitFork, RefreshCw, AlertTriangle, ArrowRight } from "lucide-react";
import { useGitHub } from "@/hooks/useGitHub";
import { portfolio } from "@/data/portfolio";

/**
 * Compact live GitHub strip: most recently updated public repositories, read
 * from the public API at load. Loading, empty, rate-limited and error states
 * are all explicit — the component never renders a fabricated number.
 */
export default function GitHubActivity({ limit = 4 }: { limit?: number }) {
  const username = import.meta.env.VITE_GITHUB_USERNAME || portfolio.github.username;
  const { status, profile, repos, errorKind, errorMessage, reload } = useGitHub(username);

  return (
    <section aria-labelledby="gh-activity" className="glass-panel overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <h2 id="gh-activity" className="flex items-center gap-2 text-sm font-bold text-white">
          <Github className="h-4 w-4 text-secondary/80" aria-hidden /> Live GitHub activity
        </h2>
        <div className="flex items-center gap-2">
          {status === "success" && profile && (
            <span className="font-mono text-[11px] text-zinc-400">
              {profile.public_repos} public repos
            </span>
          )}
          <button
            type="button"
            onClick={reload}
            className="rounded-md p-1 text-zinc-500 transition-colors hover:text-secondary-soft"
            aria-label="Reload GitHub data"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${status === "loading" ? "animate-spin" : ""}`} aria-hidden />
          </button>
        </div>
      </div>

      <div className="p-4" aria-live="polite">
        {status === "loading" && (
          <ul className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="h-11 animate-pulse rounded-lg bg-white/[0.04]" />
            ))}
          </ul>
        )}

        {status === "error" && (
          <div className="flex items-start gap-2 text-sm text-zinc-400">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
            <span>
              {errorKind === "rate-limit"
                ? "GitHub's public API rate limit was reached — live data will return shortly."
                : errorMessage}
            </span>
          </div>
        )}

        {status === "empty" && (
          <p className="text-sm text-zinc-400">No public repositories to show yet.</p>
        )}

        {status === "success" && (
          <ul className="space-y-1.5">
            {repos.slice(0, limit).map((r) => (
              <li key={r.id}>
                <a
                  href={r.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-3 rounded-lg border border-white/[0.06] px-3 py-2 transition-colors hover:border-secondary/30 hover:bg-white/[0.03]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-xs text-zinc-200 group-hover:text-secondary-soft">
                      {r.name}
                    </span>
                    {r.description && (
                      <span className="block truncate text-[11px] text-zinc-500">{r.description}</span>
                    )}
                  </span>
                  {r.language && (
                    <span className="shrink-0 font-mono text-[10px] text-zinc-400">{r.language}</span>
                  )}
                  <span className="flex shrink-0 items-center gap-2 font-mono text-[10px] text-zinc-500">
                    <span className="inline-flex items-center gap-0.5">
                      <Star className="h-3 w-3" aria-hidden />
                      {r.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-0.5">
                      <GitFork className="h-3 w-3" aria-hidden />
                      {r.forks_count}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-white/10 px-4 py-2.5">
        <Link to="/status" className="inline-flex items-center gap-1 font-mono text-xs text-secondary-soft hover:underline">
          Full system status <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
